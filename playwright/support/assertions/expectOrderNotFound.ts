import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function expectOrderNotFound(page: Page) {
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
}
