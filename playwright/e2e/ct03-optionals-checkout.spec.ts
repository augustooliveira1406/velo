import fs from 'node:fs/promises'
import path from 'node:path'

import { test, expect } from '../support/fixtures'

const evidenceDir = path.join(process.cwd(), 'docs/tests/evidence/CT03')

async function saveEvidence(page: import('@playwright/test').Page, filename: string) {
  await fs.mkdir(evidenceDir, { recursive: true })
  await page.screenshot({
    path: path.join(evidenceDir, filename),
    fullPage: true,
  })
}

test.describe('CT03 — Opcionais e preço no configurador + checkout', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('passo 1 — Precision Park (+R$ 5.500)', async ({ page, app }) => {
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.expectTotalPrice('R$ 45.500,00')
    await saveEvidence(page, 'ct03-passo-01-precision-park.png')
  })

  test('passo 2 — Flux Capacitor (+R$ 5.000 sobre o anterior)', async ({ page, app }) => {
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.expectTotalPrice('R$ 50.500,00')
    await saveEvidence(page, 'ct03-passo-02-flux-capacitor.png')
  })

  test('passo 3 — desmarcar opcionais volta ao preço base', async ({ page, app }) => {
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.expectTotalPrice('R$ 50.500,00')

    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.expectTotalPrice('R$ 40.000,00')
    await saveEvidence(page, 'ct03-passo-03-sem-opcionais.png')
  })

  test('passo 4 — Monte o Seu leva ao checkout com resumo', async ({ page, app }) => {
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.checkout.openCheckoutFromConfigurator()
    await expect(page).toHaveURL(/\/order$/)
    await app.checkout.expectSummaryTotalPrice('R$ 40.000,00')
    await saveEvidence(page, 'ct03-passo-04-checkout-resumo.png')
  })
})
