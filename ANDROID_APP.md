# Android APK Support

GarageFlow includes a Capacitor-based Android wrapper path in this repo.

## What is included

- `capacitor.config.ts`
- `native-shell/` fallback shell for native packaging
- Android scripts in `package.json`
- generated app asset sources in `assets/`
- official Capacitor asset generator dependency

## Important architecture note

GarageFlow is a server-rendered Next.js + Supabase app. Because of that, the Android app is designed to wrap the deployed HTTPS GarageFlow site rather than a static exported bundle.

Set this before syncing or building Android:

```bash
CAPACITOR_ANDROID_SERVER_URL=https://2026-04-24-full-system-build-prompt.vercel.app
```

## Commands

```bash
npm run android:shell
npm run android:add
npm run android:assets
npm run android:sync
npm run android:open
npm run android:apk
```

## Expected local requirements

- Node 20
- Android SDK
- JDK 21 configured for Gradle

## Suggested flow

1. Deploy GarageFlow to Vercel.
2. Set `CAPACITOR_ANDROID_SERVER_URL` to the production URL.
3. Run `npm run android:add` once.
4. Run `npm run android:assets`.
5. Run `npm run android:sync`.
6. Open Android Studio with `npm run android:open` if you want to inspect the native project.
7. Build the debug or release APK.

## Current verification result

As of April 25, 2026:

- `npx cap add android` completed successfully
- `npm run android:assets` completed successfully
- `npm run android:sync` completed successfully against the live Vercel deployment
- Gradle debug build completed successfully
- Gradle release build completed successfully
- debug APK: [android/app/build/outputs/apk/debug/app-debug.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/debug/app-debug.apk)
- release APK: [android/app/build/outputs/apk/release/app-release-unsigned.apk](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/android/app/build/outputs/apk/release/app-release-unsigned.apk)
- release signing is still required before Play Store distribution

## Branding assets

- [assets/logo.svg](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/assets/logo.svg)
- [assets/logo.png](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/assets/logo.png)
- [assets/splash.png](/C:/Users/chakr/Documents/Codex/2026-04-24-full-system-build-prompt-garage-rent/assets/splash.png)
