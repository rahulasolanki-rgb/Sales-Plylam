<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Sales Portal Plylam

Sales Portal web app for Timber & Plywood.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Create local env:
   `VITE_API_BASE_URL=http://localhost/natural/api`
3. Run the app:
   `npm run dev`

## Production Build

1. Use the production env template:
   `production.env`
2. Rename it to `.env.production` (Vite reads this by default), or set the same variables in your deployment system.
3. Build:
   `npm run build`
4. Preview locally:
   `npm run preview`

## Android APK (Capacitor)

**Prerequisites:** Android Studio installed

1. Build the web app:
   `npm run build`
2. Add Capacitor:
   `npm install @capacitor/core @capacitor/cli`
3. Initialize:
   `npx cap init`
4. Add Android platform:
   `npx cap add android`
5. Sync web build:
   `npx cap sync`
6. Open in Android Studio:
   `npx cap open android`
7. In Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)

## iOS IPA (Capacitor)

**Prerequisites:** macOS + Xcode installed

1. Build the web app:
   `npm run build`
2. Add Capacitor:
   `npm install @capacitor/core @capacitor/cli`
3. Initialize:
   `npx cap init`
4. Add iOS platform:
   `npx cap add ios`
5. Sync web build:
   `npx cap sync`
6. Open in Xcode:
   `npx cap open ios`
7. In Xcode: set Signing & Capabilities, then Product > Archive to generate an IPA
