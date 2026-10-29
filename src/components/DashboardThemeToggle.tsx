import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "pagemult:dashboard-theme";

type DashboardTheme = "light" | "dark";

function readStoredTheme(): DashboardTheme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function writeStoredTheme(theme: DashboardTheme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Armazenamento indisponível: a escolha vale só para esta visita.
  }
}

function applyTheme(theme: DashboardTheme) {
  document.documentElement.dataset["dashboardTheme"] = theme;
}

/**
 * Botão de alternância claro/escuro do painel.
 * A preferência é guardada no navegador e vale apenas enquanto o painel estiver
 * aberto: ao sair, o atributo é removido e as demais telas seguem no tema padrão.
 */
export function DashboardThemeToggle() {
  const [theme, setTheme] = useState<DashboardTheme>("dark");

  useEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    applyTheme(stored);
    return () => {
      delete document.documentElement.dataset["dashboardTheme"];
    };
  }, []);

  function toggleTheme() {
    const next: DashboardTheme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    writeStoredTheme(next);
  }

  const isLight = theme === "light";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-pressed={isLight}
      aria-label="Alternar modo claro e modo escuro do painel"
      title={isLight ? "Mudar para o modo escuro" : "Mudar para o modo claro"}
    >
      {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="hidden sm:inline">{isLight ? "Escuro" : "Claro"}</span>
    </Button>
  );
}
