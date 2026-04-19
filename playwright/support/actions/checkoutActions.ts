import { Page, expect } from '@playwright/test'

const CONFIGURATOR_STORAGE_KEY = 'velo-configurator-storage'

export type CheckoutPersonalData = {
  name: string
  surname: string
  email: string
  phone: string
  cpf: string
  storeLabel: string
}

export function createCheckoutActions(page: Page) {
  const submitButton = page.getByRole('button', { name: 'Confirmar Pedido' })

  return {
    elements: {
      submitButton,
    },

    async openLanding() {
      await page.goto('/')
      await expect(page).toHaveTitle(/Velô/)
      await expect(page.getByTestId('cta-section')).toBeVisible()
    },

    async startConfiguratorFromLanding() {
      await page.getByTestId('cta-button').click()
      await expect(page).toHaveURL(/\/configure$/)
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },

    async openConfiguratorFresh() {
      await page.addInitScript((key: string) => {
        localStorage.removeItem(key)
      }, CONFIGURATOR_STORAGE_KEY)
      await page.goto('/configure')
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },

    async openCheckoutFromConfigurator() {
      await page.getByTestId('checkout-button').click()
      await expect(page).toHaveURL(/\/order$/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async fillPersonalData(data: Partial<CheckoutPersonalData>) {
      if (data.name !== undefined) {
        await page.getByLabel('Nome', { exact: true }).fill(data.name)
      }
      if (data.surname !== undefined) {
        await page.getByLabel('Sobrenome', { exact: true }).fill(data.surname)
      }
      if (data.email !== undefined) {
        await page.getByLabel('Email', { exact: true }).fill(data.email)
      }
      if (data.phone !== undefined) {
        await page.getByLabel('Telefone', { exact: true }).fill(data.phone)
      }
      if (data.cpf !== undefined) {
        await page.getByLabel('CPF', { exact: true }).fill(data.cpf)
      }
      if (data.storeLabel !== undefined) {
        await page.getByTestId('checkout-store').click()
        await page.getByRole('option', { name: data.storeLabel }).click()
      }
    },

    async setTermsAccepted(accepted: boolean) {
      const terms = page.getByTestId('checkout-terms')
      if (accepted) {
        await terms.check()
      } else {
        await terms.uncheck()
      }
    },

    async clearPhoneField() {
      const input = page.getByTestId('checkout-phone')
      await input.click()
      await input.press('ControlOrMeta+a')
      await input.press('Backspace')
    },

    async clearCpfField() {
      const input = page.getByTestId('checkout-cpf')
      await input.click()
      await input.press('ControlOrMeta+a')
      await input.press('Backspace')
    },

    async expectSummaryTotalPrice(expected: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(expected)
    },

    async confirmOrder() {
      await submitButton.click()
    },
  }
}
