# Evidências — CT03 (Checkout)

Execução automatizada: `npx playwright test playwright/e2e/checkout-ct03.spec.ts` com `baseURL` em `http://localhost:5173` e app em modo desenvolvimento.

| Arquivo | Caso coberto |
| --- | --- |
| `ct03-passo-01-campos-obrigatorios.png` | Envio em branco bloqueado com mensagens de obrigatoriedade |
| `ct03-passo-02-email-invalido.png` | Email `email_invalido` rejeitado com “Email inválido” |
| `ct03-passo-03-telefone-incompleto.png` | Telefone vazio após limpar máscara — “Telefone inválido” |
| `ct03-passo-04-termos-obrigatorios.png` | Envio sem aceite dos termos — “Aceite os termos” |

As interações reutilizam **Feature Actions** em `playwright/support/actions/checkoutActions.ts`.
