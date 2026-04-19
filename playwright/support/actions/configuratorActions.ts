import { Page, expect } from '@playwright/test'

const CONFIGURATOR_STORAGE_KEY = 'velo-configurator-storage'

export function createConfiguratorActions(page: Page) {
  const carExteriorImage = page.getByTestId('car-exterior-image')
  const totalPrice = page.getByTestId('total-price')

  return {
    elements: {
      carExteriorImage,
      totalPrice,
    },

    async open() {
      await page.addInitScript((key: string) => {
        localStorage.removeItem(key)
      }, CONFIGURATOR_STORAGE_KEY)

      await page.goto('/configure')

      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
      await expect(totalPrice).toBeVisible()
    },

    async selectExteriorColorByTestId(suffix: string) {
      await page.getByTestId(`color-option-${suffix}`).click()
    },

    async selectWheelsByName(name: string | RegExp) {
      await page.getByRole('button', { name }).click()
    },

    async toggleOptionalByName(name: string | RegExp) {
      await page.getByRole('checkbox', { name }).click()
    },

    async expectExteriorImageAlt(expected: string) {
      await expect(carExteriorImage).toHaveAttribute('alt', expected)
    },

    async expectTotalPrice(text: string) {
      await expect(totalPrice).toHaveText(text)
    },
  }
}
