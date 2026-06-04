## Resumo

Este PR separa os ambientes de banco e de build entre **Preview** e **Produção**, alinha os testes E2E ao ambiente de Preview e ajusta o deploy de Produção para gerar um **novo build** com as variáveis corretas — em vez de promover um deployment de Preview.

---

## Segundo projeto Supabase (Preview)

Foi criado um **segundo projeto Supabase dedicado ao ambiente Preview**, isolado do projeto de **Produção**.

| Ambiente   | Projeto Supabase | Uso principal                                      |
|-----------|------------------|----------------------------------------------------|
| Preview   | Projeto Preview  | Deploys de preview na Vercel, pipeline CI, testes E2E |
| Produção  | Projeto Produção | Tráfego real após aprovação dos testes e deploy prod |

Isso evita que testes automatizados (insert/delete de pedidos, checkout, etc.) alterem ou dependam de dados do ambiente de Produção.

---

## Testes E2E contra o banco Preview

Os testes Playwright na pipeline:

1. Fazem **build e deploy Preview** na Vercel com `VITE_SUPABASE_*` do projeto **Preview**.
2. Executam contra a **URL do deployment Preview** (`BASE_URL`).
3. Preparam dados no **mesmo Supabase Preview** via API (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`), garantindo que o que o teste insere é o que a aplicação em Preview consulta.

Fluxo no `cd.yml`:

`unit-tests` → `build-and-deploy-preview` → `e2e-tests` → `deploy-production`

Somente após os E2E passarem é disparado o deploy de Produção.

---

## Produção: novo build com variáveis de Produção

O job **Build & Deploy Production** não reutiliza o artefato do Preview. Ele:

1. Executa `vercel pull` com `--environment=production`.
2. Roda `vercel build --prod` com secrets **`PROD_SUPABASE_*`** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
3. Publica com `vercel deploy --prebuilt --prod`.

Assim, o bundle em Produção aponta explicitamente para o **projeto Supabase de Produção**.

---

## Por que não usar `vercel promote`?

O fluxo anterior (ou a ideia de **promover** um deployment de Preview para Produção) foi substituído por um **build de produção dedicado** porque:

- Variáveis `VITE_*` são **embutidas no bundle no momento do build** (Vite substitui `import.meta.env` em tempo de compilação).
- **Promover** um deployment apenas troca qual URL/serve qual artefato já gerado; **não recompila** o frontend.
- Um preview buildado com `PREVIEW_SUPABASE_*` continuaria, após promote, apontando para o Supabase de Preview — incorreto para Produção.

**Conclusão:** Preview e Produção precisam de **dois builds distintos**, cada um com seu conjunto de `VITE_SUPABASE_*` no step de build.

---

## Secrets necessários no GitHub (Actions)

### Preview (build + E2E)

| Secret | Uso |
|--------|-----|
| `PREVIEW_SUPABASE_URL` | Build Vite + seed E2E |
| `PREVIEW_SUPABASE_PROJECT_ID` | Build Vite |
| `PREVIEW_SUPABASE_PUBLISHABLE_KEY` | Build Vite (client) |
| `PREVIEW_SUPABASE_SERVICE_ROLE_KEY` | Apenas CI/E2E (insert/delete; **não** vai para o bundle) |

### Produção (build prod)

| Secret | Uso |
|--------|-----|
| `PROD_SUPABASE_URL` | Build Vite produção |
| `PROD_SUPABASE_PROJECT_ID` | Build Vite produção |
| `PROD_SUPABASE_PUBLISHABLE_KEY` | Build Vite produção |

---

## Test plan

- [ ] Push em `main` dispara a pipeline completa.
- [ ] Preview deploya com projeto Supabase Preview.
- [ ] E2E passam contra URL Preview e banco Preview.
- [ ] Produção deploya somente após E2E verdes, com bundle usando `PROD_SUPABASE_*`.
- [ ] App em produção consulta pedidos/dados no Supabase de Produção (smoke manual opcional).
