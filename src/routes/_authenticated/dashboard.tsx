import { getVideoEmbedSrc, isVideoEmbed } from "@/lib/media";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BarChart3, Check, Copy, HelpCircle, LogOut, MessageCircle, MousePointerClick, Pencil, Plus, Trash2, Eye } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  createPage,
  deletePage,
  listMyPages,
  updatePage,
  type PageComment,
  type PageFaq,
  type PageRecord,
} from "@/lib/pages.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — PageMult" },
      { name: "description", content: "Crie microsites e acompanhe visitas e cliques de cada página." },
      { property: "og:title", content: "Painel — PageMult" },
      { property: "og:description", content: "Crie microsites e acompanhe visitas e cliques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function MediaField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [mode, setMode] = useState<"image" | "video">(isVideoEmbed(value) ? "video" : "image");
  const invalidVideo = mode === "video" && value.trim() !== "" && !getVideoEmbedSrc(value);
  function switchMode(next: "image" | "video") {
    if (next === mode) return;
    setMode(next);
    onChange("");
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {(["image", "video"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={mode === option ? "default" : "outline"}
            onClick={() => switchMode(option)}
          >
            {option === "image" ? "Imagem" : "Vídeo"}
          </Button>
        ))}
      </div>
      {mode === "image" ? (
        <Field label="URL da imagem" id="image_url">
          <Input
            id="image_url"
            type="url"
            placeholder="https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      ) : (
        <Field label="Código de incorporação do vídeo" id="video_embed">
          <Textarea
            id="video_embed"
            rows={3}
            placeholder='<iframe src="https://www.youtube.com/embed/..."></iframe>'
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {invalidVideo ? (
            <p className="text-xs text-destructive">Cole um código com &lt;iframe src="https://..."&gt;.</p>
          ) : null}
        </Field>
      )}
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  share_link: string;
  slug: string;
  comments: PageComment[];
  faqs: PageFaq[];
  base_raised: number;
  base_donations: number;
  goal: number;
  pix_key: string;
};

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  share_link: "",
  slug: "",
  comments: [],
  faqs: [],
  base_raised: 0,
  base_donations: 0,
  goal: 45000,
  pix_key: "vaquinhasolidaria@gmail.com",
};

