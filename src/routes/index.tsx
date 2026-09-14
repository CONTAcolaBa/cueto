import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PageMult — Gerador de microsites com métricas" },
      {
        name: "description",
        content:
          "Crie microsites de uma página em segundos, compartilhe o link e acompanhe visitas e cliques em um painel único.",
      },
      { property: "og:title", content: "PageMult — Gerador de microsites com métricas" },
      {
        property: "og:description",
        content:
          "Crie microsites de uma página em segundos, compartilhe o link e acompanhe visitas e cliques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">PageMult</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Microsites em segundos, métricas em tempo real
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Crie páginas de uma seção a partir de um modelo pronto, compartilhe o link público e
          acompanhe visitas e cliques de cada página.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Abrir painel
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
