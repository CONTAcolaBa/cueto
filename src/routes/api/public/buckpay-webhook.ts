import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const API_BASE = "https://api.realtechdev.com.br";

const PayloadSchema = z
  .object({
    data: z.object({ external_id: z.string().regex(/^doacao_[\w-]+$/).max(80) }).passthrough(),
  })
  .passthrough();

// BuckPay notifies payment events here. The payload is never trusted:
// the status is re-checked directly with BuckPay before confirming anything.
export const Route = createFileRoute("/api/public/buckpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = PayloadSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("ignored", { status: 200 });
        const externalId = parsed.data.data.external_id;

        const token = process.env["BUCKPAY_TOKEN"];
        const userAgent = process.env["BUCKPAY_USER_AGENT"];
        if (!token || !userAgent) return new Response("not configured", { status: 500 });

        const res = await fetch(
          `${API_BASE}/v1/transactions/external_id/${encodeURIComponent(externalId)}`,
          { headers: { Authorization: `Bearer ${token}`, "user-agent": userAgent } },
        );
        if (!res.ok) return new Response("lookup failed", { status: 502 });
        const json = (await res.json().catch(() => null)) as { data?: { status?: string } } | null;
        const status = json?.data?.status;

        if (status === "paid" || status === "approved") {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.rpc("confirm_pix_payment", { _external_id: externalId });
        }
        return new Response("ok");
      },
    },
  },
});
