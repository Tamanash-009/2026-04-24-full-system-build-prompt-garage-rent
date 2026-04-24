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

Current production deployment on April 25, 2026:

- [https://2026-04-24-full-system-build-prompt.vercel.app](https://2026-04-24-full-system-build-prompt.vercel.app)

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

Current machine result on April 25, 2026:

- Android project scaffold: successful
- Android icon and splash generation: successful
- debug APK build: successful
- release APK build: successful
- release output: [android/app/build/outputs/apk/release/app-release-unsigned.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/release/app-release-unsigned.apk)
- debug output: [android/app/build/outputs/apk/debug/app-debug.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/debug/app-debug.apk)

If you need to rebuild locally:

1. Set `CAPACITOR_ANDROID_SERVER_URL` to the deployed GarageFlow HTTPS URL.
2. Run `npm run android:sync`.
3. Run `npm run android:assets`.
4. Run `npm run android:apk` or open the native project in Android Studio.

## 6. Current publish blockers on this machine

As of April 25, 2026:

- Vercel deployment is already live and working
- `gh auth status` still fails because the GitHub token in keyring is invalid and needs `gh auth login`

Once GitHub auth is refreshed, the repo is ready to publish remotely.

## 7. Recommended publish sequence

1. `gh auth login`
2. Create or link the GitHub repository
3. `git push -u origin main`
4. Confirm the live Vercel deployment URL

## 8. Validation checklist

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- confirm Supabase Auth sign-in
- confirm tenancy creation generates pending rent rows
- confirm marking rent paid updates the dashboard live
- confirm electricity bills appear in tenant and admin views
- confirm PDF and Excel exports download correctly
