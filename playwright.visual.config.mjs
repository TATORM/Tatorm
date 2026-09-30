/* ═══════════════════════════════════════════
   Test visivi (solo in locale, non in CI)
   ─────────────────────────────────────────
   Screenshot delle pagine principali in 4 formati, confrontati
   pixel per pixel con quelli di riferimento.
     npm run test:visual          → confronta
     npm run test:visual:update   → aggiorna i riferimenti (dopo
                                    una modifica di design approvata)
   I riferimenti dipendono dal Mac (font rendering) → non vanno in
   git né in CI. Pagine rese deterministiche: ordine casuale della
   Home fissato, animazioni spente, Shopify simulato.
   ═══════════════════════════════════════════ */
import { defineConfig } from '@playwright/test';

const PORT = 4174;

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: 'tests/visual/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  reporter: [['list']],
  expect: { toHaveScreenshot: { maxDiffPixels: 0, animations: 'disabled', caret: 'hide' } },
  use: { baseURL: `http://127.0.0.1:${PORT}`, deviceScaleFactor: 1 },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet-landscape', use: { viewport: { width: 1180, height: 820 }, hasTouch: true } },
    { name: 'tablet-portrait', use: { viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: `DIR=_site PORT=${PORT} node scripts/serve.mjs`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: true,
  },
});
