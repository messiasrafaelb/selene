# Selene — Monitoramento do Ciclo e Apoio à Mulher

> **Aviso de Protótipo Acadêmico (Obrigatório):** Este projeto é um protótipo estritamente acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas (Universidade Positivo — Campus Londrina, 2º Semestre de 2026). Nenhum indicador, estatística ou funcionalidade deste repositório substitui atendimento policial, jurídico, psicológico ou de saúde. Em situação real de violência contra a mulher: **Ligue 180** (Central de Atendimento à Mulher — gratuito, 24h) ou **190** (Polícia Militar — emergência).

---

## 1. Sobre o Projeto
O **Selene** é um aplicativo móvel camuflado como um calendário de monitoramento do ciclo menstrual feminino. Para qualquer observador externo, o aplicativo funciona como um rastreador completo de saúde menstrual (abertura/fechamento de ciclo, calendário mensal navegável, histórico paginado e registro diário de fluxo e humor).

Por trás de um **gatilho discreto** (pressionar e segurar por **5 segundos** o ícone da lua no cabeçalho da tela inicial e digitar o **PIN de segurança de 4 dígitos**), a usuária acessa uma área protegida de apoio com discagem rápida (`Linking.openURL("tel:...")`) para a **Central de Atendimento à Mulher (Ligue 180)**, **Polícia Militar (190)** e **Contatos de Segurança** pessoais, além de botão de saída rápida imediata para o modo de disfarce.

- **Integrante:** Messias Rafael Bernardes (`@messiasrafaelb`)
- **Disciplinas Integradas:** Desenvolvimento Móvel · Data Science
- **Professor Orientador:** Prof. Alex Junior Nunes

---

## 2. Estrutura do Repositório

```text
selene/
├── app/                                # Aplicativo Mobile (React Native + Expo SDK 54)
│   ├── App.js                          # Ponto de entrada e controle de sessão/disfarce
│   ├── src/
│   │   ├── data/mockData.js            # 3 entidades (USERS, CYCLE, CONTACT), enums e regras de negócio
│   │   ├── navigation/                 # React Navigation (RootNavigation, DisguiseTabs, Stacks)
│   │   └── screens/                    # Telas de Autenticação, Ciclo Menstrual e Área de Apoio
├── data-science/                       # Pipeline de Data Science (Entrega 1 + Entrega 2)
│   ├── notebook.ipynb                  # Notebook completo (Governança, 5 Dimensões, Tratamento, EDA e Plano)
│   └── dados/
│       ├── denuncias_ligue180.csv      # Base bruta preservada (1.540 registros × 14 colunas)
│       ├── dados_tratados.csv          # Base tratada e auditada (1.500 registros únicos × 20 colunas)
│       └── FONTE_DADOS.md              # Ficha de governança, ética, LGPD e dicionário de variáveis
├── api/                                # Estrutura reservada para o Backend (Entregas 3 e 4)
├── README.md                           # Visão geral do projeto, resumo da base e instruções de execução
└── USO_IA.md                           # Registro transparente do uso de ferramentas de IA
```

---

## 3. Data Science — Resumo da Base, Governança e Tratamento (Entrega 2)

