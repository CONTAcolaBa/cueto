import { useEffect, useRef, useState } from "react";
import type { PageComment, PageContent, PageFaq } from "@/lib/pages.functions";
import { Check, ChevronDown, Heart, Menu, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import unionBackground from "@/assets/union-background.webp.asset.json";

/**
 * Fixed public microsite template.
 * Self-contained on purpose: the visual design can be fully redesigned here
 * without touching any other logic in the app.
 */
export function PageTemplate({ page }: { page: PageContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeMenu(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setMenuOpen(false);
        return;
      }
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [menuOpen]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-public-background text-public-foreground">
      <header className="border-b border-public-border bg-public-background shadow-sm">
        <div className="relative mx-auto grid h-24 w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-28 sm:px-6">
          <div
            className="h-12 w-32 rounded-lg bg-public-placeholder sm:h-14 sm:w-40"
            aria-label="Espaço reservado para a futura logo"
          />
          <div ref={menuRef} className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-public-foreground hover:bg-public-muted"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="public-quick-menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
            </Button>

            {menuOpen ? (
              <nav
                id="public-quick-menu"
                className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-lg border border-public-border bg-public-background py-2 shadow-xl"
                aria-label="Links rápidos"
              >
                {[
                  "INICIAL",
                  "QUEM SOMOS",
                  "NOSSO PROPÓSITO",
                  "OUTRAS VAQUINHAS",
                ].map((label) => (
                  <span
                    key={label}
                    className="block px-5 py-3 text-sm font-semibold text-public-foreground"
                    aria-disabled="true"
                  >
                    {label}
                  </span>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </header>

      <article className="mx-auto w-full max-w-4xl px-4 pb-48 pt-7 sm:px-6 sm:pt-10">
        <div className="relative">
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
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-public-background px-3 py-1.5 text-sm font-semibold text-public-foreground shadow-md">
            <Check className="size-4 text-donation" strokeWidth={3} aria-hidden="true" />
            verificada
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{page.title}</h1>

        <section className="mt-6" aria-label="Arrecadação">
          <p className="text-base text-public-muted-foreground">Arrecadados</p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">R$ 713,00 de R$ 45.000,00</p>
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

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-public-border bg-public-background/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:p-4">
          <div className="mx-auto grid w-full max-w-4xl gap-2 sm:grid-cols-2 sm:gap-3 sm:px-2">
            <Button
              type="button"
              className="h-12 w-full rounded-lg bg-donation text-base font-semibold text-donation-foreground hover:bg-donation"
              aria-disabled="true"
              tabIndex={-1}
            >
              Fazer uma Doação
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-lg border border-donation bg-public-background text-base font-semibold text-donation hover:bg-public-background"
              aria-disabled="true"
              tabIndex={-1}
            >
              Compartilhar
            </Button>
          </div>
        </div>

        {page.subtitle ? (
          <h2 className="mt-8 flex items-start gap-3 text-xl font-normal leading-tight sm:text-2xl">
            <Heart className="mt-0.5 size-7 shrink-0 fill-donation text-donation" aria-hidden="true" />
            <span>{page.subtitle}</span>
          </h2>
        ) : null}

        {page.description ? (
          <p className="mt-6 whitespace-pre-line text-lg font-medium leading-relaxed text-public-muted-foreground">
            {page.description}
          </p>
        ) : null}

        <CommentsSection comments={page.comments} />

        <TransparencySection />

        {page.faqs.length > 0 ? <FaqSection faqs={page.faqs} /> : null}
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
    <section
      className="relative left-1/2 mt-10 w-screen -translate-x-1/2 bg-transparency-background"
      aria-labelledby="transparency-title"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
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
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: PageFaq[] }) {
  return (
    <section className="mt-12" aria-label="Perguntas Frequentes">
      <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">Perguntas Frequentes</h2>
      <dl className="mt-6 grid gap-4">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group rounded-3xl border border-public-border bg-public-background shadow-sm"
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

function CommentsSection({ comments }: { comments: PageComment[] }) {
  return (
    <section className="mt-10" aria-label="Comentários">
      {comments.length > 0 ? <CommentCarousel comments={comments} /> : null}
      <form className={comments.length > 0 ? "mt-4" : ""} onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="public-comment" className="sr-only">
          Escreva um comentário
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-public-border bg-public-background p-2 shadow-sm">
          <Input
            id="public-comment"
            type="text"
            placeholder="Escreva um comentário"
            className="h-11 min-w-0 flex-1 border-0 bg-transparent text-public-foreground shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 text-donation hover:bg-donation-soft hover:text-donation"
            aria-label="Enviar comentário"
            aria-disabled="true"
          >
            <Send className="size-6" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </section>
  );
}

function CommentCarousel({ comments }: { comments: PageComment[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (comments.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % comments.length),
      5000,
    );
    return () => window.clearInterval(interval);
  }, [comments.length]);

  return (
    <div aria-label="Comentários de doadores" aria-live="polite">
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
    </div>
  );
}
