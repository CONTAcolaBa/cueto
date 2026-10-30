import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { normalizeVideoFormat, type VideoFormat } from "@/lib/media";

export type PageComment = {
  image_url: string;
  time: string;
  name: string;
  text: string;
};

export type PageFaq = {
  question: string;
  answer: string;
};

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  video_format: VideoFormat;
  button_text: string;
  button_link: string;
  visits: number;
  clicks: number;
  comments: PageComment[];
  faqs: PageFaq[];
  base_raised: number;
  base_donations: number;
  goal: number;
  paid_raised: number;
  paid_donations: number;
  pix_key: string;
  created_at: string;
};

export type PageContent = Pick<
  PageRecord,
  | "slug"
  | "title"
  | "subtitle"
  | "description"
  | "image_url"
  | "video_format"
  | "button_text"
  | "button_link"
  | "comments"
  | "faqs"
  | "goal"
  | "pix_key"
> & { raised: number; donations: number };

export type PageInput = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  video_format?: VideoFormat;
  button_text: string;
  button_link: string;
  comments?: PageComment[];
  faqs?: PageFaq[];
  base_raised?: number;
  base_donations?: number;
  goal?: number;
  pix_key?: string;
};

function validateComments(comments: PageComment[] | undefined): PageComment[] {
  return (comments ?? [])
    .map((comment) => ({
      image_url: String(comment.image_url ?? "").trim(),
      time: String(comment.time ?? "").trim(),
      name: String(comment.name ?? "").trim(),
      text: String(comment.text ?? "").trim(),
    }))
    .filter((comment) => comment.name || comment.text || comment.time || comment.image_url)
    .map((comment) => {
      if (!comment.name || !comment.text) {
        throw new Error("Preencha o nome e o texto de cada comentário adicionado.");
      }
      return comment;
    });
}

function validateFaqs(faqs: PageFaq[] | undefined): PageFaq[] {
  return (faqs ?? [])
    .map((faq) => ({
      question: String(faq.question ?? "").trim(),
      answer: String(faq.answer ?? "").trim(),
    }))
    .filter((faq) => faq.question || faq.answer)
    .map((faq) => {
      if (!faq.question || !faq.answer) {
        throw new Error("Preencha a pergunta e a resposta de cada FAQ adicionada.");
      }
      return faq;
    });
}

function validate(input: PageInput): PageInput {
  const slug = String(input.slug ?? "")
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("O slug deve conter apenas letras minúsculas, números e hífens.");
  }
  if (!String(input.title ?? "").trim()) {
    throw new Error("O título é obrigatório.");
  }
  return {
    ...(input.id ? { id: input.id } : {}),
    slug,
    title: input.title.trim(),
    subtitle: (input.subtitle ?? "").trim(),
    description: (input.description ?? "").trim(),
    image_url: (input.image_url ?? "").trim(),
    video_format: normalizeVideoFormat(input.video_format),
    button_text: (input.button_text ?? "").trim() || "Saiba mais",
    button_link: (input.button_link ?? "").trim() || "#",
    comments: validateComments(input.comments),
    faqs: validateFaqs(input.faqs),
    base_raised: Math.max(0, Number(input.base_raised) || 0),
    base_donations: Math.max(0, Math.floor(Number(input.base_donations) || 0)),
    goal: Math.max(1, Number(input.goal) || 45000),
    pix_key: (input.pix_key ?? "").trim() || "vaquinhasolidaria@gmail.com",
  };
}

function isDuplicateSlug(error: { code?: string; message?: string } | null) {
  return error?.code === "23505" || /duplicate key/i.test(error?.message ?? "");
}

/**
 * Public, SSR-safe: fetches the page content AND increments the visit counter
 * in the same server request that renders /p/:slug.
 */
export const getPublicPageAndTrackVisit = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }): Promise<PageContent | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: page, error } = await supabaseAdmin
      .from("pages")
      .select(
        "slug, title, subtitle, description, image_url, video_format, button_text, button_link, comments, faqs, base_raised, base_donations, goal, paid_raised, paid_donations, pix_key",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) {
      console.error("[Supabase] Failed to load public page by slug.", {
        code: error.code,
        message: error.message,
      });
      throw new Error("Não foi possível consultar a página pública no Supabase.");
    }

    if (!page) return null;

    await supabaseAdmin.rpc("increment_page_visit", { _slug: data.slug });

    return {
      slug: page.slug,
      title: page.title,
      subtitle: page.subtitle,
      description: page.description,
      image_url: page.image_url,
      video_format: normalizeVideoFormat(page.video_format),
      button_text: page.button_text,
      button_link: page.button_link,
      comments: (page.comments ?? []) as PageComment[],
      faqs: (page.faqs ?? []) as PageFaq[],
      goal: Number(page.goal) || 45000,
      pix_key: page.pix_key || "vaquinhasolidaria@gmail.com",
      raised: Number(page.base_raised) + Number(page.paid_raised),
      donations: Number(page.base_donations) + Number(page.paid_donations),
    };
  });

/** Public: CTA click tracking, called from the browser on click. */
export const trackPageClick = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.rpc("increment_page_click", { _slug: data.slug });
    return { ok: true };
  });

export const listMyPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PageRecord[]> => {
    const { data, error } = await context.supabase
      .from("pages")
      .select(
        "id, slug, title, subtitle, description, image_url, video_format, button_text, button_link, visits, clicks, comments, faqs, base_raised, base_donations, goal, paid_raised, paid_donations, pix_key, created_at",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((page) => ({
      ...page,
      base_raised: Number(page.base_raised),
      base_donations: Number(page.base_donations),
      goal: Number(page.goal),
      paid_raised: Number(page.paid_raised),
      paid_donations: Number(page.paid_donations),
      comments: (page.comments ?? []) as PageComment[],
      faqs: (page.faqs ?? []) as PageFaq[],
    })) as PageRecord[];
  });

export const createPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PageInput) => validate(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("pages").insert({
      user_id: context.userId,
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      image_url: data.image_url || null,
      video_format: normalizeVideoFormat(data.video_format),
      button_text: data.button_text,
      button_link: data.button_link,
      comments: data.comments ?? [],
      faqs: data.faqs ?? [],
      base_raised: data.base_raised,
      base_donations: data.base_donations,
      goal: data.goal,
      pix_key: data.pix_key,
    } as never);

    if (error) {
      if (isDuplicateSlug(error)) throw new Error("Este slug já está em uso. Escolha outro.");
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const updatePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PageInput) => {
    if (!data.id) throw new Error("Página inválida.");
    return validate(data);
  })
  .handler(async ({ data, context }) => {
    if (!data.id) throw new Error("Página inválida.");
    const pageId = data.id;
    const { error } = await context.supabase
      .from("pages")
      .update({
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        image_url: data.image_url || null,
        video_format: normalizeVideoFormat(data.video_format),
        button_text: data.button_text,
        button_link: data.button_link,
        comments: data.comments ?? [],
        faqs: data.faqs ?? [],
        base_raised: data.base_raised,
        base_donations: data.base_donations,
        goal: data.goal,
        pix_key: data.pix_key,
      } as never)
      .eq("id", pageId)
      .eq("user_id", context.userId);

    if (error) {
      if (isDuplicateSlug(error)) throw new Error("Este slug já está em uso. Escolha outro.");
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const deletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("pages")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
