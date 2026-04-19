import { test } from '../support/fixtures'

/// AAA - Arrange, Act, Assert

test.describe('Configuração de Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('valida a troca de cor do veículo', async ({ app }) => {
    await app.configurator.expectExteriorImageAlt(
      'Velô Sprint - glacier-blue with aero wheels',
    )

    await app.configurator.selectExteriorColorByTestId('midnight-black')

    await app.configurator.expectExteriorImageAlt(
      'Velô Sprint - midnight-black with aero wheels',
    )
  })

  test('valida a troca de rodas e opcionais do veículo', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.selectWheelsByName(/Sport Wheels/i)
    await app.configurator.expectTotalPrice('R$ 42.000,00')

    await app.configurator.toggleOptionalByName(/Precision Park/i)
    await app.configurator.expectTotalPrice('R$ 47.500,00')

    await app.configurator.toggleOptionalByName(/Flux Capacitor/i)
    await app.configurator.expectTotalPrice('R$ 52.500,00')
  })
})
