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
    ],
  }),
  component: DonationRoute,
});

function DonationRoute() {
  return <DonationPage />;
}
