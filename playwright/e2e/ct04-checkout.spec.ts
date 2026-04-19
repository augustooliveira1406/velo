import fs from 'node:fs/promises'
import path from 'node:path'

import { test, expect } from '../support/fixtures'

const evidenceDir = path.join(process.cwd(), 'docs/tests/evidence/CT04')

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

test.describe('CT04 — Validação de campos obrigatórios e dados inválidos no checkout', () => {
  test.beforeEach(async ({ app }) => {
    await app.checkout.openLanding()
    await app.checkout.startConfiguratorFromLanding()
    await app.checkout.openCheckoutFromConfigurator()
  })

  test('passo 1 — formulário em branco', async ({ page, app }) => {
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

    await saveEvidence(page, 'ct04-passo-01-formulario-em-branco.png')
  })

  test('passo 2 — nome e sobrenome com apenas uma letra', async ({ page, app }) => {
    await app.checkout.fillPersonalData({ name: 'M', surname: 'S' })
    await app.checkout.confirmOrder()

    await expect(
      page.getByText('Nome deve ter pelo menos 2 caracteres', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('Sobrenome deve ter pelo menos 2 caracteres', { exact: true }),
    ).toBeVisible()

    await saveEvidence(page, 'ct04-passo-02-nome-sobrenome-curtos.png')
  })

  test('passo 3 — e-mail inválido (cliente@.com)', async ({ page, app }) => {
    await app.checkout.fillPersonalData({
      ...validCustomer,
      email: 'cliente@.com',
    })
    await app.checkout.setTermsAccepted(true)
    await app.checkout.confirmOrder()

    await expect(page.getByText('Email inválido', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct04-passo-03-email-invalido.png')
  })

  test('passo 4 — CPF incompleto', async ({ page, app }) => {
    await app.checkout.fillPersonalData(validCustomer)
    await app.checkout.clearCpfField()
    await app.checkout.setTermsAccepted(true)
    await app.checkout.confirmOrder()

    await expect(page.getByText('CPF inválido', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct04-passo-04-cpf-incompleto.png')
  })

  test('passo 5 — termos não aceitos', async ({ page, app }) => {
    await app.checkout.fillPersonalData(validCustomer)
    await app.checkout.setTermsAccepted(false)
    await app.checkout.confirmOrder()

    await expect(page.getByText('Aceite os termos', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/order$/)

    await saveEvidence(page, 'ct04-passo-05-termos-obrigatorios.png')
  })
})
