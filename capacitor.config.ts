import { CapacitorConfig } from '@capacitor/cli';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

const envFiles = ['.env.mobile', '.env.production', '.env.local', '.env'];

for (const envFile of envFiles) {
  loadEnv({ path: resolve(process.cwd(), envFile), override: false });
}

const appId = process.env.CAPACITOR_APP_ID ?? 'com.plylam.salesportal';
const appName = process.env.CAPACITOR_APP_NAME ?? 'Sales Portal';
const webDir = process.env.CAPACITOR_WEB_DIR ?? 'dist';
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId,
  appName,
  webDir,
  bundledWebRuntime: false,
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: true,
        },
      }
    : {}),
};

export default config;
