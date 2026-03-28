import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import type { OrderStatus } from '../types/orderLookup'

export async function expectStatusBadge(page: Page, status: OrderStatus) {
  const statusClasses = {
    APROVADO: {
      background: 'bg-green-100',
      text: 'text-green-700',
      icon: 'lucide-circle-check-big',
    },
    REPROVADO: {
      background: 'bg-red-100',
      text: 'text-red-700',
      icon: 'lucide-circle-x',
    },
    EM_ANALISE: {
      background: 'bg-amber-100',
      text: 'text-amber-700',
      icon: 'lucide-clock',
    },
  } as const

  const classes = statusClasses[status]
  const statusBadge = page.getByRole('status').filter({ hasText: status })

  await expect(statusBadge).toHaveClass(new RegExp(classes.background))
  await expect(statusBadge).toHaveClass(new RegExp(classes.text))
  await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(classes.icon))
}
