# Replit setup

## Running locally in Replit

The project uses TanStack Start with Vite and Bun.

```sh
bun install --frozen-lockfile
bun run dev
```

The Replit workflow `Start application` runs `bun run dev` on port `5000`.
The Vite configuration binds to `0.0.0.0` and allows Replit's proxied hosts.

## Required environment

Supabase-backed routes require these variables to be available in the environment:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The project also defines project ID variables for Supabase:

- `SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PROJECT_ID`

Do not commit secret values to the repository.