const emptyComment: PageComment = { image_url: "", time: "", name: "", text: "" };
const emptyFaq: PageFaq = { question: "", answer: "" };

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PageRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPages = useServerFn(listMyPages);
  const create = useServerFn(createPage);
  const update = useServerFn(updatePage);
  const remove = useServerFn(deletePage);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["pages"],
    // Sem login ativo, a listagem pode falhar: mostramos o painel vazio.
    queryFn: async () => {
      try {
        return await fetchPages();
      } catch {
        return [] as PageRecord[];
      }
    },
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        slug: values.slug || slugify(values.title),
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        image_url: values.image_url,
        button_text: "Fazer uma Doação",
        button_link: values.share_link.trim() || "#",
        comments: values.comments,
        faqs: values.faqs,
        base_raised: values.base_raised,
        base_donations: values.base_donations,
        goal: values.goal,
        pix_key: values.pix_key,
      };
      return values.id
        ? update({ data: { ...payload, id: values.id } })
        : create({ data: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setFormOpen(false);
      toast.success("Página salva com sucesso.");
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "Não foi possível salvar a página.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setPendingDelete(null);
      toast.success("Página excluída.");
    },
    onError: () => toast.error("Não foi possível excluir a página."),
  });

  const totals = useMemo(
    () => ({
      pages: pages.length,
      visits: pages.reduce((sum, p) => sum + p.visits, 0),
      clicks: pages.reduce((sum, p) => sum + p.clicks, 0),
    }),
    [pages],
  );

  const maxVisits = Math.max(1, ...pages.map((p) => p.visits));
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function openCreate() {
    setForm(emptyForm);
    setSlugTouched(false);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(page: PageRecord) {
    setForm({
      id: page.id,
      title: page.title,
      subtitle: page.subtitle ?? "",
      description: page.description ?? "",
      image_url: page.image_url ?? "",
      share_link: page.button_link && page.button_link !== "#" ? page.button_link : "",
      slug: page.slug,
      comments: page.comments,
      faqs: page.faqs ?? [],
      base_raised: page.base_raised,
      base_donations: page.base_donations,
      goal: page.goal,
      pix_key: page.pix_key,
    });
    setSlugTouched(true);
    setFormError(null);
    setFormOpen(true);
  }

  async function copyLink(page: PageRecord) {
    try {
      await navigator.clipboard.writeText(`${origin}/p/${page.slug}`);
      setCopiedId(page.id);
      setTimeout(() => setCopiedId((id) => (id === page.id ? null : id)), 2000);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              P
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">PageMult</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {(email[0] ?? "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Suas páginas</h1>
            <p className="text-sm text-muted-foreground">
              Crie microsites e acompanhe o desempenho de cada link.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Nova página
          </Button>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total de páginas" value={totals.pages} icon={<BarChart3 className="size-4" />} />
          <StatCard label="Total de visitas" value={totals.visits} icon={<Eye className="size-4" />} />
          <StatCard label="Total de cliques" value={totals.clicks} icon={<MousePointerClick className="size-4" />} />
        </section>

        {pages.length > 0 ? (
          <section className="mt-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-card-foreground">Visitas por página</h2>
            <ul className="mt-4 space-y-3">
              {pages.map((page) => (
                <li key={page.id} className="grid grid-cols-[minmax(0,8rem)_1fr_auto] items-center gap-3">
                  <span className="truncate text-sm text-muted-foreground">{page.title}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((page.visits / maxVisits) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{page.visits}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Carregando...</p>
        ) : pages.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">Nenhuma página ainda</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Crie sua primeira página para gerar um link público e começar a medir visitas e cliques.
            </p>
            <Button className="mt-6" onClick={openCreate}>
              <Plus className="size-4" />
              Criar primeira página
            </Button>
          </div>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <article
                key={page.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  {page.image_url && !isVideoEmbed(page.image_url) ? (
                    <img
                      src={page.image_url}
                      alt={page.title}
                      className="size-14 shrink-0 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      {page.title[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-card-foreground">{page.title}</h3>
                    <p className="truncate text-xs text-muted-foreground">{page.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">👁 Visitas</p>
                    <p className="text-2xl font-bold tabular-nums text-foreground">{page.visits}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">🖱 Cliques</p>
                    <p className="text-2xl font-bold tabular-nums text-foreground">{page.clicks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {origin.replace(/^https?:\/\//, "")}/p/{page.slug}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => copyLink(page)}>
                    {copiedId === page.id ? (
                      <>
                        <Check className="size-4" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> Copiar
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(page)}>
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(page)}
                  >
                    <Trash2 className="size-4" />
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar página" : "Nova página"}</DialogTitle>
            <DialogDescription>
              O layout é fixo — você define apenas o conteúdo exibido na página pública.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setFormError(null);
              saveMutation.mutate(form);
            }}
          >
            <Field label="Título" id="title">
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: slugTouched ? f.slug : slugify(title),
                  }));
                }}
              />
            </Field>

            <Field label="Slug (endereço público)" id="slug">
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                }}
              />
              <p className="text-xs text-muted-foreground">
                {origin.replace(/^https?:\/\//, "")}/p/{form.slug || "seu-slug"}
              </p>
            </Field>

            <Field label="Subtítulo" id="subtitle">
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </Field>

            <Field label="Descrição" id="description">
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>

            <MediaField
              key={form.id ?? "new"}
              value={form.image_url}
              onChange={(value) => setForm((f) => ({ ...f, image_url: value }))}
            />

            <Field label="Link do botão Compartilhar" id="share_link">
              <Input
                id="share_link"
                type="url"
                placeholder="https://..."
                value={form.share_link}
                onChange={(e) => setForm((f) => ({ ...f, share_link: e.target.value }))}
              />
            </Field>

            <Field label="Chave Pix" id="pix_key">
              <Input
                id="pix_key"
                type="text"
                placeholder="E-mail, CPF, telefone ou chave aleatória"
                value={form.pix_key}
                onChange={(e) => setForm((f) => ({ ...f, pix_key: e.target.value }))}
              />
            </Field>

            <section className="space-y-3 border-t border-border pt-5" aria-labelledby="counters-title">
              <h3 id="counters-title" className="text-sm font-semibold text-foreground">Contadores de arrecadação</h3>
              <p className="text-xs text-muted-foreground">
                Pagamentos Pix confirmados são somados automaticamente a estes valores
                {form.id ? (() => { const p = pages.find((x) => x.id === form.id); return p ? ` (até agora: R$ ${p.paid_raised.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em ${p.paid_donations} doações Pix)` : ""; })() : ""}.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Valor arrecadado (R$)" id="base_raised">
                  <Input id="base_raised" type="number" min="0" step="0.01" value={form.base_raised}
                    onChange={(e) => setForm((f) => ({ ...f, base_raised: Number(e.target.value) || 0 }))} />
                </Field>
                <Field label="Nº de doações" id="base_donations">
                  <Input id="base_donations" type="number" min="0" step="1" value={form.base_donations}
                    onChange={(e) => setForm((f) => ({ ...f, base_donations: Number(e.target.value) || 0 }))} />
                </Field>
                <Field label="Meta (R$)" id="goal">
                  <Input id="goal" type="number" min="1" step="0.01" value={form.goal}
                    onChange={(e) => setForm((f) => ({ ...f, goal: Number(e.target.value) || 0 }))} />
                </Field>
              </div>
            </section>

            <section className="space-y-4 border-t border-border pt-5" aria-labelledby="faqs-title">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 id="faqs-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <HelpCircle className="size-4" /> Perguntas Frequentes
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Opcional — adicione quantas perguntas desejar.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((current) => ({
                    ...current,
                    faqs: [...current.faqs, { ...emptyFaq }],
                  }))}
                >
                  <Plus className="size-4" /> Adicionar
                </Button>
              </div>

              {form.faqs.map((faq, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Pergunta {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover pergunta ${index + 1}`}
                      onClick={() => setForm((current) => ({
                        ...current,
                        faqs: current.faqs.filter((_, itemIndex) => itemIndex !== index),
                      }))}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                  <Field label="Pergunta" id={`faq-question-${index}`}>
                    <Input
                      id={`faq-question-${index}`}
                      required
                      value={faq.question}
                      onChange={(event) => updateFaq(index, "question", event.target.value)}
                    />
                  </Field>
                  <Field label="Resposta" id={`faq-answer-${index}`}>
                    <Textarea
                      id={`faq-answer-${index}`}
                      required
                      rows={3}
                      value={faq.answer}
                      onChange={(event) => updateFaq(index, "answer", event.target.value)}
                    />
                  </Field>
                </div>
              ))}
            </section>

            <section className="space-y-4 border-t border-border pt-5" aria-labelledby="comments-title">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 id="comments-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageCircle className="size-4" /> Comentários
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Opcional — adicione quantos comentários desejar.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((current) => ({
                    ...current,
                    comments: [...current.comments, { ...emptyComment }],
                  }))}
                >
                  <Plus className="size-4" /> Adicionar
                </Button>
              </div>

              {form.comments.map((comment, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Comentário {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover comentário ${index + 1}`}
                      onClick={() => setForm((current) => ({
                        ...current,
                        comments: current.comments.filter((_, itemIndex) => itemIndex !== index),
                      }))}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                  <Field label="Imagem do comentário (URL)" id={`comment-image-${index}`}>
                    <Input
                      id={`comment-image-${index}`}
                      type="url"
                      placeholder="https://... (opcional)"
                      value={comment.image_url}
                      onChange={(event) => updateComment(index, "image_url", event.target.value)}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Horário" id={`comment-time-${index}`}>
                      <Input
                        id={`comment-time-${index}`}
                        placeholder="há 13 minutos"
                        value={comment.time}
                        onChange={(event) => updateComment(index, "time", event.target.value)}
                      />
                    </Field>
                    <Field label="Nome" id={`comment-name-${index}`}>
                      <Input
                        id={`comment-name-${index}`}
                        required
                        value={comment.name}
                        onChange={(event) => updateComment(index, "name", event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Texto" id={`comment-text-${index}`}>
                    <Textarea
                      id={`comment-text-${index}`}
                      required
                      rows={3}
                      value={comment.text}
                      onChange={(event) => updateComment(index, "text", event.target.value)}
                    />
                  </Field>
                </div>
              ))}
            </section>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salvar página"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir "{pendingDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              O link público deixará de funcionar e as métricas serão perdidas. Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function updateFaq(index: number, field: keyof PageFaq, value: string) {
    setForm((current) => ({
      ...current,
      faqs: current.faqs.map((faq, itemIndex) =>
        itemIndex === index ? { ...faq, [field]: value } : faq,
      ),
    }));
  }

  function updateComment(index: number, field: keyof PageComment, value: string) {
    setForm((current) => ({
      ...current,
      comments: current.comments.map((comment, itemIndex) =>
        itemIndex === index ? { ...comment, [field]: value } : comment,
      ),
    }));
  }
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-card-foreground">{value}</p>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
