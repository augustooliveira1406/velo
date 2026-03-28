import { Page, expect } from '@playwright/test'

import { expectOrderNotFound } from '../assertions/expectOrderNotFound'
import { expectOrderResultDetails } from '../assertions/expectOrderResultDetails'
import { expectStatusBadge } from '../assertions/expectStatusBadge'
import type { OrderDetails, OrderStatus } from '../types/orderLookup'

export type { OrderDetails, OrderStatus }

export function createOrderLookupActions(page: Page) {

  const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' })
  const searchButton = page.getByRole('button', { name: 'Buscar Pedido' })

  return {

    elements: {
      orderInput,
      searchButton
    },

    async open() {
      await page.goto('/')
      const title = page.getByTestId('hero-section').getByRole('heading')
      await expect(title).toContainText('Velô Sprint')

      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
    },

    async searchOrder(code: string) {
      await orderInput.fill(code)
      await searchButton.click()
    },

    async validateOrderDetails(order: OrderDetails) {
      await expectOrderResultDetails(page, order)
    },

    async validateStatusBadge(status: OrderStatus) {
      await expectStatusBadge(page, status)
    },

    async validateOrderNotFound() {
      await expectOrderNotFound(page)
    },
  }
}