### 3.1 Escolha e Justificativa da Base
- **Nome da Base:** Microdados Estruturados de Denúncias de Violência contra a Mulher — Central de Atendimento à Mulher (**Ligue 180 — ONDH/MDHC**)
- **Órgão Responsável:** Ouvidoria Nacional de Direitos Humanos (ONDH) / Ministério dos Direitos Humanos e da Cidadania (MDHC)
- **Links Oficiais da Fonte:**
  - Portal Brasileiro de Dados Abertos (Conjunto Ligue 180): [https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180](https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180)
  - Painel de Dados da ONDH / MDHC: [https://www.gov.br/mdh/pt-br/ondh/painel-de-dados](https://www.gov.br/mdh/pt-br/ondh/painel-de-dados)
  - Referência complementar — Atlas da Violência (IPEA / FBSP): [https://www.ipea.gov.br/atlasviolencia/](https://www.ipea.gov.br/atlasviolencia/)
- **Licença e LGPD:** Dados Abertos Governamentais (Decreto nº 8.777/2016 e Lei nº 12.527/2011), estritamente anonimizados na origem (Art. 12 da LGPD — Lei nº 13.709/2018), sem nomes, CPFs, telefones ou endereços identificáveis.
- **Limitações Reconhecidas:** Registros administrativos medem apenas a violência **notificada** (sujeita à subnotificação por medo, dependência financeira ou isolamento), e as associações observadas na Análise Exploratória (EDA) não implicam relação direta de causa e efeito.

### 3.2 Resumo do Diagnóstico e Decisões de Tratamento (`Antes × Depois`)
O notebook [`data-science/notebook.ipynb`](data-science/notebook.ipynb) executa o diagnóstico nas **5 dimensões de qualidade** (Completude, Validade, Consistência, Unicidade e Integridade/Acurácia) e aplica o pipeline ordenado de tratamento:

1. **Padronização textual e de datas (Consistência):** Unificação de grafias equivalentes (`municipio` reduzido de `37` para `6` municípios do PR; `tipo_violencia` de `12` para `5`; `vinculo_autor` de `19` para `8`) e conversão de 3 formatos de data (`%d/%m/%Y`, `%Y-%m-%d`, `%d-%m-%y`).
2. **Conversão de ausentes disfarçados e inválidos (Validade):** Transformação de `360` termos `"Ignorado"`/`"N/I"`/`"Não informado"` e `55` valores numéricos fora de faixa plausível (ex.: idades `-5` e `999`, rendas `-200` e `150000`) em `NaN`, além de `13` datas inexistentes (`31/02/2024`, `00/00/0000`) em `NaT`.
3. **Remoção de duplicatas (Unicidade):** Exclusão de `40` registros duplicados por `id_notificacao` (`22` cópias exatas e `18` com variação de grafia), passando de `1.540` para **`1.500` registros únicos**.
4. **Imputação fundamentada (Completude):** Preenchimento das variáveis numéricas assimétricas pela **mediana** (com criação de colunas-bandeira `<coluna>_imputado`), preenchimento das categóricas explicativas com `"Não informado"` e preservação da variável-alvo (`violencia_repetida`) **sem imputação** (`1.413` registros com alvo conhecido).
5. **Sinalização de outliers (IQR):** Identificação de valores extremos legítimos pela regra de $1,5 \times IQR$ sem exclusão de casos reais.

| Indicador | Base Bruta (`denuncias_ligue180.csv`) | Base Tratada (`dados_tratados.csv`) |
|---|---:|---:|
| Total de linhas | 1.540 | **1.500** |
| IDs repetidos (excedentes) | 40 | **0** |
| Valores `NaN` nas variáveis explicativas | 395 | **0** |
| Grafias distintas em `municipio` | 37 | **6** |
| Idade máxima registrada (anos) | 999,0 | **71,0** |
| Renda familiar máxima registrada (R$) | 150.000,00 | **16.122,06** |

---

## 4. Como Executar o Projeto

### 4.1 Aplicativo Mobile (`app/`)
```bash
cd app
npm install
npx expo start
```
- **Credenciais de demonstração:** `ana@email.com` · Senha: `123` · PIN do modo camuflado: `1234` (também é possível criar nova conta e redefinir senha validando E-mail + PIN).
- **Acesso à área camuflada:** Na tela inicial (*Meu Ciclo*), mantenha pressionado o ícone da lua no canto superior direito por **5 segundos** e informe o PIN de 4 dígitos.

### 4.2 Notebook de Data Science (`data-science/`)
Abra o arquivo [`data-science/notebook.ipynb`](data-science/notebook.ipynb) no VS Code, JupyterLab ou Google Colab. Todas as células já foram executadas do início ao fim (`Restart & Run All`) com tabelas e gráficos visíveis.
