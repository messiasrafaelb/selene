# Selene — Monitoramento do Ciclo e Apoio à Mulher (Entrega Final — Entregas 1, 2, 3 e 4)

> **Aviso de Protótipo Acadêmico (Obrigatório — Seção 5.4):** Este projeto é um protótipo estritamente acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas (Universidade Positivo — Campus Londrina, 2º Semestre de 2026). Nenhum indicador, estimativa de risco (`riscoRepeticao`: `Baixo`, `Médio`, `Alto`), estatística ou funcionalidade deste repositório substitui atendimento policial, jurídico, psicológico ou de saúde. Em situação real de violência contra a mulher: **Ligue 180** (Central de Atendimento à Mulher — gratuito, 24h) ou **190** (Polícia Militar — emergência).

---

## 1. Sobre o Projeto
O **Selene** é um aplicativo móvel camuflado como um calendário de monitoramento do ciclo menstrual feminino. Para qualquer observador externo, o aplicativo funciona como um rastreador completo de saúde menstrual (abertura/fechamento de ciclo, calendário mensal navegável, histórico paginado e registro de fluxo e humor).

Por trás de um **gatilho discreto** (pressionar e segurar por **5 segundos** o botão flutuante da lua na tela inicial e digitar o **PIN de segurança de 4 dígitos**), a usuária acessa o módulo protegido de apoio e enfrentamento à violência contra a mulher, contando com:
- Discagem rápida (`Linking.openURL("tel:...")`) para a **Central de Atendimento à Mulher (Ligue 180)**, **Polícia Militar (190)** e **Contatos de Segurança** pessoais;
- **Indicador de Risco de Repetição (`Baixo`, `Médio`, `Alto`)** calculado pelo modelo de **Regressão Logística** validado em Data Science e integrado via API REST;
- **Saída Rápida (*Quick Exit*):** botão de retorno imediato com **1 toque** (sem tela de confirmação) no cabeçalho e no topo da tela protegida, voltando instantaneamente ao calendário menstrual disfarçado;
- **Exclusão Segura de Conta com PIN:** opção para a usuária apagar permanentemente sua conta e todos os seus registros (`DELETE /users/:id` com *cascade delete*) mediante confirmação do PIN de 4 dígitos.

- **Integrante:** Messias Rafael Bernardes (`@messiasrafaelb`)
- **Disciplinas Integradas:** Desenvolvimento Móvel · Data Science
- **Professor Orientador:** Prof. Alex Junior Nunes

---

## 2. Arquitetura Final do Repositório (Seção 6.4)

```text
selene/
├── api/                                # Back-end RESTful (Node.js + Express em Layered Architecture)
│   ├── package.json                    # ES Modules ("type": "module"), Express 5, CORS, JWT e Bcrypt
│   └── src/
│       ├── server.js                   # Inicialização do servidor HTTP (porta 3333)
│       ├── app.js                      # Configuração do Express, CORS, rotas e middlewares de erro
│       ├── config/authConfig.js        # Configuração de assinatura e expiração do token JWT
│       ├── errors/AppError.js          # Classe padronizada de erro HTTP (400, 401, 404)
│       ├── middlewares/                # authMiddleware (JWT Bearer) e errorHandler centralizado
│       ├── database/                   # jsonDatabase.js e coleções (users.json, cycles.json, contacts.json)
│       ├── repositories/               # Acesso a dados (userRepository, cycleRepository, contactRepository)
│       ├── services/                   # Regras de negócio, Bcrypt/JWT, FK userId e inferência de risco DS
│       ├── controllers/                # Camada HTTP (user, auth, cycle, contact, riskAssessment)
│       └── routes/                     # Rotas RESTful (/auth, /users, /cycles, /contacts, /painel, /avaliacao-risco)
├── app/                                # Aplicativo Mobile (React Native + Expo SDK 54)
│   ├── App.js                          # Controle de sessão autenticada e alternância do modo camuflado
│   └── src/
│       ├── services/api.js             # Cliente HTTP com injeção automática de JWT Bearer — sem mockData.js
│       ├── navigation/                 # React Navigation (RootNavigation, DisguiseTabs, CycleStack, EmergencyStack)
│       └── screens/                    # Telas integradas via API (Login, Register, ForgotPassword, Cycle, Emergency)
├── data-science/                       # Pipeline Completo de Data Science (Entregas 1, 2, 3 e 4)
│   ├── notebook.ipynb                  # Notebook executado com saídas e gráficos (Qualidade, EDA, CV 5-Folds, Teste e Integração)
│   ├── requirements.txt                # Dependências Python (numpy, pandas, matplotlib, scipy, scikit-learn)
│   └── dados/
│       ├── dados_brutos.csv            # Base bruta preservada (1.540 registros × 14 colunas)
│       ├── denuncias_ligue180.csv      # Cópia de referência da base bruta (1.540 registros)
│       ├── dados_tratados.csv          # Base tratada e higienizada (1.500 notificações únicas)
│       └── FONTE_DADOS.md              # Ficha de governança, ética, LGPD e dicionário de variáveis
├── README.md                           # Documentação geral, matriz de responsabilidades e guia de execução
└── USO_IA.md                           # Registro transparente das ferramentas e prompts de IA utilizados
```

