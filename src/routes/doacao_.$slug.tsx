import { createFileRoute } from "@tanstack/react-router";
import { DonationPage } from "@/components/PageTemplate";

export const Route = createFileRoute("/doacao_/$slug")({
  head: () => ({
    meta: [
      { title: "Fazer uma doação | Ação Solidária" },
      { name: "description", content: "Escolha o valor da sua contribuição para esta campanha." },
      { property: "og:title", content: "Fazer uma doação | Ação Solidária" },
      { property: "og:description", content: "Escolha o valor da sua contribuição para esta campanha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlugDonation,
});

function SlugDonation() {
  const { slug } = Route.useParams();
  return <DonationPage slug={slug} />;
}
