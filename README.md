# Asirem Academy

The Operating System for Education. A multi-tenant SaaS where many independent
institutions each run their own online school (branding, users, courses, data
isolation) on one platform.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS**
- **Supabase** — Postgres + RLS (multi-tenant), Auth, Storage

## Local development

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3002
```

## Tenancy model

- Every tenant-owned row carries an `institution_id`; Postgres RLS enforces
  isolation (never disabled in app code).
- A user's role is scoped **per institution** via the `memberships` table.
- Tenants resolve by **subdomain** in production; in dev, by the
  `/t/<subdomain>` path prefix (`src/proxy.ts`).

## Environment variables

See `.env.example`. In production these are set in Vercel Project Settings.
`SUPABASE_SERVICE_ROLE_KEY` is server-only and must be encrypted.

## Deploying on Vercel

This repo auto-deploys on push to `main`. Set the environment variables above
in the Vercel project before the first deploy.
