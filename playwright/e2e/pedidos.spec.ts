import { test, expect } from '@playwright/test';

test('deve consultar o pedido aprovado', async ({ page }) => {

  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
  // Act
//   await page.getByTestId('search-order-id').fill('VLO-F2MBJ9');
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-F2MBJ9');  
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  //await page.waitForTimeout(10000);   // nao utilizar, utilizar  TIMEOUT EXPLICITO

  //await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10_000});
  //await expect(page.getByTestId('order-result-id')).toContainText('VLO-F2MBJ9');  
  await expect(page.getByText('Pedido', { exact: true })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('VLO-F2MBJ9')).toBeVisible();

  //await expect(page.getByTestId('order-result-status')).toBeVisible();
  //await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');  
  await expect(page.getByText('APROVADO')).toBeVisible();




});