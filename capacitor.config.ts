import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_ANDROID_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.garageflow.app",
  appName: "GarageFlow",
  webDir: "native-shell",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: false
      }
    : undefined,
  android: {
    backgroundColor: "#0f172a",
    allowMixedContent: false
  }
};

export default config;
