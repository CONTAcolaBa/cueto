import { useEffect, useState } from "react";
import type { PageComment, PageContent } from "@/lib/pages.functions";
import { Heart, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Fixed public microsite template.
 * Self-contained on purpose: the visual design can be fully redesigned here
 * without touching any other logic in the app.
 */
export function PageTemplate({ page }: { page: PageContent }) {
  return (
    <main className="min-h-screen bg-public-background text-public-foreground">
      <header className="border-b border-public-border bg-public-background shadow-sm">
        <div className="mx-auto grid h-24 w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:h-28 sm:px-8">
          <div
            className="h-12 w-32 rounded-lg bg-public-placeholder sm:h-14 sm:w-40"
            aria-label="Espaço reservado para a futura logo"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-public-foreground hover:bg-public-muted"
            aria-label="Menu"
            aria-disabled="true"
            tabIndex={-1}
          >
            <Menu className="size-7" />
          </Button>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-7 sm:px-8 sm:pt-10">
        {page.image_url ? (
          <img
            src={page.image_url}
            alt={page.title}
            className="aspect-[6/5] w-full rounded-lg bg-public-placeholder object-cover"
          />
        ) : (
          <div
            className="aspect-[6/5] w-full rounded-lg bg-public-placeholder"
            role="img"
            aria-label="Imagem ainda não adicionada"
          />
        )}

        <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl">{page.title}</h1>

        <section className="mt-14" aria-label="Arrecadação">
          <p className="text-base text-public-muted-foreground">Arrecadados</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">R$ 713,00 de R$ 45.000,00</p>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-public-muted"
            role="progressbar"
            aria-label="Progresso da arrecadação"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={1.58}
          >
            <div className="h-full w-[1.58%] min-w-2 rounded-full bg-donation" />
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 text-base text-public-muted-foreground">
            <span>19 doações</span>
            <span className="rounded-full bg-donation-soft px-3 py-1 font-semibold text-donation">1,58%</span>
          </div>
        </section>

        <div className="mt-10 grid gap-4">
          <Button
            type="button"
            className="h-14 w-full bg-donation text-lg font-bold text-donation-foreground hover:bg-donation"
            aria-disabled="true"
            tabIndex={-1}
          >
            Fazer uma Doação
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-14 w-full border-2 border-donation bg-public-background text-lg font-bold text-donation hover:bg-public-background"
            aria-disabled="true"
            tabIndex={-1}
          >
            Compartilhar
          </Button>
        </div>

        {page.subtitle ? (
          <h2 className="mt-12 flex items-start gap-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            <Heart className="mt-0.5 size-8 shrink-0 fill-donation text-donation" aria-hidden="true" />
            <span>{page.subtitle}</span>
          </h2>
        ) : null}

        {page.description ? (
          <p className="mt-12 whitespace-pre-line text-lg font-medium leading-relaxed text-public-muted-foreground">
            {page.description}
          </p>
        ) : null}

        {page.comments.length > 0 ? <CommentCarousel comments={page.comments} /> : null}
      </article>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CommentCarousel({ comments }: { comments: PageComment[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (comments.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % comments.length),
      3000,
    );
    return () => window.clearInterval(interval);
  }, [comments.length]);

  return (
    <section className="mt-12" aria-label="Comentários de doadores" aria-live="polite">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {comments.map((comment, index) => (
            <article
              key={`${comment.name}-${index}`}
              className="min-h-48 min-w-full rounded-lg border border-donation bg-public-background px-5 py-5 shadow-sm sm:px-7"
              aria-hidden={index !== activeIndex}
            >
              <div className="flex items-start gap-4">
                {comment.image_url ? (
                  <img
                    src={comment.image_url}
                    alt={`Foto de ${comment.name}`}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-public-muted text-base font-semibold text-public-foreground">
                    {getInitials(comment.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-public-foreground">{comment.name}</h2>
                    <span className="rounded-full bg-donation px-3 py-1 text-xs font-semibold text-donation-foreground">
                      ✓ Doador(a)
                    </span>
                  </div>
                  {comment.time ? <p className="mt-1 text-sm text-public-muted-foreground">{comment.time}</p> : null}
                  <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-public-foreground">
                    {comment.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {comments.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2" aria-label={`Comentário ${activeIndex + 1} de ${comments.length}`}>
          {comments.map((item, index) => (
            <Button
              key={`${item.name}-${index}`}
              type="button"
              variant="ghost"
              size="icon"
              className={`size-5 rounded-full p-0 hover:bg-public-muted ${index === activeIndex ? "bg-donation" : "bg-public-placeholder"}`}
              aria-label={`Mostrar comentário ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
