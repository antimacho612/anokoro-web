import { defineConfig, devices } from "@playwright/test";

const DEV_PORT = 4173;
const BUILD_PORT = 4174;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${DEV_PORT}` },
    },
    {
      name: "build",
      testMatch: /security\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${BUILD_PORT}` },
    },
  ],
  webServer: [
    {
      command: `vp dev --port ${DEV_PORT} --strictPort`,
      url: `http://localhost:${DEV_PORT}/kit/`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `vp build && vp preview --port ${BUILD_PORT} --strictPort`,
      url: `http://localhost:${BUILD_PORT}/kit/`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
