import { useQuery } from "@tanstack/react-query";
import { FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Lead = { id: string; slug: string; whatsapp: string; created_at: string };

function formatPhone(d: string) {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}

export function LeadsSheets({ pages }: { pages: { slug: string; title: string }[] }) {
  const { data: leads = [] } = useQuery({
    queryKey: ["campaign-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_leads")
        .select("id, slug, whatsapp, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const groups = pages
    .map((p) => ({ ...p, leads: leads.filter((l) => l.slug === p.slug) }))
    .filter((g) => g.leads.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <FileSpreadsheet className="size-5 text-primary" />
        Contatos coletados
      </h2>
      <div className="grid gap-6">
        {groups.map((g) => (
          <article key={g.slug} className="overflow-hidden rounded-xl border bg-card">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <h3 className="font-semibold">{g.title}</h3>
              <span className="text-sm text-muted-foreground">{g.leads.length} contato(s)</span>
            </header>
            <table className="hidden w-full text-sm sm:table">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">WhatsApp</th>
                  <th className="px-4 py-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {g.leads.map((l, i) => (
                  <tr key={l.id} className="border-t">
                    <td className="px-4 py-2 text-muted-foreground">{g.leads.length - i}</td>
                    <td className="px-4 py-2 font-medium tabular-nums">
                      <a href={`https://wa.me/${l.whatsapp.length <= 11 ? "55" + l.whatsapp : l.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-primary">
                        {formatPhone(l.whatsapp)}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="divide-y sm:hidden">
              {g.leads.map((l) => (
                <li key={l.id} className="flex flex-col gap-0.5 px-4 py-3">
                  <a href={`https://wa.me/${l.whatsapp.length <= 11 ? "55" + l.whatsapp : l.whatsapp}`} target="_blank" rel="noreferrer" className="font-medium tabular-nums">
                    {formatPhone(l.whatsapp)}
                  </a>
                  <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
