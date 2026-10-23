# Governança e Fonte dos Dados — Projeto Selene

## 1. Identificação da Base
- **Fonte Primária de Referência:** Painel de Dados da Ouvidoria Nacional de Direitos Humanos (Ligue 180) — Ministério dos Direitos Humanos e da Cidadania (MDHC) e Atlas da Violência (IPEA / FBSP).
- **Conjunto de Dados Ligue 180 (Portal Brasileiro de Dados Abertos):** [https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180](https://dados.gov.br/dados/conjuntos-dados/central-de-atendimento-a-mulher--ligue-180)
- **Painel de Dados e Microdados CSV/XLSX da ONDH (Gov.br):** [https://www.gov.br/mdh/pt-br/ondh/painel-de-dados](https://www.gov.br/mdh/pt-br/ondh/painel-de-dados)
- **Portal Oficial Atlas da Violência (IPEA):** [https://www.ipea.gov.br/atlasviolencia/](https://www.ipea.gov.br/atlasviolencia/)
- **Arquivo no Repositório:** `data-science/dados/denuncias_ligue180.csv`

## 2. Licença de Uso e Conformidade com a LGPD
- **Licença:** Dados Abertos Governamentais (Política de Dados Abertos do Poder Executivo Federal — Decreto nº 8.777/2016), de livre utilização para fins acadêmicos, científicos e estatísticos.
- **Privacidade e LGPD (Lei nº 13.709/2018):** A base utilizada é estritamente anonimizada e desprovida de quaisquer dados pessoais identificáveis (sem nomes, CPFs, telefones ou endereços exatos de vítimas reais), em total conformidade com o Art. 12 da LGPD e com a Seção 2.3 do Documento Orientador.

## 3. Dicionário de Variáveis (`denuncias_ligue180.csv`)

| Coluna | Tipo | Descrição |
|---|---|---|
| `id_registro` | Inteiro | Identificador anônimo do registro de atendimento |
| `idade_vitima` | Numérico | Idade da vítima em anos completos no momento da denúncia |
| `episodios_anteriores` | Numérico | Quantidade relatada de agressões ou ameaças anteriores antes da denúncia |
| `tempo_convivencia_anos` | Numérico | Tempo de relacionamento ou convivência com o agressor (em anos) |
| `dias_ate_denuncia` | Numérico | Intervalo em dias entre o último episódio e o acionamento do canal de apoio |
| `tipo_violencia` | Categórico | Classificação principal (`Psicológica`, `Física`, `Moral`, `Patrimonial`, `Sexual`) |
| `relacao_agressor` | Categórico | Vínculo do agressor com a vítima (`Companheiro`, `Ex-companheiro`, `Familiar`, `Outro`) |
| `local_ocorrencia` | Categórico | Ambiente do episódio (`Residência`, `Via Pública`, `Local de Trabalho`) |
| `turno_ocorrencia` | Categórico | Período do dia (`Noite`, `Madrugada`, `Tarde`, `Manhã`) |
| `risco_grave` | Binário (0/1) | Indicador de severidade/urgência (`0` = Risco Moderado, `1` = Risco Elevado) |
