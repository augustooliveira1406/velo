import { test, expect } from '../support/fixtures'

import { generateOrderCode } from '../support/helpers'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const order = {
      number: 'VLO-F2MBJ9',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'LUIZA CANO',
        email: 'luizacano@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
    await app.orderLookup.searchOrder(order.number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order = {
      number: 'VLO-8S5UVF',
      status: 'REPROVADO' as const,
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'John Sample',
        email: 'johnsample@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
    await app.orderLookup.searchOrder(order.number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const order = {
      number: 'VLO-22YDBE',
      status: 'EM_ANALISE' as const,
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Zaya Blue Shad',
        email: 'zayabull@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
    await app.orderLookup.searchOrder(order.number)

    // Assert
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)

    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código está fora do padrão', async ({ app }) => {
    await app.orderLookup.searchOrder('PEDIDO-123')

    await app.orderLookup.validateOrderNotFound()
  })
  test('deve manter o botão de buscar pedido desabilitado quando o campo vazio ou apenas espaços', async ({ app, page}) => {
    
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(button).toBeDisabled()
  })
})
