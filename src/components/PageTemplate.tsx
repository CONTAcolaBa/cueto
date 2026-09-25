import { useEffect, useState, type FormEvent } from "react";
import type { PageComment, PageContent, PageFaq } from "@/lib/pages.functions";
import { CheckCircle2, ChevronDown, Heart, Menu, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Fixed public microsite template.
 * Self-contained on purpose: the visual design can be fully redesigned here
 * without touching any other logic in the app.
 */
export function PageTemplate({ page }: { page: PageContent }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-public-background text-public-foreground">
      <header className="border-b border-public-border bg-public-background shadow-sm">
        <div className="mx-auto grid h-24 w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-28 sm:px-6">
          <img
            src="/logo-acao-solidaria.webp"
            alt="Ação Solidária"
            className="h-12 w-32 object-contain object-left sm:h-14 sm:w-40"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-public-foreground hover:bg-public-muted"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="public-quick-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-7" />
          </Button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="public-quick-menu"
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-public-background shadow-2xl"
            role="dialog"
            aria-label="Menu de navegação"
          >
            <div className="flex h-24 items-center justify-between border-b border-public-border px-4 sm:h-28 sm:px-6">
              <span className="text-sm font-bold uppercase text-public-foreground">Menu</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-public-foreground hover:bg-public-muted"
                aria-label="Fechar menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="size-7" />
              </Button>
            </div>
            <nav className="flex flex-col py-2" aria-label="Links rápidos">
              {[
                "INICIAL",
                "QUEM SOMOS",
                "NOSSO PROPÓSITO",
                "OUTRAS VAQUINHAS",
              ].map((label) => (
                <span
                  key={label}
                  className="block px-6 py-4 text-base font-semibold text-public-foreground"
                  aria-disabled="true"
                >
                  {label}
                </span>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

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
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#00C853]/20 bg-white/95 px-3 py-2 text-sm font-medium text-public-foreground shadow-md">
            <CheckCircle2 className="size-4 text-[#00C853]" aria-hidden="true" />
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
              <span>Fazer uma Doação</span>
              <HandHoldingHeartIcon />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-lg border border-donation bg-public-background text-base font-semibold text-donation hover:bg-public-background"
              aria-disabled="true"
              tabIndex={-1}
            >
              <span>Compartilhar</span>
              <ShareIcon />
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

      <footer className="bg-public-footer text-public-footer-foreground">
        <div className="mx-auto grid w-full max-w-4xl gap-7 px-4 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-start sm:px-6 sm:py-9">
          <div>
            <div
              className="flex h-14 w-36 items-center justify-center overflow-hidden rounded-lg border border-public-footer-foreground/40 bg-public-footer-foreground/15"
              aria-label="Logo Ação Solidária"
            >
              <img
                src="/logo-acao-solidaria-footer.webp"
                alt="Ação Solidária"
                className="h-full w-full object-contain"
              />
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
      <div className="h-48 bg-public-background" aria-hidden="true" />
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
        <h2 id="transparency-title" className="flex items-center gap-2 text-2xl font-extrabold text-[#00C853]">
          <ShieldIcon />
          <span>Transparência</span>
        </h2>
        <div className="mt-4 rounded-lg bg-public-background px-5 py-5 text-base leading-relaxed text-public-foreground shadow-sm sm:px-6">
          <p>Esta campanha é uma ação solidária promocional que está diretamente vinculada a uma campanha humanitária de grande relevância social. Seu objetivo principal é mobilizar pessoas, empresas e comunidades em prol de uma causa nobre, unindo solidariedade e engajamento em prol de quem mais precisa.</p>
          <p className="mt-4">Todos os recursos arrecadados por meio desta ação são destinados exclusivamente aos beneficiados da campanha humanitária. Não há qualquer retenção, desvio ou aplicação dos valores em custos administrativos, taxas ou despesas operacionais — cada centavo contribuído é integralmente revertido para a finalidade declarada.</p>
          <p className="mt-4">
            Ao contribuir, você declara estar ciente e de acordo de que esta é uma doação voluntária, sem qualquer caráter de obrigatoriedade, reembolso ou contrapartida material, realizada exclusivamente para fins humanitários. Não haverá devolução dos valores doados, independentemente do valor contribuído.
          </p>
         <p className="mt-4">Sua participação faz a diferença! Cada contribuição, por menor que seja, representa um gesto de solidariedade que impacta diretamente a vida dos beneficiados. Juntos, podemos transformar intenções em ações concretas e gerar um impacto positivo e duradouro na comunidade.</p>
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
              <span className="text-lg font-normal leading-snug text-public-foreground">{faq.question}</span>
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

function HandHoldingHeartIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-5 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M29.287 19.252c-.486-.206-1.052-.326-1.646-.326-.65 0-1.267.144-1.82.402l.027-.011-5.121 2.301c-.32-1.36-1.523-2.356-2.959-2.356-.058 0-.115.002-.172.005l.008 0h-3.711l-4.691-1.375c-.104-.032-.225-.051-.349-.051H7.18v-.257c0-.69-.56-1.25-1.25-1.25H2.047c-.69 0-1.25.56-1.25 1.25v12.208c0 .69.56 1.25 1.25 1.25H5.93c.69 0 1.25-.56 1.25-1.25v-.44c1.596.316 2.993.738 4.33 1.278l-.159-.057c1.209.432 2.603.682 4.056.682 1.676 0 3.274-.332 4.732-.934l-.082.03c1.271-.563 2.351-1.16 3.372-1.839l-.083.052c.334-.207.668-.412 1.004-.611 1.648-.977 2.973-1.832 4.17-2.699.595-.424 1.115-.843 1.608-1.29l-.014.013c.428-.353.769-.795.997-1.3l.009-.023c.052-.133.082-.287.082-.448 0-.093-.01-.184-.029-.271l.002.008c-.176-1.17-.885-2.144-1.868-2.68l-.019-.01ZM4.681 28.541H3.298v-9.709h1.383v9.709Zm23.698-6.367c-.398.356-.831.702-1.283 1.024l-.046.031c-1.131.818-2.395 1.635-3.975 2.57-.352.209-.697.424-1.045.639-.833.557-1.791 1.091-2.793 1.547l-.129.052c-1.096.451-2.369.712-3.703.712-1.137 0-2.229-.19-3.247-.54l.07.021c-1.451-.607-3.148-1.097-4.911-1.392l-.137-.019v-6.48h1.489l4.691 1.375c.105.032.226.051.351.051h3.891c.443 0 .697.17.697.469s-.254.469-.697.469h-6.809c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25h7.781c.185 0 .361-.04.519-.113l-.008.003 7.803-3.504c.228-.105.494-.167.774-.167.183 0 .359.026.526.075l-.013-.003c.185.113.326.282.4.484l.002.007c-.066.064-.137.129-.201.189ZM16.06 17.075c.23.254.561.413.929.413s.699-.159.928-.412l.001-.001 5.96-6.607c1.172-1.091 1.919-2.627 1.969-4.338v-.009c0-.014 0-.03 0-.047 0-1.469-.599-2.798-1.566-3.755-.986-.973-2.34-1.574-3.836-1.574-1.321 0-2.533.469-3.477 1.25l.009-.007c-.872-.648-1.971-1.038-3.16-1.038-.481 0-.947.064-1.39.183l.037-.009c-1.926.548-3.411 2.033-3.949 3.919l-.01.04c-.107.405-.168.869-.168 1.348 0 1.582.669 3.008 1.74 4.01l.003.003 5.985 6.594ZM10.919 5.729c.311-1.061 1.13-1.88 2.169-2.185l.023-.006c.213-.061.459-.095.712-.096.909.03 1.717.435 2.28 1.064l.003.003c.226.226.539.366.884.366s.658-.14.884-.366c.654-.727 1.577-1.199 2.612-1.26l.01-.001c.787.006 1.499.324 2.018.836.518.556.836 1.305.836 2.128 0 1.024-.492 1.933-1.254 2.504l-.008.006c-.016.015-.031.03-.044.046l-.001.001-5.053 5.601-5.097-5.648c-.649-.552-1.059-1.369-1.059-2.282 0-.253.031-.498.09-.733l-.004.021Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" aria-hidden="true">
      <path d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z" fill="#00C853" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 30 30" className="size-6 shrink-0" fill="#00C853" aria-hidden="true">
      <path d="M24.1 4.9C21 4.7 18 4 15 3c-2.9 1-5.9 1.7-9.1 1.9C5.4 5 5 5.4 5 5.9V17c0 3 1.7 5.8 4.4 7.2l5.1 2.6c.1.1.3.1.4.1.2 0 .3-.1.4-.1l5.1-2.6c2.7-1.4 4.4-4.1 4.4-7.2V5.9c0-.5-.4-.9-.9-1ZM19.7 22.4 15 24.8V15H7V6.9c2.7-.3 5.4-.9 8-1.7V15h8v2.1c0 2.2-1.3 4.3-3.3 5.3Z" />
    </svg>
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
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    setValue("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  }

  return (
    <section className="mt-10" aria-label="Comentários">
      {comments.length > 0 ? <CommentCarousel comments={comments} /> : null}
      <form className={comments.length > 0 ? "mt-2" : ""} onSubmit={handleSubmit}>
        <label htmlFor="public-comment" className="sr-only">
          Escreva um comentário
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-public-border bg-public-background p-2 shadow-sm">
          <Input
            id="public-comment"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Escreva um comentário"
            className="h-11 min-w-0 flex-1 border-0 bg-transparent text-public-foreground shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 text-donation hover:bg-donation-soft hover:text-donation"
            aria-label="Enviar comentário"
          >
            <Send className="size-6" aria-hidden="true" />
          </Button>
        </div>
        {sent ? (
          <p className="mt-2 text-sm font-medium text-donation" role="status">
            Mensagem Enviada Com Sucesso
          </p>
        ) : null}
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
    </div>
  );
}
