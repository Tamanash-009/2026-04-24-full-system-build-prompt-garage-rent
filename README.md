# GarageFlow

GarageFlow is a production-oriented garage rental management system built with Next.js 14, TypeScript, TailwindCSS, shadcn/ui-style components, Supabase Auth/Postgres/Realtime, Recharts, Zustand, PDF export, and Excel export.

## What’s included

- Admin and tenant authentication flow
- Admin dashboard with analytics, charts, recent payments, and live metrics
- Tenant workspace for rent history, dues, and electricity bills
- Monthly rent auto-generation from tenancy start date
- Pending-vs-paid month detection with advance balance logic
- Electricity meter entry with automatic unit calculation
- PDF and Excel ledger exports
- Realtime refresh through Supabase changes
- Android-friendly installable PWA experience
- Supabase SQL migration with RLS, triggers, and rent sync functions
- Vercel cron configuration for automatic monthly rent synchronization

## Stack

- Next.js 14 App Router
- TypeScript
- TailwindCSS
- Radix/shadcn-style UI primitives
- Supabase
- Recharts
- Zustand
- PDFKit
- xlsx
- Vitest

## Routes

- `/` landing page
- `/sign-in`
- `/sign-up`
- `/dashboard`
- `/tenants`
- `/payments`
- `/electricity`
- `/api/export/pdf`
- `/api/export/excel`
- `/api/cron/sync-rent`

## Required environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_INVITE_CODE=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the preferred current client key. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a fallback.

## Local setup

1. Use Node `20.18.1` or another Node 20/22 runtime.
2. Run `npm install`.
3. Apply the Supabase migration in [supabase/migrations/202604240001_init.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604240001_init.sql).
4. Add the environment variables.
5. Run `npm run dev`.

## Verification completed

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`

## Notes about this machine

The current local desktop environment is using an unsupported global Node runtime for Next.js 14 native builds, so a full local `next build` is not reliable here. The project is pinned to Node `20.18.1`, which matches the intended Vercel deployment runtime.

## Android install support

GarageFlow ships as an installable PWA:

- manifest and branded icons
- service worker registration
- install prompt banner
- standalone launch mode

For Chrome on Android, open the deployed site and choose `Add to Home screen`.

## Key files

- [app](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/app)
- [components](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/components)
- [lib](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/lib)
- [supabase/migrations/202604240001_init.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604240001_init.sql)
- [vercel.json](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/vercel.json)
- [DEPLOYMENT.md](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/DEPLOYMENT.md)
- [LINKEDIN_POST.md](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/LINKEDIN_POST.md)
