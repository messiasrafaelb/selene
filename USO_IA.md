# Uso de Inteligência Artificial — Projeto Selene

## Ferramentas utilizadas
- Gemini (Google)

## Onde foram usadas

| Parte do projeto | Ferramenta | Como foi usada | Revisado por |
|---|---|---|---|
| Planejamento e Documentação (Entrega 1) | Gemini | Brainstorming inicial do conceito de disfarce (calendário menstrual) e estruturação da documentação de escopo | Messias Rafael Bernardes |
| Camada de Dados Simulados (`mockData.js`) | Gemini | Apoio na escrita das funções auxiliares de formatação de data/telefone e cálculo do resumo do ciclo em JavaScript | Messias Rafael Bernardes |
| Telas do Ciclo Menstrual (`LoginScreen`, `CycleHomeScreen`, `CycleHistoryScreen`, `NewCycleScreen`) | Gemini | Geração da estilização Flexbox (`StyleSheet`), paginação da lista de ciclos e seletores de fluxo e humor | Messias Rafael Bernardes |
| Área de Apoio e Emergência (`EmergencyScreen`, `NewContactScreen`) | Gemini | Estruturação visual dos cartões de ligação rápida (180 e 190) com `Linking.openURL` e formulário de contatos de segurança | Messias Rafael Bernardes |
| Navegação e Gatilho do Disfarce (`App.js`, `src/navigation/`) | Gemini | Configuração da árvore React Navigation (Tab + Stack) e modal de PIN acionado por toque longo de 5 segundos (`delayLongPress`) | Messias Rafael Bernardes |
| Análise Exploratória e Qualidade de Dados (`data-science/notebook.ipynb`) | Gemini | Apoio na estruturação do script Python (`pandas`, `numpy`, `seaborn`, `scikit-learn`) para limpeza de dados, normalização e cálculo de medidas de tendência central, dispersão e frequência | Messias Rafael Bernardes |

## Observações do grupo
A modelagem das entidades (`USERS`, `CYCLE`, `CONTACT`), a definição das regras de negócio (abertura e encerramento de ciclo, bloqueio de ciclos duplicados com aviso visual, fechamento automático após 7 dias, cálculo de humor frequente e máscaras de entrada) e a identidade visual do aplicativo foram definidas e conduzidas pelo aluno. A IA foi utilizada como suporte para traduzir essas especificações em componentes React Native e no notebook de estatística descritiva, sendo todo o código testado, refatorado e validado manualmente.
