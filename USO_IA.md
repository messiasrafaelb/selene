# Uso de Inteligência Artificial — Projeto Selene

Registro transparente do uso de ferramentas de Inteligência Artificial Generativa ao longo das **Entregas 1, 2, 3 e 4 (Entrega Final)** do Projeto Integrador, em conformidade com a **Seção 7 do Documento Orientador**.

## 1. Ferramentas Utilizadas
- **Gemini / Antigravity (Google DeepMind)**

---

## 2. Onde e Como Foram Usadas em Cada Etapa

| Etapa / Módulo do Projeto | Ferramenta | Como foi usada | Revisado e validado por |
| :--- | :--- | :--- | :--- |
| **Planejamento, Escopo e Disfarce (Entregas 1 e 2)** | Gemini | Brainstorming do conceito de disfarce (calendário menstrual com gatilho de toque longo de 5s + PIN de 4 dígitos) e estruturação da navegação em React Navigation | Messias Rafael Bernardes |
| **Governança, Diagnóstico nas 5 Dimensões e Tratamento (`data-science/notebook.ipynb` — Seções 1 a 4)** | Gemini | Apoio na escrita do código Python (`pandas`, `numpy`, `scipy.stats`) para padronização textual/datas, detecção de ausentes disfarçados, remoção de 40 duplicatas, imputação pela mediana com colunas-bandeira e sinalização de outliers via IQR | Messias Rafael Bernardes |
| **Análise Exploratória de Dados — EDA (`data-science/notebook.ipynb` — Seção 5)** | Gemini | Geração dos gráficos `matplotlib` (histogramas, boxplots, série temporal com média móvel de 6 meses e matriz de correlação de Spearman) e formatação das tabelas de frequência | Messias Rafael Bernardes |
| **Modelagem com Validação Cruzada e Avaliação Final (`data-science/notebook.ipynb` — Seções 6 a 9)** | Gemini | Estruturação do `Pipeline` e `ColumnTransformer` do `scikit-learn` (`SimpleImputer` + `RobustScaler` + `OneHotEncoder`) sem vazamento de dados, validação cruzada estratificada de 5 folds (`StratifiedKFold`) comparando Regressão Logística, Árvore de Decisão e Random Forest, cálculo das métricas no conjunto de teste (`Accuracy`, `Precision`, `Recall`, `F1`, `ROC-AUC`, Matriz de Confusão e Curva ROC) e conversão das probabilidades nas faixas de `riscoRepeticao` (`Baixo`, `Médio`, `Alto`) | Messias Rafael Bernardes |
| **Back-end RESTful em Layered Architecture (`api/src/` — Entregas 3 e 4)** | Gemini | Estruturação da API Node.js + Express em camadas (`routes`, `controllers`, `services`, `repositories`, `database`, `middlewares`, `errors`), autenticação **JWT (`jsonwebtoken`)** e hash de senha com **Bcrypt (`bcryptjs`)**, validação de chave estrangeira (`userId` validado contra `users.json`), *cascade delete* ao excluir usuária e endpoints `/painel/:userId` e `/avaliacao-risco` | Messias Rafael Bernardes |
| **Integração Mobile via API Real e Saída Rápida (`app/src/services/api.js` e `app/src/screens/` — Entregas 3 e 4)** | Gemini | Substituição completa do antigo `mockData.js` pelo cliente HTTP `src/services/api.js` (com envio automático do header `Authorization: Bearer <token>`), integração de Create, Read, Update (`PUT`) e Delete (`DELETE`) nas telas de Usuárias (incluindo exclusão de conta protegida por PIN), Ciclos e Contatos, atualização automática do painel via `setInterval`/`clearInterval`, exibição do selo `riscoRepeticao` com aviso acadêmico e botão de **Saída Rápida** com 1 toque | Messias Rafael Bernardes |

---

## 3. Principais Prompts Utilizados

### Entregas 1 e 2 (Qualidade de Dados, EDA e Estrutura Mobile)
1. *"Estruturar o diagnóstico de qualidade de dados nas 5 dimensões (completude, validade, consistência, unicidade e integridade/acurácia) para a base de notificações do Ligue 180, separando NaNs explícitos de ausentes disfarçados ('Ignorado', 'N/I') e valores fora dos limites plausíveis."*
2. *"Implementar o pipeline ordenado de limpeza em pandas (padronização textual -> conversão de inválidos e ignorados em NaN -> deduplicação por id_notificacao -> imputação numérica pela mediana sem vazamento de dados -> tabela antes × depois) salvando a base tratada em `data-science/dados/dados_tratados.csv`."*
3. *"Gerar as tabelas e gráficos de análise exploratória (medidas de tendência central, dispersão, assimetria e curtose; frequência absoluta, relativa e acumulada; série temporal mensal e correlação de Spearman com `violencia_repetida`) com títulos, rótulos nos eixos e leitura crítica."*

### Entregas 3 e 4 (API em Layered Architecture com JWT/Bcrypt, Integração CRUD Real e Modelo Validado)
4. *"Estruturar a API RESTful em Node.js e Express seguindo Layered Architecture (`routes`, `controllers`, `services`, `repositories`, `database`, `middlewares` e `errors`) com ES Modules, autenticação JWT (`Bearer Token`), hash de senha com Bcrypt, rotas CRUD completas para `/users`, `/cycles` e `/contacts` e validação real de relacionamento (`userId` verificado em `users.json`)."*
5. *"Remover o `mockData.js` do aplicativo React Native (`app/`) e integrar todas as telas à API real via `src/services/api.js` (Create, Read, Update com PUT e Delete com DELETE), incluindo modal de exclusão de conta protegido pelo PIN de 4 dígitos, exibição do indicador `riscoRepeticao` acompanhado do aviso acadêmico e Saída Rápida de 1 toque."*
6. *"Construir no `data-science/notebook.ipynb` as seções de Modelagem e Avaliação das Entregas 3 e 4 usando `Pipeline`, `ColumnTransformer` (`SimpleImputer(strategy='median')` + `RobustScaler` + `OneHotEncoder`) e `StratifiedKFold(n_splits=5)` para comparar Regressão Logística, Árvore de Decisão e Random Forest, avaliando o modelo vencedor no conjunto de teste com Acurácia, Precisão, Recall, F1-Score, ROC-AUC, Matriz de Confusão e Curva ROC."*

---

## 4. Declaração de Revisão e Autoria
Todo o código gerado ou sugerido com apoio de IA (tanto no pipeline Python/scikit-learn quanto na API Node.js/Express em camadas e nas telas React Native/Expo) foi revisado, questionado, ajustado e validado pelo aluno responsável (**Messias Rafael Bernardes — `@messiasrafaelb`**), garantindo conformidade integral com o Documento Orientador do Projeto Integrador.
