import fs from 'node:fs/promises'
import path from 'node:path'

import { test, expect } from '../support/fixtures'

const evidenceDir = path.join(process.cwd(), 'docs/tests/evidence/CT03')

const validCustomer = {
  name: 'Maria',
  surname: 'Silva',
  email: 'maria@example.com',
  phone: '(11) 98888-7777',
  cpf: '123.456.789-09',
  storeLabel: 'Velô Paulista - Av. Paulista, 1000',
} as const

async function saveEvidence(page: import('@playwright/test').Page, filename: string) {
  await fs.mkdir(evidenceDir, { recursive: true })
  await page.screenshot({
    path: path.join(evidenceDir, filename),
    fullPage: true,
  })
}

test.describe('Validação de Campos Obrigatórios e Dados Inválidos no Checkout', () => {
  test.beforeEach(async ({ app }) => {
    await app.checkout.openLanding()
    await app.checkout.startConfiguratorFromLanding()
    await app.checkout.openCheckoutFromConfigurator()
  })

  test('passo 1 — submissão vazia exige campos obrigatórios', async ({ page, app }) => {
    await app.checkout.confirmOrder()

    await expect(
      page.getByText('Nome deve ter pelo menos 2 caracteres', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('Sobrenome deve ter pelo menos 2 caracteres', { exact: true }),
    ).toBeVisible()
    await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()
    await expect(page.getByText('Telefone inválido', { exact: true })).toBeVisible()
    await expect(page.getByText('CPF inválido', { exact: true })).toBeVisible()
    await expect(
      page.locator('p.text-destructive').filter({ hasText: /^Selecione uma loja$/ }),
    ).toBeVisible()
    await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()

    await saveEvidence(page, 'ct03-passo-01-campos-obrigatorios.png')
  })

  test('passo 2 — email com formato inválido', async ({ page, app }) => {
    await app.checkout.fillPersonalData({
      ...validCustomer,
      email: 'email_invalido',
    })
    await app.checkout.setTermsAccepted(true)
    await app.checkout.confirmOrder()

    await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct03-passo-02-email-invalido.png')
  })

  test('passo 3 — telefone com formato incompleto', async ({ page, app }) => {
    await app.checkout.fillPersonalData(validCustomer)
    await app.checkout.clearPhoneField()
    await app.checkout.setTermsAccepted(true)
    await app.checkout.confirmOrder()

    await expect(page.getByText('Telefone inválido', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct03-passo-03-telefone-incompleto.png')
  })

  test('passo 4 — termos não aceitos bloqueia envio', async ({ page, app }) => {
    await app.checkout.fillPersonalData(validCustomer)
    await app.checkout.setTermsAccepted(false)
    await app.checkout.confirmOrder()

    await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct03-passo-04-termos-obrigatorios.png')
  })
})
