import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PageComment, PageContent, PageFaq } from "@/lib/pages.functions";
import { Building2, Facebook, Heart, Instagram, Mail, MapPin, Menu, Pin } from "lucide-react";

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
            className="aspect-[6/5] w-full rounded-[16px] bg-public-placeholder object-cover"
          />
        ) : (
          <div
            className="aspect-[6/5] w-full rounded-[16px] bg-public-placeholder"
            role="img"
            aria-label="Imagem ainda não adicionada"
          />
        )}

        <h1 className="mt-4 text-[48px] font-extrabold leading-tight">{page.title}</h1>

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
          <h2 className="mt-8 flex items-start gap-3 text-[25px] font-extrabold leading-tight">
            <Heart className="mt-0.5 size-7 shrink-0 fill-donation text-donation" aria-hidden="true" />
            <span>{page.subtitle}</span>
          </h2>
        ) : null}

        {page.description ? (
          <p className="mt-6 whitespace-pre-line text-[18px] font-medium leading-relaxed text-public-muted-foreground">
            {page.description}
          </p>
        ) : null}

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
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-5 py-20 sm:px-8 sm:py-28">
          <p className="max-w-xl text-center text-2xl font-bold leading-snug text-donation-foreground drop-shadow-sm sm:text-3xl">
            Não interessa o tamanho do desafio, o que importa é a grandeza da união.
          </p>
        </div>
      </section>

      <footer className="border-t border-public-border bg-public-muted">
        <div className="mx-auto grid w-full max-w-3xl gap-10 px-5 py-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:px-8">
          <div>
            <div
              className="flex h-16 w-40 items-center justify-center rounded-lg border border-public-border bg-public-placeholder"
              aria-label="Espaço reservado para a futura logo"
            >
              <span className="text-xs font-semibold uppercase text-public-muted-foreground">Logo</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-public-muted-foreground">
              Juntos, transformamos solidariedade em esperança.
            </p>
          </div>

          <div>
            <h2 className="text-base font-extrabold text-public-foreground">Informações institucionais</h2>
            <address className="mt-5 grid gap-4 not-italic text-sm leading-relaxed text-public-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-donation" aria-hidden="true" />
                <span>Rua Elvira Ferraz, nº 440, Itaim Bibi, São Paulo, SP</span>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 size-5 shrink-0 text-donation" aria-hidden="true" />
                <span>CNPJ: 47.967.950/0001-22</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-donation" aria-hidden="true" />
                <span>acao@solidaria.com</span>
              </div>
            </address>

            <div className="mt-7 flex items-center gap-2" aria-label="Redes sociais">
              <SocialIcon label="Instagram">
                <Instagram className="size-5" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <Facebook className="size-5" />
              </SocialIcon>
              <SocialIcon label="Pinterest">
                <Pin className="size-5" />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="border-t border-public-border">
          <p className="mx-auto w-full max-w-3xl px-5 py-5 text-center text-xs text-public-muted-foreground sm:px-8">
            © 2026 Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10 rounded-full border-public-border bg-public-background text-public-foreground hover:bg-public-background"
      aria-label={label}
      aria-disabled="true"
      tabIndex={-1}
    >
      {children}
    </Button>
  );
}

function FaqSection({ faqs }: { faqs: PageFaq[] }) {
  return (
    <section className="mt-12" aria-label="Perguntas Frequentes">
      <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">Perguntas Frequentes</h2>
      <dl className="mt-6 grid gap-4">
        {faqs.map((faq, index) => (
          <div
            key={`${faq.question}-${index}`}
            className="rounded-lg border border-public-border bg-public-background px-5 py-5 shadow-sm sm:px-7"
          >
            <dt className="text-lg font-bold leading-snug text-public-foreground">{faq.question}</dt>
            <dd className="mt-2 whitespace-pre-line text-base leading-relaxed text-public-muted-foreground">
              {faq.answer}
            </dd>
          </div>
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
