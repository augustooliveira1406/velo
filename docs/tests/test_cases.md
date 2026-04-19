# Documento de Casos de Teste - Velô Sprint

**Sistema:** Velô Sprint - Configurador de Veículo Elétrico
**Perfil de Usuário:** Cliente (Usuário Comum)

---

### CT01 - Acesso e Navegação na Landing Page

#### Objetivo
Validar se a Landing Page é carregada corretamente e possibilita iniciar a configuração do veículo.

#### Pré-Condições
- O sistema deve estar no ar e acessível pelo navegador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL base do sistema | A página inicial da Velô Sprint deve carregar as informações do veículo e o botão de "Configurar" ou similar. |
| 2  | Clicar no botão de iniciar configuração | O usuário deve ser redirecionado para a página do Configurador de Veículo. |

#### Resultados Esperados
- O usuário encontra informações sobre o carro e consegue acessar o configurador sem erros visuais ou de carregamento.

#### Critérios de Aceitação
- A Landing Page deve ser exibida corretamente.
- O redirecionamento para a tela de configuração deve ser imediato ao clicar no botão correspondente.

---

### CT02 - Cálculo Dinâmico de Preço - Configuração Base e Opcionais

#### Objetivo
Validar se o cálculo de preço obedece à regra de negócio (base de R$ 40.000) e soma corretamente os custos dos adicionais.

#### Pré-Condições
- Estar na página do Configurador de Veículo.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Verificar o valor inicial na tela | O valor exibido deve ser de R$ 40.000 (preço base). |
| 2  | Selecionar rodas tipo "Sport" | O valor total deve ser atualizado para R$ 42.000 (+R$ 2.000). |
| 3  | Adicionar o opcional "Precision Park" | O valor total deve ser atualizado para R$ 47.500 (+R$ 5.500 no valor anterior). |
| 4  | Adicionar o opcional "Flux Capacitor" | O valor total deve ser atualizado para R$ 52.500 (+R$ 5.000 no valor anterior). |

#### Resultados Esperados
- O valor é atualizado em tempo real no resumo de acordo com as seleções feitas.

#### Critérios de Aceitação
- O valor base do veículo deve começar em R$ 40.000.
- A soma dos itens e de seus custos (R$2.000, R$5.500, R$5.000) deve estar correta independente da ordem de seleção.

---

### CT03 - Validação de Campos Obrigatórios e Dados Inválidos no Checkout

#### Objetivo
Garantir que não seja possível submeter um pedido com informações requeridas faltando ou em formato incorreto.

#### Pré-Condições
- Acessar a página de Checkout após finalizar a configuração.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Ignorar os campos do formulário e clicar em "Confirmar Pedido" | O sistema deve bloquear a submissão e exibir mensagens de erro informando que campos são obrigatórios. |
| 2  | Preencher o campo de Email com "email_invalido" | O sistema deve exibir mensagem de "Email inválido". |
| 3  | Preencher o campo Telefone ou CPF com formato incompleto (ex: 123) | O sistema deve apontar erro de formato incorreto. |
| 4  | Não marcar a caixa de seleção para aceitar os Termos de Uso | O sistema deve bloquear a submissão informando a obrigatoriedade do aceite. |

#### Resultados Esperados
- Formulário não é submetido, com mensagens de validação claras em cada campo que contenha erro ou omissão.

#### Critérios de Aceitação
- Campos nome, sobrenome, email, telefone, cpf, loja e aceite de termos são obrigatórios.
- Formatos de e-mail e tamanhos mínimos de CPF/Telefone devem ser checados.

---

### CT04 - Processode Checkout à Vista (Fluxo Feliz)

#### Objetivo
Garantir o sucesso de um pedido onde a modalidade escolhida for pagamento à vista e todos os dados estiverem válidos.

