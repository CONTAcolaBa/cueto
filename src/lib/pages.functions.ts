import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string;
  button_link: string;
  visits: number;
  clicks: number;
  created_at: string;
};

export type PageContent = Pick<
  PageRecord,
  "slug" | "title" | "subtitle" | "description" | "image_url" | "button_text" | "button_link"
>;

export type PageInput = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
};

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
    button_text: (input.button_text ?? "").trim() || "Saiba mais",
    button_link: (input.button_link ?? "").trim() || "#",
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
      .select("slug, title, subtitle, description, image_url, button_text, button_link")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error || !page) return null;

    await supabaseAdmin.rpc("increment_page_visit", { _slug: data.slug });

    return page as PageContent;
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
        "id, slug, title, subtitle, description, image_url, button_text, button_link, visits, clicks, created_at",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as PageRecord[];
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
      button_text: data.button_text,
      button_link: data.button_link,
    });

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
    const { error } = await context.supabase
      .from("pages")
      .update({
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        image_url: data.image_url || null,
        button_text: data.button_text,
        button_link: data.button_link,
      })
      .eq("id", data.id!)
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
