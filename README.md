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
   Copy `.env.example` to `.env.local` and update values.
3. Run the app:
   `npm run dev`

## Production Build

1. Use the production env template:
   `.env.example`
2. Rename it to `.env.production` (Vite reads this by default), or set the same variables in your deployment system.
3. Build:
   `npm run build`
4. Preview locally:
   `npm run preview`

## Android + iOS Apps (Capacitor)

See `docs/MOBILE.md` for the full guide, including externalized mobile config in `.env.mobile`.
