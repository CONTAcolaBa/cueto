import type { PageContent } from "@/lib/pages.functions";

/**
 * Fixed public microsite template.
 * Self-contained on purpose: the visual design can be fully redesigned here
 * without touching any other logic in the app.
 */
export function PageTemplate({
  page,
  onCtaClick,
}: {
  page: PageContent;
  onCtaClick?: () => void;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:py-16">
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {page.image_url ? (
          <img
            src={page.image_url}
            alt={page.title}
            className="w-full rounded-xl border border-border object-cover"
          />
        ) : null}

        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
          {page.subtitle ? (
            <p className="text-lg text-muted-foreground">{page.subtitle}</p>
          ) : null}
        </header>

        {page.description ? (
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {page.description}
          </p>
        ) : null}

        <a
          href={page.button_link}
          onClick={onCtaClick}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:self-start"
        >
          {page.button_text}
        </a>
      </article>
    </main>
  );
}
