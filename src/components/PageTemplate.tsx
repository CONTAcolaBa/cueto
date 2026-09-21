import { useEffect, useState } from "react";
import type { PageComment, PageContent, PageFaq } from "@/lib/pages.functions";
import { ChevronDown, Heart, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import unionBackground from "@/assets/union-background.webp.asset.json";

/**
 * Fixed public microsite template.
 * Self-contained on purpose: the visual design can be fully redesigned here
 * without touching any other logic in the app.
 */
export function PageTemplate({ page }: { page: PageContent }) {
  return (
    <main className="min-h-screen bg-public-background text-public-foreground">
      <header className="border-b border-public-border bg-public-background shadow-sm">
        <div className="mx-auto grid h-24 w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-28 sm:px-6">
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

      <article className="mx-auto w-full max-w-4xl px-4 pb-20 pt-7 sm:px-6 sm:pt-10">
        {page.image_url ? (
          <img
            src={page.image_url}
            alt={page.title}
            className="aspect-[6/5] w-full rounded-[16px] bg-public-placeholder object-cover"
          />
        ) : (
          <div
            className="aspect-[6/5] w-full rounded-[16px] bg-public-placeholder"
            role="img"
            aria-label="Imagem ainda não adicionada"
          />
        )}

        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{page.title}</h1>

        <section className="mt-6" aria-label="Arrecadação">
          <p className="text-base text-public-muted-foreground">Arrecadados</p>
          <p className="mt-1 text-2xl font-extrabold sm:text-3xl">R$ 713,00 de R$ 45.000,00</p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-public-muted"
            role="progressbar"
            aria-label="Progresso da arrecadação"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={1.58}
          >
            <div className="h-full w-[1.58%] min-w-2 rounded-full bg-donation" />
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-base text-public-muted-foreground">
            <span>19 doações</span>
            <span className="rounded-full bg-donation-soft px-2 py-0.5 text-xs font-semibold text-donation">1,58%</span>
          </div>
        </section>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            className="h-14 w-full rounded-[5px] bg-donation text-lg font-bold text-donation-foreground hover:bg-donation"
            aria-disabled="true"
            tabIndex={-1}
          >
            Fazer uma Doação
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-14 w-full rounded-[5px] border-2 border-donation bg-public-background text-lg font-bold text-donation hover:bg-public-background"
            aria-disabled="true"
            tabIndex={-1}
          >
            Compartilhar
          </Button>
        </div>

        {page.subtitle ? (
          <h2 className="mt-8 flex items-start gap-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            <Heart className="mt-0.5 size-7 shrink-0 fill-donation text-donation" aria-hidden="true" />
            <span>{page.subtitle}</span>
          </h2>
        ) : null}

        {page.description ? (
          <p className="mt-6 whitespace-pre-line text-lg font-medium leading-relaxed text-public-muted-foreground">
            {page.description}
          </p>
        ) : null}

        <TransparencySection />

        {page.faqs.length > 0 ? <FaqSection faqs={page.faqs} /> : null}

        {page.comments.length > 0 ? <CommentCarousel comments={page.comments} /> : null}
      </article>

      <section
        className="relative isolate overflow-hidden"
        aria-label="Mensagem de união"
      >
        <img
          src={unionBackground.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-donation/85 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-donation/40 via-transparent to-donation/60"
          aria-hidden="true"
        />
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-4 py-20 sm:px-6 sm:py-28">
          <p className="max-w-xl text-center text-2xl font-bold leading-snug text-donation-foreground drop-shadow-sm sm:text-3xl">
            Não interessa o tamanho do desafio, o que importa é a grandeza da união.
          </p>
        </div>
      </section>

      <footer className="bg-public-footer text-public-footer-foreground">
        <div className="mx-auto grid w-full max-w-4xl gap-7 px-4 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-start sm:px-6 sm:py-9">
          <div>
            <div
              className="flex h-14 w-36 items-center justify-center rounded-lg border border-public-footer-foreground/40 bg-public-footer-foreground/15"
              aria-label="Espaço reservado para a futura logo"
            >
              <span className="text-xs font-semibold uppercase text-public-footer-foreground">Logo</span>
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium leading-snug text-public-footer-foreground">
              Juntos, transformamos solidariedade em esperança.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-6" aria-label="Links do rodapé">
            <div>
              <h2 className="text-sm font-extrabold uppercase text-public-footer-foreground">Quem somos</h2>
              <div className="mt-3 grid gap-1.5 text-sm">
                <FooterLink label="Início" />
                <FooterLink label="Vaquinhas" />
                <FooterLink label="Eventos" />
                <FooterLink label="Privacidade" />
                <FooterLink label="Políticas" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase text-public-footer-foreground">Contatos</h2>
              <div className="mt-3 grid gap-1.5 text-sm">
                <FooterLink label="Telefone" />
                <FooterLink label="Whatsapp" />
                <FooterLink label="Email" />
                <FooterLink label="SAC" />
              </div>
            </div>
          </nav>
        </div>

        <div className="bg-public-footer-bottom">
          <p className="mx-auto w-full max-w-4xl whitespace-pre-line px-4 py-4 text-center text-xs leading-relaxed text-public-footer-foreground sm:px-6">
            {"Instrução não governamental reservada/ BR\n© Copyright. Todos os direitos reservados."}
          </p>
        </div>
      </footer>
    </main>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <span
      className="w-fit text-public-footer-foreground/90"
      aria-disabled="true"
    >
      {label}
    </span>
  );
}

function TransparencySection() {
  return (
    <section className="mt-10 bg-transparency-background px-4 py-6 sm:px-6" aria-labelledby="transparency-title">
      <h2 id="transparency-title" className="text-2xl font-extrabold text-public-foreground">
        Transparência
      </h2>
      <div className="mt-4 rounded-lg bg-public-background px-5 py-5 text-base leading-relaxed text-public-foreground shadow-sm sm:px-6">
        <p>Esta campanha é uma ação solidária promocional vinculada a uma campanha humanitária.</p>
        <p className="mt-4">Os recursos arrecadados aqui são destinados exclusivamente aos beneficiados.</p>
        <p className="mt-4">
          Ao contribuir, você declara estar ciente de que esta é uma doação voluntária para fins humanitários.
        </p>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: PageFaq[] }) {
  return (
    <section className="mt-12" aria-label="Perguntas Frequentes">
      <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">Perguntas Frequentes</h2>
      <dl className="mt-6 grid gap-4">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group rounded-lg border border-public-border bg-public-background shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left [&::-webkit-details-marker]:hidden sm:px-7">
              <span className="text-lg font-bold leading-snug text-public-foreground">{faq.question}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-public-muted text-public-foreground">
                <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
              </span>
            </summary>
            <div className="border-t border-public-border px-5 py-4 sm:px-7">
              <p className="whitespace-pre-line text-base leading-relaxed text-public-muted-foreground">
              {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </dl>
    </section>
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
              className="min-h-36 min-w-full rounded-lg border border-donation bg-public-background px-4 py-4 shadow-sm sm:px-5"
              aria-hidden={index !== activeIndex}
            >
              <div className="flex items-start gap-3">
                {comment.image_url ? (
                  <img
                    src={comment.image_url}
                    alt={`Foto de ${comment.name}`}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-public-muted text-sm font-semibold text-public-foreground">
                    {getInitials(comment.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-public-foreground">{comment.name}</h2>
                    <span className="rounded-full bg-donation px-2 py-0.5 text-xs font-semibold text-donation-foreground">
                      ✓ Doador(a)
                    </span>
                  </div>
                  {comment.time ? <p className="mt-0.5 text-xs text-public-muted-foreground">{comment.time}</p> : null}
                  <p className="mt-2 whitespace-pre-line text-sm leading-snug text-public-foreground">
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
