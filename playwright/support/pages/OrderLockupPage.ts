import type { Page } from '@playwright/test'

import { expectOrderNotFound } from '../assertions/expectOrderNotFound'
import { expectOrderResultDetails } from '../assertions/expectOrderResultDetails'
import { expectStatusBadge } from '../assertions/expectStatusBadge'
import type { OrderDetails, OrderStatus } from '../types/orderLookup'

export class OrderLockupPage {

    constructor(private page: Page) { }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }

    async validateOrderDetails(order: OrderDetails) {
        await expectOrderResultDetails(this.page, order)
    }

    async validateStatusBadge(status: OrderStatus) {
        await expectStatusBadge(this.page, status)
    }

    async validateOrderNotFound() {
        await expectOrderNotFound(this.page)
    }

}