#### Pré-Condições
- Estar na página de Checkout com um layout de carro já selecionado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher corretamente Nome, Sobrenome, Email, Telefone, CPF e Loja de retirada | Nenhum erro será exibido sob os campos. |
| 2  | Selecionar a forma de pagamento "À Vista" | A interface não deve requisitar dados de financiamento (como valor de entrada). |
| 3  | Aceitar os Termos e clicar em "Confirmar Pedido" | O pedido deve ser gerado sem análise de crédito, com status "APROVADO". |
| 4  | Aguardar a finalização | Ser redirecionado para a página de Confirmação (Success). |

#### Resultados Esperados
- Pedido criado com sucesso no banco de dados e usuário direcionado para tela de Confirmação.

#### Critérios de Aceitação
- O valor final exibido deve corresponder ao valor do veículo sem juros.
- Um número de pedido (`order_number`) é gerado no final.

---

### CT05 - Análise de Crédito Automática - Score Alto (Aprovado)

#### Objetivo
Validar pedido com financiamento em que o CPF retorne score > 700 e que as parcelas e juros componham os valores finais indicados.

#### Pré-Condições
- Estar na página de Checkout com um valor total simulado, como R$ 40.000.
- Ter saldo de financiamento configurado (ex: Entrada 0).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher dados do formulário com um CPF válido que gere Score > 700 na API | Sem erros de preenchimento. |
| 2  | Escolher "Financiamento" como forma de pagamento | Interface exibe campo de entrada e simula 12 parcelas com 2% de juros sobre o saldo devedor. |
| 3  | Confirmar pedido | O sistema dispara a requisição de análise. Como Score > 700, pedido deve ser finalizado como "APROVADO". |
| 4  | Aguardar | Redirecionamento para a tela de Sucesso. |

#### Resultados Esperados
- Pedido com a categoria de financiamento completada com status definitivo.

#### Critérios de Aceitação
- Regra de juros compostos calculada na interface, com parcelas fixadas em 12x de 2%.
- Pedidos com Score > 700 recebem aprovação automática.

---

### CT06 - Análise de Crédito Automática - Score Médio (Em Análise)

#### Objetivo
Validar que a API, ao retornar um Score entre 501 e 700, aplica o status correto ao pedido.

#### Pré-Condições
- Uso de CPF de testes que retorne score médio (ex: 600).
- Dados do formulário corretamente preenchidos, com forma de pagamento "Financiamento".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Submeter formulário preenchido com dados para financiamento de CPF (Score 600) | Sistema chama análise de crédito e finaliza a criação do pedido. |
| 2  | Verificar página de sucesso e banco | O pedido deve constar com status de "EM_ANALISE", gerando informações visuais para o cliente sobre a verificação manual pendente. |

#### Resultados Esperados
- A compra deve progredir, mas indicando que o crédito passa por avaliação da equipe.

#### Critérios de Aceitação
- Pedidos com score de 501 a 700 não são rejeitados de imediato, mas caem em "Em Análise".

---

### CT07 - Análise de Crédito Automática - Score Baixo (Reprovado)

#### Objetivo
Validar operação negada quando o crédito não atende o limite de risco (Score <= 500).

#### Pré-Condições
- Uso de CPF de testes que retorne score baixo (ex: 400).
- Dados de financiamento configurados.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Submeter formulário de financiamento com CPF atrelado a Score baixo | Sistema bate na API e processa a negação do crédito. |
| 2  | Observar o fluxo posterior | O pedido deve ser gerado no banco com status "REPROVADO". A interface de Confirmação deve refletir esta informação frustrada ao usuário, ou uma notificação explicativa. |

#### Resultados Esperados
- Aplicação das diretrizes da política limitante de crédito de alto risco.

#### Critérios de Aceitação
- Pedidos com score até 500 são rejeitados.

---

### CT08 - Exceção de Análise de Crédito - Entrada maior ou igual a 50%

#### Objetivo
Validar a regra que força a aprovação de uma compra financiada, ignorando o Score, quando o valor da entrada é igual ou superior a 50%.

