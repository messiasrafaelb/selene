# Uso de Inteligência Artificial — Projeto Selene

## Ferramentas utilizadas
- Gemini (Google)

## Onde foram usadas

| Parte do projeto | Ferramenta | Como foi usada | Revisado por |
|---|---|---|---|
| Planejamento e Documentação (Entrega 1) | Gemini | Brainstorming inicial do conceito de disfarce (calendário menstrual) e estruturação da documentação de escopo | Messias Rafael Bernardes |
| Camada de Dados Simulados (`app/src/data/mockData.js`) | Gemini | Apoio na escrita das funções auxiliares de formatação de data/telefone, regras de abertura/encerramento de ciclo, bloqueio de ciclo duplicado e recuperação de senha com PIN | Messias Rafael Bernardes |
| Telas de Autenticação e Ciclo Menstrual (`LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`, `CycleHomeScreen`, `CycleHistoryScreen`, `NewCycleScreen`) | Gemini | Estruturação de layouts com Flexbox (`StyleSheet`), modal de calendário mensal navegável com destaque de dias de ciclo, paginação de histórico e seletores de enums (`flowOptions` e `moodOptions`) | Messias Rafael Bernardes |
| Área de Apoio e Emergência (`EmergencyScreen`, `NewContactScreen`) | Gemini | Estruturação dos cartões de discagem rápida (`Linking.openURL` para 180, 190 e contatos pessoais), máscara automática de telefone e saída rápida | Messias Rafael Bernardes |
| Navegação e Gatilho do Disfarce (`App.js`, `app/src/navigation/`) | Gemini | Configuração da árvore React Navigation (Tab + Stack) e modal de PIN acionado por toque longo de 5 segundos (`delayLongPress={5000}`) | Messias Rafael Bernardes |
| Governança, Qualidade nas 5 Dimensões e Tratamento (`data-science/notebook.ipynb` — Seções 1 a 4) | Gemini | Apoio na escrita das funções Python (`unicodedata`, `pandas`, `scipy.stats`, `scikit-learn`) para normalização de grafias (`unifica`), detecção de ausentes disfarçados, parsing de datas, remoção de duplicatas, imputação por mediana com colunas-bandeira e sinalização de outliers via IQR | Messias Rafael Bernardes |
| Análise Exploratória Completa e Plano de Modelagem (`data-science/notebook.ipynb` — Seções 5 a 7) | Gemini | Apoio na geração dos gráficos `matplotlib` (histogramas, boxplots, série temporal com média móvel de 6 meses, sazonalidade e matriz de correlação de Spearman) e organização da tabela de planejamento das Entregas 3 e 4 | Messias Rafael Bernardes |

## Principais Prompts Utilizados (Entrega 2)
1. *"Estruturar o diagnóstico de qualidade de dados nas 5 dimensões (completude, validade, consistência, unicidade e integridade/acurácia) para a base de notificações do Ligue 180, separando NaNs explícitos de buracos disfarçados ('Ignorado', 'N/I') e valores fora dos limites plausíveis."*
2. *"Implementar o pipeline ordenado de limpeza em pandas (padronização textual sem acento/sufixo -> conversão de inválidos e ignorados em NaN -> deduplicação por id_notificacao -> imputação numérica pela mediana com coluna-bandeira -> tabela antes × depois) salvando a base tratada em `data-science/dados/dados_tratados.csv`."*
3. *"Gerar as tabelas e gráficos de análise exploratória (medidas de tendência central, dispersão, assimetria e curtose; frequência absoluta, relativa e acumulada; série temporal mensal e correlação de Spearman com `violencia_repetida`) com títulos e rótulos em todos os eixos."*
4. *"Implementar no aplicativo React Native/Expo o calendário mensal navegável com destaque para os dias de ciclo, cadastro de conta com tooltip discreto para o PIN de 4 dígitos e recuperação de senha validando E-mail + PIN."*

## Observações do grupo
A escolha da base pública (Ligue 180 — ONDH/MDHC), a definição das faixas de validade e regras de imputação, a interpretação estatística dos resultados (sem inferir causalidade a partir de correlação), o plano de modelagem/avaliação e todas as regras de negócio do aplicativo mobile foram definidos, conferidos e validados pelo aluno responsável.
