# Mobile Builds (Android + iOS) with Capacitor

This project can be shipped as native apps using Capacitor. The app configuration is externalized in `.env.mobile`.

## 1) Create your mobile env file

Copy `.env.mobile.example` to `.env.mobile` and adjust values:

- `CAPACITOR_APP_ID` (reverse-DNS ID, e.g. `com.company.app`)
- `CAPACITOR_APP_NAME` (display name)
- `CAPACITOR_WEB_DIR` (usually `dist`)
- `CAPACITOR_SERVER_URL` (optional, for live-reload on device)
- `VITE_API_BASE_URL` (API base for mobile builds)

## 2) Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

## 3) Build the web app

```bash
npm run build
```

## 4) Initialize Capacitor

Use the values from `.env.mobile`:

```bash
npx cap init "Sales Portal" "com.plylam.salesportal" --web-dir dist
```

## 5) Add platforms

```bash
npx cap add android
npx cap add ios
```

## 6) Sync the web build

```bash
npx cap sync
```

## 7) Run on Android

```bash
npx cap open android
```

Then in Android Studio:

1. Build > Build Bundle(s)/APK(s) > Build APK(s)

## 8) Run on iOS

```bash
npx cap open ios
```

Then in Xcode:

1. Set Signing & Capabilities
2. Product > Archive to generate an IPA

## Live reload (optional)

1. Run the dev server:
   `npm run dev`
2. Set `CAPACITOR_SERVER_URL` in `.env.mobile` to your LAN IP.
3. Re-sync and open the platform:

```bash
npx cap sync
npx cap open android
```
