import { createMiddleware } from "@tanstack/react-start";

/** Attaches the Supabase bearer token to every server function call from the browser. */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (typeof window === "undefined") return next();

    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return next();

    return next({ headers: { Authorization: `Bearer ${token}` } });
  },
);