#### Pré-Condições
- O veículo configurado deve valer R$ 40.000.
- Estar na página de Checkout na modalidade "Financiamento".
- O CPF usado na compra deve ter score apontado para reprovação (<= 500).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Informar o valor de entrada de R$ 20.000 | A interface recalcula os montantes da parcela (reduzindo os juros gerados). |
| 2  | Confirmar o preenchimento dos dados com o CPF de baixo Score e submeter | O sistema aplica a exceção e ignora a validação base de crédito. |
| 3  | Verificar resultado | Apesar do Score ruim, o sistema aprova a compra devido à alta garantia inicial (entrada). O Pedido deve ser registrado como "APROVADO". |

#### Resultados Esperados
- Ignorar falhas de crédito quando os aportes garantem o risco do negócio.

#### Critérios de Aceitação
- Se a entrada for de pelo menos 50% do total, a aprovação é automática em 100% dos casos.

---

### CT09 - Verificação das Informações na Tela de Confirmação (Success)

#### Objetivo
Garantir que a Confirmação de pedido exiba as informações recapítuladas da transação e, crucialmente, forneça o Número do Pedido.

#### Pré-Condições
- Ter completado com êxito um fluxo de compra (à vista ou aprovado/análise).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Ingressar na tela de Success logo após a submissão de `Order` | A tela deve mostrar a mensagem de sucesso e os detalhes do carro. |
| 2  | Analisar o Número do Pedido (`order_number`) | O número deve estar visível e em destaque para que o cliente consiga anotar. |
| 3  | Verificar as informações financeiras da tela | Preço total, pagamento escolhido e parcelas (se financiadas) devem equivaler ao que o cliente solicitou. |

#### Resultados Esperados
- Visualização completa da confirmação como um recibo provisório do sucesso operacional.

#### Critérios de Aceitação
- A tela de Sucesso é inacessível organicamente se não precedida da criação de pedido.
- O campo `order_number` é exposto para os próximos fluxos de navegação.

---

### CT10 - Consulta de Pedido - Fluxo Feliz (Dados Válidos e Permissão Resolvida)

#### Objetivo
Confirmar que o cliente pode consultar o andamento do seu próprio pedido utilizando sua credencial atrelada.

#### Pré-Condições
- Existência de um pedido recente na base de dados com CPF e número de pedido atrelados.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a página/funcionalidade de "Consulta de Pedidos" | A página carrega e exibe o formulário de busca de pedido. |
| 2  | Fornecer o CPF do titular da compra e o número do pedido (`order_number`) gerado | Campos devem aceitar entrada alfanumérica conforme o formato do número. |
| 3  | Clicar em "Consultar" | O sistema deve validar no banco de dados, confirmar a paridade e trazer os detalhes contendo: cor, opicionais, modelo, loja escolhida e status do pedido. |

#### Resultados Esperados
- Retorno conclusivo dos dados da própria compra protegidos sob os fatores de verificação solicitados.

#### Critérios de Aceitação
- A validação precisa do número do pedido como proteção (`order_number`), funcionando como a senha do pacote de dados daquela transação para o cliente.

---

### CT11 - Consulta de Pedido - Tentativa Ilegal ou Dados Incorretos

#### Objetivo
Assegurar a privacidade de informações negando o acesso à Consulta quando as credenciais não corresponderem a um par real.

#### Pré-Condições
- Possuir uma página de Consulta de Pedidos utilizável e não logada.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir um número de CPF válido, mas atrelado ao `order_number` errado ou de terceiros | O sistema busca na base de dados e não faz cruzamento. |
| 2  | Clicar em "Consultar" | A aplicação deve exibir uma mensagem indicando "Pedido não encontrado" ou "Dados incorretos", sem sinalizar de quem seria aquele pedido. |

#### Resultados Esperados
- O sistema intercepta e impede exposição indevida do banco de dados, protegendo a segurança das solicitações do cliente.

#### Critérios de Aceitação
- Nível de segurança garantido onde consulta impõe posse de `order_number` autêntico ao CPF demandado.
