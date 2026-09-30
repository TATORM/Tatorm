/* ═══════════════════════════════════════════
   Test del sito nel browser (Playwright)
   ─────────────────────────────────────────
   Girano sulla build di produzione (_site/), cioè
   esattamente quello che va online.
     npm test            → build + unit + browser
     npm run test:e2e    → solo browser (serve _site/ già buildata)
     npx playwright show-report → report HTML dell'ultimo giro
   Shopify è simulato (tests/e2e/fixtures.mjs): i risultati
   non dipendono dallo stock reale né dalla rete.
   ═══════════════════════════════════════════ */
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx esbuild --servedir=_site --serve=127.0.0.1:${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
