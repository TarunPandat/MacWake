# MacWake website

The product site: what MacWake does, how it works, and downloads for Mac, iPhone/iPad, Android and the web console.
Next.js (App Router), plain CSS Modules, `motion` for the interactive parts. Same palette and Onest font as the apps.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Deploy on Vercel

1. Import the repo in Vercel and set **Root Directory** to `website`. Framework preset: Next.js.
2. Optional environment variables (Project → Settings → Environment Variables):

| Variable | Default | What |
|----------|---------|------|
| `NEXT_PUBLIC_CONSOLE_URL` | `https://mac-wake-console.vercel.app` | "Open the console" links |
| `NEXT_PUBLIC_IOS_URL` | empty | App Store or TestFlight link. Empty shows "Coming soon to the App Store". |
| `NEXT_PUBLIC_MAC_URL` | `/downloads/MacWake.dmg` | Mac download |
| `NEXT_PUBLIC_ANDROID_URL` | `/downloads/MacWake.apk` | Android download |
| `NEXT_PUBLIC_SITE_URL` | `https://macwake.vercel.app` | Canonical URL for link previews |

All links live in `lib/site.js`.

## Downloads

The files in `public/downloads/` are served as-is:

- `MacWake.dmg`: copy of `../mac/dist/MacWake.dmg` (build it with `CONSOLE_URL=… ../mac/build.sh`).
- `MacWake.apk`: `cd ../mobile/android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a`, then copy
  `app/build/outputs/apk/release/app-release.apk`. It is signed with the template's debug key, which is fine for direct
  installs; Google Play needs your own upload key.

After a new build, copy the file over and bump `macVersion` in `lib/site.js`.

## Icons

`app/icon.svg`, `app/favicon.ico` and `app/apple-icon.png` come from `../tools/tab-icon.svg` via `../tools/make-icons.sh`.
