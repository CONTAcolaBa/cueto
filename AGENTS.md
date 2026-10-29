<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the panel's color mode separate from the public microsites: the dashboard reads the semantic tokens (`--background`, `--card`, `--primary`…) that `:root` defines as dark and that `html[data-dashboard-theme="light"]` overrides, while public pages and checkout must keep using the `--public-*` / `--donation` tokens so no theme switch can restyle them. Why: the user asked for a light/dark switch in the panel only, and the public pages must always look identical.
- Apply the panel theme only while the authenticated area is mounted (set `data-dashboard-theme` on `<html>` on mount, remove it on unmount, persist the choice in `localStorage`), so signing out or opening a public link falls back to the default palette. Why: prevents the panel's preference leaking into public pages that share the same SPA session.
