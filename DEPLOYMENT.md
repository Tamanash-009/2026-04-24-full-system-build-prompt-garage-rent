# Deployment Guide

## 1. Supabase setup

Run the SQL migration in Supabase SQL Editor:

- [supabase/migrations/202604240001_init.sql](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/supabase/migrations/202604240001_init.sql)

This creates:

- `users`
- `properties`
- `tenancies`
- `rent_payments`
- `electricity`
- auth profile trigger
- RLS policies
- realtime table publication
- automatic rent sync functions and tenancy trigger

## 2. Vercel environment variables

Add these in the Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_INVITE_CODE`

Optional fallback:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Runtime

Use Node `20.18.1` on Vercel.

Suggested Vercel project settings:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `next build`
- Output directory: default

## 4. Cron schedule

`vercel.json` is configured to call `/api/cron/sync-rent` at `35 18 * * *`, which equals `00:05 IST` every day.

That daily schedule is intentional:

- it guarantees the first day of a new month is created promptly
- it self-heals if a previous cron run was missed

## 5. Android install flow

After deployment:

1. Open the production URL in Chrome on Android.
2. Sign in.
3. Use `Add to Home screen`.
4. The app launches in standalone mode with the GarageFlow branding.

## 5b. Android APK wrapper flow

GarageFlow also includes a Capacitor Android wrapper project.

Before building the APK locally:

1. Install Android Studio and the Android SDK.
2. Set `CAPACITOR_ANDROID_SERVER_URL` to the deployed GarageFlow HTTPS URL.
3. Run `npm run android:sync`.
4. Run `npm run android:assets`.
5. Run `npm run android:apk` or open the native project in Android Studio.

Current machine result on April 25, 2026:

- Android project scaffold: successful
- Android icon and splash generation: successful
- APK compile: blocked by missing Android SDK

## 6. Current publish blockers on this machine

As of April 25, 2026:

- `vercel whoami` resolves, but `vercel --prod --yes` fails because the locally stored token is invalid and needs `vercel login`
- `gh auth status` fails because the GitHub token in keyring is invalid and needs `gh auth login`

Once those are refreshed, the project is ready to publish.

## 7. Recommended publish sequence

1. `vercel login`
2. `gh auth login`
3. `git init`
4. `git branch -M main`
5. `git add .`
6. `git commit -m "Build GarageFlow rent management system"`
7. Create or link the GitHub repository
8. `git push -u origin main`
9. `vercel --prod --yes`

## 8. Validation checklist

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- confirm Supabase Auth sign-in
- confirm tenancy creation generates pending rent rows
- confirm marking rent paid updates the dashboard live
- confirm electricity bills appear in tenant and admin views
- confirm PDF and Excel exports download correctly
