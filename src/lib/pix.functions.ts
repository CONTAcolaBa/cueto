import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://api.realtechdev.com.br";
// Fixed buyer data requested for every transaction.
const BUYER = { name: "Elias da Silva Pinto", email: "Eliaspinto@gmail.com" };

function getHeaders() {
  const token = process.env["BUCKPAY_TOKEN"];
  const userAgent = process.env["BUCKPAY_USER_AGENT"];
  if (!token || !userAgent) throw new Error("Pagamento Pix ainda não configurado.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "user-agent": userAgent,
  };
}

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ amount: z.number().min(10).max(100000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const externalId = `doacao_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const res = await fetch(`${API_BASE}/v1/transactions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        external_id: externalId,
        payment_method: "pix",
        amount: Math.round(data.amount * 100),
        buyer: BUYER,
      }),
    });
    const json = (await res.json().catch(() => null)) as {
      data?: { id: string; status: string; pix: { code: string; qrcode_base64: string } };
    } | null;
    if (!res.ok || !json?.data) {
      console.error("BuckPay create error", res.status, json);
      throw new Error("Não foi possível gerar o Pix. Tente novamente.");
    }
    return {
      externalId,
      status: json.data.status,
      code: json.data.pix.code,
      qrcodeBase64: json.data.pix.qrcode_base64,
    };
  });

export const getPixStatus = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ externalId: z.string().regex(/^doacao_[\w-]+$/).max(80) }).parse(input),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `${API_BASE}/v1/transactions/external_id/${encodeURIComponent(data.externalId)}`,
      { headers: getHeaders() },
    );
    const json = (await res.json().catch(() => null)) as { data?: { status?: string } } | null;
    if (!res.ok) {
      console.error("BuckPay status error", res.status, json);
      return { status: "unknown" };
    }
    return { status: json?.data?.status ?? "unknown" };
  });
