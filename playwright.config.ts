import { defineConfig, devices } from '@playwright/test'

const PORT = 3099

// Проверяем ровно то, что поедет в прод: продакшен-сборка + npm start.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: `http://localhost:${PORT}/healthz`,
    env: { PORT: String(PORT), YM_ID: '' },
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
