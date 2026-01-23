import { test, expect } from '@playwright/test';

test('deve consultar o pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  //Checkpoint 1: Acessar a página princiipal
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
  //Checkpoint 2: Acessar a página de consulta de pedidos
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  //Checkpoint 3: Preencher o campo de número do pedido
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByTestId('search-order-id').fill('VLO-F2MBJ9');

  await page.getByTestId('search-order-button').click();
  //Checkpoint 4: Verificar se o pedido foi encontrado
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-F2MBJ9');

  //Checkpoint 5: Verificar se o status do pedido é APROVADO
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');








});