import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { getPublicPageAndTrackVisit } from "@/lib/pages.functions";

export const Route = createFileRoute("/p/$slug")({
  // Server-rendered: content is fetched and the visit is counted during the
  // same server request that renders the HTML.
  loader: async ({ params }) => {
    const page = await getPublicPageAndTrackVisit({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Página não encontrada" }, { name: "robots", content: "noindex" }],
      };
    }
    const { page } = loaderData;
    const description = page.subtitle || page.description || page.title;
    const meta: Array<Record<string, string>> = [
      { title: page.title },
      { name: "description", content: description.slice(0, 155) },
      { property: "og:title", content: page.title },
      { property: "og:description", content: description.slice(0, 155) },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (page.image_url?.startsWith("https://")) {
      meta.push({ property: "og:image", content: page.image_url });
      meta.push({ name: "twitter:image", content: page.image_url });
    }
    return { meta };
  },
  component: PublicPage,
  notFoundComponent: () => (
    <main className="public-theme flex min-h-screen items-center justify-center bg-public-background px-4 text-center text-public-foreground">
      <div>
        <h1 className="text-2xl font-semibold text-public-foreground">Página não encontrada</h1>
        <p className="mt-2 text-sm text-public-muted-foreground">Este link não existe ou foi removido.</p>
      </div>
    </main>
  ),
  errorComponent: () => (
    <main className="public-theme flex min-h-screen items-center justify-center bg-public-background px-4 text-center text-public-foreground">
      <p className="text-sm text-public-muted-foreground">Não foi possível carregar esta página.</p>
    </main>
  ),
});

function PublicPage() {
  const { page } = Route.useLoaderData();

  return <PageTemplate page={page} />;
}
