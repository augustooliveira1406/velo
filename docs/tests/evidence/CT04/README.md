# Evidências — CT04 (Validação no checkout)

Conforme `docs/tests/test_cases.md` — **CT04 - Checkout - Validação de Campos Obrigatórios e Dados Inválidos**.

Execução: `npx playwright test playwright/e2e/checkout-ct04.spec.ts` com app em `http://localhost:5173`.

| Arquivo | Passo do caso |
| --- | --- |
| `ct04-passo-01-formulario-em-branco.png` | Campos vazios + Confirmar |
| `ct04-passo-02-nome-sobrenome-curtos.png` | Nome/sobrenome com 1 caractere |
| `ct04-passo-03-email-invalido.png` | E-mail `cliente@.com` |
| `ct04-passo-04-cpf-incompleto.png` | CPF limpo após preenchimento válido |
| `ct04-passo-05-termos-obrigatorios.png` | Dados válidos sem aceite dos termos |

**Feature Actions:** `playwright/support/actions/checkoutActions.ts`.
