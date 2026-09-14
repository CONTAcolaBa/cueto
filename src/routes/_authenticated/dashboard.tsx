import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BarChart3, Check, Copy, LogOut, MousePointerClick, Pencil, Plus, Trash2, Eye } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  createPage,
  deletePage,
  listMyPages,
  updatePage,
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
  button_text: string;
  button_link: string;
  slug: string;
};

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  button_text: "Saiba mais",
  button_link: "",
  slug: "",
};

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
    queryFn: () => fetchPages(),
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        slug: values.slug || slugify(values.title),
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        image_url: values.image_url,
        button_text: values.button_text,
        button_link: values.button_link,
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
      button_text: page.button_text,
      button_link: page.button_link,
      slug: page.slug,
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
                  {page.image_url ? (
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

            <Field label="URL da imagem" id="image_url">
              <Input
                id="image_url"
                type="url"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Texto do botão" id="button_text">
                <Input
                  id="button_text"
                  value={form.button_text}
                  onChange={(e) => setForm((f) => ({ ...f, button_text: e.target.value }))}
                />
              </Field>
              <Field label="Link do botão" id="button_link">
                <Input
                  id="button_link"
                  type="url"
                  placeholder="https://..."
                  value={form.button_link}
                  onChange={(e) => setForm((f) => ({ ...f, button_link: e.target.value }))}
                />
              </Field>
            </div>

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