---

## 3. Matriz de Responsabilidades

| Integrante | GitHub | CRUDs e Módulos de Mobile / Back-end (`api/` e `app/`) | Etapas do Pipeline de Data Science (`data-science/`) |
| :--- | :--- | :--- | :--- |
| **Messias Rafael Bernardes** | `@messiasrafaelb` | **API Node.js/Express em Layered Architecture (`api/src/`)** + **Autenticação JWT/Bcrypt**, **CRUD de Usuárias (`/users`)**, **CRUD de Ciclos Menstruais (`/cycles`)**, **CRUD de Contatos de Segurança (`/contacts`)**, **Disfarce (5s + PIN)** e **Saída Rápida (1 toque)** | **1.** Governança e Dicionário · **2.** Diagnóstico nas 5 Dimensões · **3.** Tratamento Ordenado · **4.** Análise Exploratória (EDA) · **5.** Modelagem com Validação Cruzada (5 Folds) · **6.** Avaliação no Teste e Integração (`riscoRepeticao`) |

---

## 4. Resumo do Back-end (API REST) e Integração Mobile

### 4.1 Rotas RESTful, Segurança (JWT + Bcrypt) e Relacionamentos (`http://localhost:3333`)
A API em [`api/src/`](file:///c:/Users/Rafael/Desktop/selene/api/src/app.js) segue **Arquitetura em Camadas (*Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories $\rightarrow$ Database*)** com suporte completo a `GET`, `GET /:id`, `POST`, `PUT /:id` e `DELETE /:id` e códigos HTTP adequados (`200`, `201`, `400`, `401`, `404`, `500`):

- **Autenticação (`/auth/login`, `/auth/register`, `/auth/reset-password`):** Senhas armazenadas com hash **Bcrypt** (`bcryptjs`), omissão do campo `password` em todas as respostas (`toPublicUser`) e emissão de token **JWT** (`jsonwebtoken`) validado pelo [`authMiddleware.js`](file:///c:/Users/Rafael/Desktop/selene/api/src/middlewares/authMiddleware.js) nas rotas protegidas.
- **`/users` (`database/data/users.json`):** Gerencia o perfil da usuária (`GET`, `POST`, `PUT`, `DELETE`). Ao excluir uma usuária (`DELETE /users/:id` mediante confirmação do PIN no app), realiza *cascade delete* removendo seus ciclos e contatos vinculados.
- **`/cycles` (`database/data/cycles.json`):** Gerencia os ciclos menstruais (`startDate`, `endDate`, `flow`, `mood`) e armazena o indicador do modelo de Data Science (`riscoRepeticao` e `probabilidadeRisco`). **Relacionamento real validado pela API:** rejeita com `400 Bad Request` qualquer `POST` ou `PUT` cujo `userId` não exista em `users.json`, além de impedir dois ciclos em aberto simultâneos e fechar automaticamente ciclos com mais de 7 dias.
- **`/contacts` (`database/data/contacts.json`):** Gerencia os contatos de segurança da rede de apoio (`name`, `relationship`, `phone`, `priority`). **Relacionamento real validado pela API:** rejeita com `400 Bad Request` qualquer `POST` ou `PUT` cujo `userId` não exista em `users.json`.
- **`/painel/:userId` e `/avaliacao-risco`:** Endpoints de monitoramento em tempo real (consumidos via `setInterval` a cada 15s com limpeza `clearInterval` em `EmergencyScreen.js`) e inferência dinâmica do indicador `riscoRepeticao` (`"Baixo"`, `"Médio"`, `"Alto"`).

---

## 5. Resumo do Pipeline Completo de Data Science (`data-science/notebook.ipynb`)

1. **Qualidade e Tratamento (Entregas 1 e 2):** A partir de `1.540` registros brutos inspirados no Ligue 180 (ONDH/MDHC), diagnosticamos as 5 dimensões de qualidade e tratamos `454` `NaN`s explícitos, `360` ausentes disfarçados, `68` valores/datas inválidos, `61` variações de grafia e `40` duplicatas, gerando `data-science/dados/dados_tratados.csv` com **`1.500` registros únicos**.
2. **Análise Exploratória (EDA):** Demonstrou que parceiros e ex-parceiros concentram **`64,7%`** das notificações, **`66,8%`** ocorrem na própria residência da vítima e os casos de violência repetida apresentam mediana de **`25,0` dias** até a denúncia (contra `10,0` dias nos casos únicos, correlação de Spearman $r_s = 0,48$).
3. **Modelagem com Validação Cruzada Estratificada (5 Folds) e Prevenção de *Data Leakage*:**
   - Divisão estratificada (`75%` treino = `1.059` registros / `25%` teste = `354` registros) executada **antes** da imputação numérica (`df_sem_imputacao_num`).
   - Dentro de `Pipeline` + `ColumnTransformer`: `SimpleImputer(strategy="median")` + `RobustScaler()` nas numéricas e `OneHotEncoder(handle_unknown="ignore")` nas categóricas.
   - Comparação em `5` folds (`StratifiedKFold`):
     - **Regressão Logística (modelo escolhido):** `Acurácia CV = 0,710` · `Precisão CV = 0,725` · `Recall CV = 0,700` · `F1 CV = 0,711 (±0,027)` · `ROC-AUC CV = 0,781`
     - **Random Forest:** `Acurácia CV = 0,697` · `F1 CV = 0,700 (±0,032)` · `ROC-AUC CV = 0,769`
     - **Árvore de Decisão:** `Acurácia CV = 0,657` · `F1 CV = 0,653 (±0,041)` · `ROC-AUC CV = 0,732`
4. **Avaliação Final no Conjunto de Teste (`354` registros inéditos):**
   - **Acurácia:** **`74,9%`** (superando em `23,9` pontos percentuais o baseline majoritário de `51,0%`)
   - **Precisão:** **`75,3%`** · **Recall (Sensibilidade):** **`75,7%`** · **F1-Score:** **`75,5%`** · **ROC-AUC:** **`0,805`**
   - **Matriz de Confusão:** `VP = 137`, `VN = 128`, `FP = 45`, `FN = 44`.
5. **Integração com a API e o App Mobile:**
   - Probabilidade convertida nas faixas `riscoRepeticao`: `"Baixo"` ($< 0,35$), `"Médio"` ($0,35\text{ a }0,65$) e `"Alto"` ($\ge 0,65$), gravada em `api/src/database/data/cycles.json` (`0,10` $\rightarrow$ `"Baixo"`, `0,49` $\rightarrow$ `"Médio"`, `0,85` $\rightarrow$ `"Alto"`) e exibida com selo colorido e aviso acadêmico em `CycleHistoryScreen.js` e `EmergencyScreen.js`.

---

## 6. Como Executar o Projeto de Ponta a Ponta

### Passo 1 — Subir a API Node.js (`http://localhost:3333`)
```bash
cd api
npm install
npm start
```

### Passo 2 — Rodar o Aplicativo Mobile Expo (`app/`)
Em um segundo terminal:
```bash
cd app
npm install
npx expo start
```
- **Credenciais padrão de demonstração (já preenchidas na tela de Login):**
  - **E-mail:** `selena@gmail.com` · **Senha:** `123456` · **PIN do modo protegido:** `1800`
- **Como testar o Disfarce, a Exclusão Segura de Conta e a Saída Rápida:**
  1. Na tela inicial (*Hoje*), toque em **`Olá, Selena ⚙️`** para abrir o modal **Minha Conta** (onde é possível editar o nome via `PUT /users/:id` ou apagar a conta via `DELETE /users/:id` confirmando o PIN `1800`);
  2. Mantenha pressionado o **botão circular com ícone da lua** (canto inferior direito) por **5 segundos**, digite o PIN **`1800`** e toque em **Confirmar** para abrir a tela **Apoio e Emergência**;
  3. Para voltar imediatamente ao disfarce sem confirmação, toque em **Saída Rápida** no topo da tela ou no cabeçalho.

### Passo 3 — Visualizar ou Reexecutar o Notebook de Data Science (`data-science/`)
O arquivo [`data-science/notebook.ipynb`](file:///c:/Users/Rafael/Desktop/selene/data-science/notebook.ipynb) já está salvo **completamente executado** com todas as tabelas, métricas e gráficos visíveis. Para reexecutá-lo:
```bash
cd data-science
pip install -r requirements.txt
jupyter notebook notebook.ipynb
```
