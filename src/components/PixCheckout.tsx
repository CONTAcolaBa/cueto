import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createPixPayment, getPixStatus } from "@/lib/pix.functions";

type Pix = { externalId: string; code: string; qrcodeBase64: string };

export function PixCheckout({ amount }: { amount: number }) {
  const createFn = useServerFn(createPixPayment);
  const statusFn = useServerFn(getPixStatus);
  const [pix, setPix] = useState<Pix | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!pix || paid) return;
    const id = window.setInterval(async () => {
      try {
        const { status } = await statusFn({ data: { externalId: pix.externalId } });
        if (status === "paid" || status === "approved") setPaid(true);
      } catch {
        /* keep polling */
      }
    }, 5000);
    return () => window.clearInterval(id);
  }, [pix, paid, statusFn]);

  async function handleContribute() {
    if (amount < 1) {
      setError("Informe um valor de pelo menos R$ 1,00.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      setPix(await createFn({ data: { amount } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar o Pix.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (paid) {
    return (
      <p className="mt-4 rounded-2xl bg-donation-soft p-5 text-center text-xl font-semibold text-donation" role="status">
        Pagamento confirmado! Obrigado pela sua doação.
      </p>
    );
  }

  if (pix) {
    return (
      <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border-2 border-donation p-5">
        <p className="text-lg font-semibold">Escaneie o QR Code ou copie o código Pix</p>
        <img
          src={`data:image/png;base64,${pix.qrcodeBase64}`}
          alt="QR Code Pix"
          className="size-56 rounded-lg bg-white p-2"
        />
        <p className="w-full break-all rounded-lg bg-public-muted p-3 text-xs">{pix.code}</p>
        <button
          type="button"
          onClick={copy}
          className="h-14 w-full rounded-2xl bg-donation text-xl font-semibold text-donation-foreground"
        >
          {copied ? "Copiado!" : "Copiar código Pix"}
        </button>
        <p className="text-sm text-public-muted-foreground">Aguardando pagamento...</p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleContribute}
        disabled={loading}
        className="mt-4 h-16 w-full rounded-2xl bg-donation text-2xl font-semibold text-donation-foreground shadow-sm disabled:opacity-70"
      >
        {loading ? "Gerando Pix..." : "Contribuir"}
      </button>
      {error ? <p className="mt-3 text-center text-sm font-medium text-destructive" role="alert">{error}</p> : null}
    </>
  );
}
