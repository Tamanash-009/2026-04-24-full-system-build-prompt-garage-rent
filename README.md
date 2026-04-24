# GarageFlow

GarageFlow is a production-oriented garage rental management system built with Next.js 14, TypeScript, TailwindCSS, shadcn/ui-style components, Clerk Google sign-in, Supabase Postgres/Realtime, Recharts, Zustand, PDF export, and Excel export.

## What's included

- Clerk Google authentication with onboarding for admin and tenant roles
- Admin dashboard with analytics, charts, recent payments, and live metrics
- Tenant workspace for rent history, dues, and electricity bills
- Monthly rent auto-generation from tenancy start date
- Pending-vs-paid month detection with advance balance logic
- Electricity meter entry with automatic unit calculation
- PDF and Excel ledger exports
- Realtime refresh through Supabase changes
- Android-friendly installable PWA experience
- Capacitor Android wrapper project with generated native icons and splash assets
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
- `/sso-callback`
- `/auth-complete`
- `/onboarding`
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
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/auth-complete
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/auth-complete
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
3. Apply the Supabase migrations in order:
   - [supabase/migrations/202604240001_init.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604240001_init.sql)
   - [supabase/migrations/202604250002_clerk_auth.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604250002_clerk_auth.sql)
4. In Clerk, enable Google as a social connection and connect the Clerk instance to Supabase.
5. Add the environment variables.
6. Run `npm run dev`.

If you are migrating an existing Supabase Auth install, backfill `public.users.email` before switching traffic to Clerk so Google sign-in can reconnect users to their current tenancies and properties.

## Verification completed

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Live deployment

- Production URL: [https://2026-04-24-full-system-build-prompt.vercel.app](https://2026-04-24-full-system-build-prompt.vercel.app)

## Android install support

GarageFlow ships as an installable PWA:

- manifest and branded icons
- service worker registration
- install prompt banner
- standalone launch mode

For Chrome on Android, open the deployed site and choose `Add to Home screen`.

## Android APK support

This repo also includes a Capacitor Android wrapper:

- [capacitor.config.ts](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/capacitor.config.ts)
- [ANDROID_APP.md](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/ANDROID_APP.md)
- [android](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android)

Current machine status on April 25, 2026:

- the native Android project scaffolds successfully
- native icons and splash assets generate successfully
- debug APK built successfully at [android/app/build/outputs/apk/debug/app-debug.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/debug/app-debug.apk)
- release APK built successfully at [android/app/build/outputs/apk/release/app-release-unsigned.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/release/app-release-unsigned.apk)
- the release artifact is unsigned, which is normal before Play Store or side-load distribution signing

## Key files

- [app](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/app)
- [components](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/components)
- [lib](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/lib)
- [supabase/migrations/202604240001_init.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604240001_init.sql)
- [vercel.json](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/vercel.json)
- [DEPLOYMENT.md](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/DEPLOYMENT.md)
- [LINKEDIN_POST.md](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/LINKEDIN_POST.md)
