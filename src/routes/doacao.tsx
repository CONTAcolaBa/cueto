import { createFileRoute } from "@tanstack/react-router";
import { DonationPage } from "@/components/PageTemplate";

export const Route = createFileRoute("/doacao")({
  head: () => ({
    meta: [
      { title: "Fazer uma doação | Ação Solidária" },
      {
        name: "description",
        content: "Escolha o valor da sua contribuição para a Ação Solidária.",
      },
      { property: "og:title", content: "Fazer uma doação | Ação Solidária" },
      { property: "og:description", content: "Escolha o valor da sua contribuição para a Ação Solidária." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonationRoute,
});

function DonationRoute() {
  return <DonationPage />;
}
