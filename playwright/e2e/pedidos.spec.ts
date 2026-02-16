import { test, expect } from '@playwright/test';

import { generateOrderNumber } from '../support/helpers';

/// AAA - Arrange, Act, Assert
test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({page}) => {
    // Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    })
  
  test('deve consultar o pedido aprovado', async ({ page }) => {

    //Test Data
    const order = {
      number: 'VLO-F2MBJ9',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'LUIZA CANO',
        email: 'luizacano@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
  //   await page.getByTestId('search-order-id').fill(orderNumber);
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);  
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
    // Assert
    //await page.waitForTimeout(10000);   // nao utilizar, utilizar  TIMEOUT EXPLICITO
  
    //await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000});
    //await expect(page.getByTestId('order-result-id')).toContainText(orderNumber);  
    await expect(page.getByText('Pedido', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(order.number)).toBeVisible();
  
    //await expect(page.getByTestId('order-result-status')).toBeVisible();
    //await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');  
    await expect(page.getByText('APROVADO')).toBeVisible();
  
    //  outra abordagem via xpath
  //   const orderCode = page.locator('//p[text()="Pedido"]/../p[text()=orderNumber]');
  //   await expect(orderCode).toBeVisible({timeout: 10_000});
  
  //   const containerPedido = page.getByRole('paragraph')
  //     .filter({hasText: 'Pedido'})
  //     .filter({hastText: /ˆPedido$/ })    // Expressao regular utilizada para garantir assertividade
  //     .locator('..');  //sobe para o elemeno pai (a DIV principal)
  
  //   await expect(containerPedido).toContainText(orderNumber);
  
  //   await expect(page.getByText('APROVADO')).toBeVisible();
   
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-green-100/)
    await expect(statusBadge).toHaveClass(/text-green-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)

  
  });

  test('deve consultar o pedido Reprovado', async ({ page }) => {

    //Test Data
      const order = {
      number: 'VLO-8S5UVF',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'John Sample',
        email: 'johnsample@gmail.com'
      },
      payment: 'À Vista'
    }
    
    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);  
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
    // Assert
    await expect(page.getByText('Pedido', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(order.number)).toBeVisible();
  
    await expect(page.getByText('REPROVADO')).toBeVisible();
  
  
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph:  ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph:  ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-red-100/)
    await expect(statusBadge).toHaveClass(/text-red-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-x/)

  });

  test('deve consultar o pedido Em Analise', async ({ page }) => {

    //Test Data
      const order = {
      number: 'VLO-22YDBE',
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Zaya Blue Shad',
        email: 'zayabull@gmail.com'
      },
      payment: 'À Vista'
    }
    
    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);  
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
    // Assert
    await expect(page.getByText('Pedido', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(order.number)).toBeVisible();
  
    await expect(page.getByText(order.status)).toBeVisible();
  
  
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph:  ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph:  ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-amber-100/)
    await expect(statusBadge).toHaveClass(/text-amber-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-clock/)
  
  });

  test('deve exibir a mensagem de erro quando o pedido nao for encontrado', async ({ page }) => {
  
    //Test Data
    const orderNumber = generateOrderNumber();

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);  
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
    // Assert
    const titleMessage = page.getByRole('heading', { name: 'Pedido não encontrado' });
    await expect(titleMessage).toBeVisible();
  
    const errorMessage = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' });
    await expect(errorMessage).toBeVisible();
  
    //Outra abordagem via Snapshot
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  
  });

});