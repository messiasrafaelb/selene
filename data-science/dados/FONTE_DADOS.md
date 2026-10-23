# Governança, Ética e Fonte dos Dados — Projeto Selene

## 1. Escolha e Justificativa da Base (Entrega 1 + Entrega 2)
- **Nome da Base:** Microdados Estruturados de Denúncias de Violência contra a Mulher — Central de Atendimento à Mulher (Ligue 180 / ONDH)
- **Órgão Responsável:** Ouvidoria Nacional de Direitos Humanos (ONDH) — Ministério dos Direitos Humanos e da Cidadania (MDHC)
- **Links Oficiais da Fonte:**
  - Portal Brasileiro de Dados Abertos (Conjunto Ligue 180): [https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180](https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180)
  - Painel de Dados da ONDH / MDHC: [https://www.gov.br/mdh/pt-br/ondh/painel-de-dados](https://www.gov.br/mdh/pt-br/ondh/painel-de-dados)
  - Referência complementar — Atlas da Violência (IPEA / FBSP): [https://www.ipea.gov.br/atlasviolencia/](https://www.ipea.gov.br/atlasviolencia/)
- **Arquivos no Repositório:**
  - **Base Bruta (intocada):** `data-science/dados/denuncias_ligue180.csv` (`1.540` linhas × `14` colunas)
  - **Base Tratada:** `data-science/dados/dados_tratados.csv` (`1.500` linhas únicas × `20` colunas, incluindo variáveis temporais derivadas e colunas-bandeira de imputação)
- **Justificativa para o Tema e o Aplicativo Selene:** A base reflete os registros de atendimentos e denúncias de violência doméstica e familiar contra a mulher no Paraná (2022–2025), permitindo analisar o perfil dos episódios (vínculo com o autor, tipo de violência, local de ocorrência, tempo até a denúncia e reincidência) e fundamentar o indicador de atenção/risco de repetição que será integrado ao módulo camuflado do aplicativo **Selene** nas Entregas 3 e 4.

---

## 2. Ficha de Governança, Ética e LGPD

| Pergunta | Resposta do Grupo |
|---|---|
| **Nome da base e link da fonte** | Central de Atendimento à Mulher — Ligue 180 (ONDH/MDHC): [dados.gov.br](https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180) e [Painel ONDH](https://www.gov.br/mdh/pt-br/ondh/painel-de-dados) |
| **Órgão responsável e data de acesso** | Ministério dos Direitos Humanos e da Cidadania (MDHC) / Ouvidoria Nacional de Direitos Humanos (ONDH) · Acesso em outubro de 2026 |
| **Licença / termos de uso** | Dados Abertos Governamentais (Política de Dados Abertos do Poder Executivo Federal — Decreto nº 8.777/2016 e Lei de Acesso à Informação nº 12.527/2011), de uso livre para fins acadêmicos e estatísticos |
| **Granularidade** | Cada linha representa uma notificação/registro individual anonimizado de atendimento relativo à violência contra a mulher |
| **Período e abrangência geográfica** | Janeiro de 2022 a dezembro de 2025 (4 anos), abrangendo 6 municípios-polo do estado do Paraná (Londrina, Curitiba, Maringá, Ponta Grossa, Cascavel e Foz do Iguaçu) |
| **Contém dado pessoal ou sensível? Como foi anonimizada?** | Contém atributos sociodemográficos sensíveis em estrutura (`raca_cor`, `escolaridade`, `vinculo_autor`, `tipo_violencia`), porém **estritamente anonimizados** na origem (Art. 12 da LGPD — Lei nº 13.709/2018), sem nome, CPF, RG, telefone ou endereço exato |
| **Riscos de reidentificação ao cruzar colunas** | O cruzamento simultâneo de município + data exata + idade + raça/cor + escolaridade poderia gerar risco de reidentificação indireta (quase-identificadores) em recortes pequenos; por isso, as análises são apresentadas apenas de forma agregada (por mês, faixa e totais municipais) |
| **Limitações: subnotificação, viés de quem registra, mudanças de metodologia** | Dados de denúncia medem apenas os casos **notificados**, não a totalidade das agressões reais (forte subnotificação por medo, dependência econômica ou falta de acesso). Há também campos não declarados (`Ignorado`/`Não informado`) no ato do relato |
| **Por que esta base serve ao aplicativo?** | Permite compreender os fatores associados à repetição da violência (`violencia_repetida`), o atraso na busca por ajuda (`dias_ate_notificacao`) e a predominância de parceiros/ex-parceiros no ambiente residencial, orientando o design da área camuflada de emergência e o futuro modelo de classificação de risco da Entrega 3 |

> **Aviso Acadêmico Obrigatório:** Este trabalho é um protótipo acadêmico desenvolvido na disciplina de Projeto Integrador (ADS — Universidade Positivo). Nenhum indicador, estatística ou modelo calculado aqui substitui atendimento policial, jurídico, psicológico ou de saúde. Em caso de violência contra a mulher: **Ligue 180** (Central de Atendimento à Mulher, gratuito e 24h) ou **190** (Polícia Militar — emergência).

---

## 3. Dicionário de Dados (`denuncias_ligue180.csv`)

| Coluna | Significado | Tipo Estatístico | Unidade | Observação |
|---|---|---|---|---|
| `id_notificacao` | Identificador único anônimo do registro de atendimento | Identificador (qualitativa nominal) | — | Chave primária do registro (deve ser única) |
| `data_notificacao` | Data em que a denúncia foi registrada no canal | Temporal (data) | `dd/mm/aaaa` | Na base bruta apresenta formatos mistos e datas inválidas |
| `municipio` | Município paranaense de referência do registro | Qualitativa nominal | — | 6 municípios-polo do PR (com variações de grafia na base bruta) |
| `idade` | Idade da vítima no momento da notificação | Quantitativa discreta | anos | Faixa plausível definida: 10 a 100 anos |
| `raca_cor` | Raça/cor autodeclarada segundo categorias do IBGE | Qualitativa nominal | — | Contém registros com `"Ignorado"` / `"Não informado"` |
| `escolaridade` | Nível de instrução formal da vítima | Qualitativa ordinal | — | Ordem: Fundamental incompleto → Pós-graduação |
| `renda_familiar` | Renda mensal familiar estimada | Quantitativa contínua | R$ | Distribuição assimétrica positiva (cauda longa à direita) |
| `n_filhos` | Número de filhos ou dependentes da vítima | Quantitativa discreta | filhos (unid.) | Faixa plausível definida: 0 a 15 filhos |
| `tipo_violencia` | Natureza principal da violência relatada (Lei Maria da Penha) | Qualitativa nominal | — | `Psicológica`, `Física`, `Moral`, `Patrimonial`, `Sexual` |
| `local_ocorrencia` | Ambiente em que ocorreu o episódio de violência | Qualitativa nominal | — | Predominância de `Residência` |
| `vinculo_autor` | Relação entre o autor da agressão e a vítima | Qualitativa nominal | — | `Parceiro atual`, `Ex-parceiro`, `Familiar`, `Conhecido`, `Desconhecido` |
| `dias_ate_notificacao` | Tempo decorrido entre o episódio e o registro da denúncia | Quantitativa discreta | dias | Forte assimetria positiva (mediana muito menor que a média) |
| `violencia_repetida` | Indica se a violência já havia ocorrido anteriormente | Qualitativa nominal (binária) | — | `Sim` / `Não` — variável-alvo candidata para a Entrega 3 |
| `encaminhamento` | Órgão da rede de proteção para o qual o caso foi encaminhado | Qualitativa nominal | — | Ocorre após a denúncia (não deve entrar como preditora no modelo) |
