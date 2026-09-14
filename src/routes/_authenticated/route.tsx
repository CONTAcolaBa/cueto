import { createFileRoute, Outlet } from "@tanstack/react-router";

// Login temporariamente desativado para visualização do painel.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
