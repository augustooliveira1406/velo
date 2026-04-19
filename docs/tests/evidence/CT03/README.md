# Evidências — CT03 (Opcionais + checkout)

Conforme `docs/tests/test_cases.md` — **CT03 - Configuração do Veículo (Adição de Opcionais) e Cálculo de Preço**.

Execução: `npx playwright test playwright/e2e/ct03-optionals-checkout.spec.ts` com app em `http://localhost:5173`.

| Arquivo | Passo do caso |
| --- | --- |
| `ct03-passo-01-precision-park.png` | Opcional Precision Park (+R$ 5.500) |
| `ct03-passo-02-flux-capacitor.png` | Precision Park + Flux Capacitor |
| `ct03-passo-03-sem-opcionais.png` | Desmarcar opcionais — volta a R$ 40.000,00 |
| `ct03-passo-04-checkout-resumo.png` | “Monte o Seu” → `/order` com resumo coerente |

**Feature Actions:** `playwright/support/actions/configuratorActions.ts` e `checkoutActions.ts`.
