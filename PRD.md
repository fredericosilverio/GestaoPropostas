# PRD – Sistema de Análise de Mercado para Licitações Públicas

**Versão:** 2.0 – Completa e Funcional  
**Data:** Janeiro de 2026  
**Órgão:** Estado de Goiás  
**Status:** Aprovado para Desenvolvimento

---

## Histórico de Versões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | Jan/2026 | Equipe de Compras | Versão inicial do PRD |
| 2.0 | Jan/2026 | Equipe de Desenvolvimento | Versão completa com métricas, requisitos não funcionais detalhados, fluxos, casos de uso e melhorias |

---

## Índice do Documento

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Base Legal e Normativa](#2-base-legal-e-normativa)
3. [Personas e Stakeholders](#3-personas-e-stakeholders)
4. [Escopo do Sistema](#4-escopo-do-sistema)
5. [Requisitos Funcionais Detalhados](#5-requisitos-funcionais-detalhados)
6. [Requisitos Não Funcionais](#6-requisitos-não-funcionais)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Fluxos de Trabalho](#8-fluxos-de-trabalho)
9. [Modelo de Dados](#9-modelo-de-dados)
10. [Interface do Usuário](#10-interface-do-usuário)
11. [Casos de Uso Detalhados](#11-casos-de-uso-detalhados)
12. [Requisitos Não Funcionais Completos](#12-requisitos-não-funcionais-completos)
13. [Estratégia de Testes](#13-estratégia-de-testes)
14. [Segurança e Conformidade](#14-segurança-e-conformidade)
15. [Cronograma e Fases](#15-cronograma-e-fases)
16. [Riscos e Mitigações](#16-riscos-e-mitigações)
17. [Métricas de Sucesso e KPIs](#17-métricas-de-sucesso-e-kpis)
18. [Roadmap Futuro](#18-roadmap-futuro)
19. [Glossário](#19-glossário)
20. [Anexos](#20-anexos)

---

## 1. Visão Geral do Produto

### 1.1 Contexto

A Administração Pública, especialmente no âmbito do Estado de Goiás, necessita realizar análises de mercado para estimativa de preços em processos licitatórios, em conformidade com o **Decreto Estadual nº 9.900/2021, Art. 6º**. Esse processo está diretamente vinculado ao **Plano de Contratações Anual (PCA)** da instituição, que organiza e consolida todas as demandas de contratação previstas para o exercício.

Atualmente, tanto o gerenciamento do PCA quanto a análise de mercado das demandas associadas são realizados por meio de planilhas isoladas, extensas e pouco funcionais, com alto grau de intervenção manual, baixo nível de rastreabilidade e dificuldades de auditoria.

### 1.2 Problema

As soluções atualmente utilizadas apresentam as seguintes limitações:

**Problemas Técnicos:**
- ❌ Não integram o PCA às análises de mercado
- ❌ Exigem ocultação e reexibição constante de colunas técnicas
- ❌ Não escalam bem para múltiplos itens e múltiplas demandas
- ❌ Misturam dados brutos, cálculos e validações em um único espaço visual
- ❌ Dificultam o controle do ciclo de vida da demanda
- ❌ Não possuem controle de usuários nem trilha de auditoria adequada

**Problemas Operacionais:**
- ⚠️ Retrabalho constante: mesmas informações digitadas múltiplas vezes
- ⚠️ Erros de cálculo manual comprometem a análise
- ⚠️ Perda de versões anteriores de documentos
- ⚠️ Dificuldade em localizar análises anteriores
- ⚠️ Tempo excessivo: 4-6 horas por análise de mercado

**Problemas Gerenciais:**
- 📉 Falta de visibilidade sobre andamento do PCA
- 📉 Impossibilidade de gerar indicadores consolidados
- 📉 Dificuldade em priorizar demandas
- 📉 Sem alertas automáticos de prazos

**Problemas Jurídicos/Auditoria:**
- ⚖️ Insegurança jurídica nas decisões
- ⚖️ Dificuldade em justificar metodologia perante órgãos de controle
- ⚖️ Falta de rastreabilidade de alterações
- ⚖️ Ausência de trilha de auditoria

**Impacto:** Isso compromete a governança das contratações, a eficiência operacional, a segurança jurídica e a transparência do processo.

### 1.3 Objetivo do Sistema

Desenvolver um **sistema integrado de gestão do PCA e análise de mercado**, seguro, auditável e orientado a regras de negócio, capaz de:

**Objetivos Primários:**
- ✅ Gerenciar o Plano de Contratações Anual da instituição
- ✅ Cadastrar e controlar demandas vinculadas ao PCA
- ✅ Realizar análises de mercado por demanda e por item
- ✅ Garantir conformidade normativa e rastreabilidade completa

**Objetivos Secundários:**
- 🎯 **Reduzir em 70%** o tempo médio de elaboração de análises de mercado
  - De 4-6 horas → para 1-2 horas
- 🎯 **Eliminar 100%** dos erros de cálculo manual
- 🎯 **Aumentar em 90%** a taxa de execução do PCA
- 🎯 Fornecer **segurança jurídica** para decisões administrativas
- 🎯 Reduzir em **50%** o tempo de resposta a auditorias

### 1.4 Proposta de Valor

| **Para Servidores** | **Para Gestores** | **Para Auditoria** |
|---------------------|-------------------|-------------------|
| • Redução de 70% no tempo de trabalho | • Visão consolidada do PCA | • Trilha de auditoria completa |
| • Interface intuitiva e responsiva | • Dashboard com indicadores | • Rastreabilidade total |
| • Cálculos automáticos | • Alertas de prazos | • Conformidade normativa |
| • Eliminação de planilhas complexas | • Relatórios gerenciais | • Exportação de evidências |
| • Validação automática de preços | • Controle de execução | • Histórico inalterável |
| • Segurança jurídica nas decisões | • Tomada de decisão baseada em dados | • Acesso read-only total |
| • Biblioteca de itens reutilizáveis | • Identificação de gargalos | • Relatórios de conformidade |
| • Ajuda contextual integrada | • Priorização inteligente | • Evidências para processos |

### 1.5 Declaração de Visão

> **"Ser a solução padrão para gestão de contratações públicas no Estado de Goiás, promovendo eficiência, transparência e conformidade em todos os processos de análise de mercado e planejamento de contratações."**

### 1.6 Benefícios Esperados

**Quantitativos:**
- ⏱️ Redução de 70% no tempo de elaboração de análises
- 📊 Aumento de 90% na taxa de execução do PCA
- ✅ Eliminação de 100% dos erros de cálculo
- 💰 Economia estimada de R$ 200.000/ano em horas-trabalho
- 📈 Aumento de 50% na capacidade de processamento de demandas

**Qualitativos:**
- 🛡️ Maior segurança jurídica
- 🔍 Transparência total nos processos
- 📋 Conformidade com legislação
- 🤝 Satisfação dos usuários
- 🏆 Reconhecimento pelos órgãos de controle

---

## 2. Base Legal e Normativa

O sistema deve estar em conformidade com:

### 2.1 Legislação Federal

#### Lei nº 14.133/2021 (Nova Lei de Licitações)

**Artigos relevantes:**
- **Art. 11:** Planejamento de contratações
- **Art. 18:** Pesquisa de preços
- **Art. 23:** Estimativa de preços

**Princípios aplicáveis:**
- Legalidade
- Impessoalidade
- Moralidade
- Publicidade
- Eficiência
- Economicidade
- Desenvolvimento nacional sustentável
- Competitividade
- Isonomia
- Vinculação ao instrumento convocatório

#### Lei nº 13.709/2018 (LGPD)

**Obrigações:**
- Tratamento adequado de dados pessoais
- Consentimento para coleta de dados
- Direitos dos titulares:
  - Acesso aos dados
  - Correção de dados
  - Exclusão de dados (quando aplicável)
  - Portabilidade
- Segurança da informação
- Responsabilização em caso de vazamento

**Dados tratados pelo sistema:**
- Dados cadastrais de usuários (nome, CPF, matrícula, e-mail)
- Dados de fornecedores (CNPJ, razão social, contatos)
- Dados de acesso (IP, navegador)

### 2.2 Legislação Estadual

#### Decreto Estadual nº 9.900/2021

**Art. 6º - Metodologia de Análise de Mercado:**

*"A estimativa de preços será realizada mediante pesquisa de mercado, considerando-se a mediana dos valores obtidos, admitindo-se a fixação de intervalo de variação de até 25% (vinte e cinco por cento) para mais ou para menos."*

**Implicações para o sistema:**
- ✅ Cálculo obrigatório da mediana
- ✅ Intervalo fixo de ±25%
- ✅ Documentação da metodologia
- ✅ Registro das fontes de preços

### 2.3 Princípios da Administração Pública

Conforme Art. 37 da Constituição Federal:

| Princípio | Aplicação no Sistema |
|-----------|---------------------|
| **Legalidade** | Sistema segue estritamente as normas aplicáveis |
| **Impessoalidade** | Metodologia padronizada para todos os itens |
| **Moralidade** | Transparência nos processos e decisões |
| **Publicidade** | Rastreabilidade e possibilidade de auditoria |
| **Eficiência** | Automação e redução de tempo |
| **Economicidade** | Busca pelo melhor custo-benefício |
| **Rastreabilidade** | Logs completos de todas as ações |
| **Motivação** | Justificativas obrigatórias para decisões |

### 2.4 Normas dos Órgãos de Controle

#### TCE-GO (Tribunal de Contas do Estado de Goiás)

**Exigências:**
- Comprovação da metodologia de pesquisa de preços
- Documentação das fontes consultadas
- Histórico de alterações
- Assinatura do responsável técnico

#### CGE-GO (Controladoria-Geral do Estado)

**Exigências:**
- Conformidade com princípios administrativos
- Controles internos adequados
- Gestão de riscos

#### Controle Interno

**Exigências:**
- Segregação de funções
- Trilha de auditoria
- Relatórios periódicos

### 2.5 Normas Técnicas

- **ISO/IEC 27001:** Segurança da informação
- **ISO/IEC 27002:** Boas práticas de segurança
- **WCAG 2.1:** Acessibilidade web (nível AA)
- **OWASP:** Segurança em aplicações web

### 2.6 Implicações para o Sistema

O sistema **DEVE:**
- ✅ Implementar a metodologia do Decreto 9.900/2021 (mediana ±25%)
- ✅ Permitir justificativa objetiva e rastreável das decisões
- ✅ Assegurar conformidade com LGPD
- ✅ Facilitar auditorias por órgãos de controle
- ✅ Manter histórico inalterável de alterações
- ✅ Garantir proteção de dados pessoais
- ✅ Implementar controles de acesso adequados
- ✅ Gerar evidências documentais para processos

O sistema **NÃO DEVE:**
- ❌ Permitir alteração de logs de auditoria
- ❌ Permitir acesso sem autenticação
- ❌ Armazenar senhas em texto plano
- ❌ Permitir exclusão definitiva de dados (usar soft delete)
- ❌ Processar dados pessoais sem necessidade

---

## 3. Personas e Stakeholders

### 3.1 Usuários Primários

#### 3.1.1 Servidor da Área de Compras (Operador)

**Perfil Demográfico:**
- **Nome fictício:** João Silva
- **Cargo:** Analista de Compras
- **Idade:** 35 anos
- **Formação:** Administração Pública
- **Experiência:** 8 anos em licitações

**Perfil Comportamental:**
- Técnico-administrativo com bom conhecimento em licitações
- Usuário frequente de sistemas web
- Realiza de 5 a 15 análises de mercado por mês
- Valoriza agilidade e praticidade
- Preocupado com conformidade legal

**Contexto de Uso:**
- Trabalha em escritório com computador desktop
- Acessa o sistema diariamente, em média 3-4 horas/dia
- Lida com múltiplas demandas simultaneamente
- Frequentemente interrompido por outras tarefas
- Pressão por prazos

**Necessidades:**
- ⭐ Agilidade na entrada de dados
- ⭐ Validação automática de preços
- ⭐ Geração rápida de relatórios
- ⭐ Segurança jurídica nas decisões
- ⭐ Interface intuitiva que não exija treinamento extenso
- ⭐ Copiar/reutilizar dados de análises anteriores
- ⭐ Anexar evidências facilmente

**Dores Atuais:**
- 😣 Gasta 4-6 horas por análise de mercado (muito tempo!)
- 😣 Retrabalho constante com planilhas
- 😣 Erros de cálculo manual causam retrabalho
- 😣 Dificuldade em justificar metodologia para auditoria
- 😣 Perda de versões anteriores de documentos
- 😣 Dificuldade em encontrar análises anteriores para referência

**Objetivos:**
- 🎯 Reduzir tempo de trabalho em 70%
- 🎯 Eliminar erros de cálculo
- 🎯 Ter confiança nas decisões tomadas
- 🎯 Facilitar prestação de contas
- 🎯 Ter mais tempo para atividades estratégicas

**Citações:**
> "Preciso de um sistema que faça os cálculos automaticamente e me dê segurança de que estou seguindo a metodologia correta."

> "Perco muito tempo procurando análises anteriores para usar como referência."

**Tecnologia:**
- Habilidade: Média-Alta
- Dispositivos: Desktop (Windows 10)
- Conectividade: Boa (rede corporativa)

---

#### 3.1.2 Gestor de Contratações

**Perfil Demográfico:**
- **Nome fictício:** Maria Santos
- **Cargo:** Coordenadora de Compras
- **Idade:** 45 anos
- **Formação:** Mestrado em Gestão Pública
- **Experiência:** 15 anos no setor público

**Perfil Comportamental:**
- Responsável pelo planejamento anual de contratações
- Nível gerencial/estratégico
- Supervisiona equipe de 5-8 pessoas
- Responde por valores orçamentários de R$ 50-100 milhões/ano
- Foco em resultados e conformidade

**Contexto de Uso:**
- Acessa o sistema 2-3 vezes por semana
- Uso focado em aprovações, dashboards e relatórios
- Toma decisões baseadas em indicadores
- Reporta para alta gestão (secretário/diretor)

**Necessidades:**
- 📊 Visão consolidada do PCA
- 📊 Controle de prazos e metas
- 📊 Indicadores de desempenho da equipe
- 📊 Relatórios gerenciais para alta gestão
- 📊 Alertas de demandas atrasadas ou com risco
- 📊 Comparativo com anos anteriores

**Dores Atuais:**
- 😣 Falta de visibilidade sobre o andamento do PCA
- 😣 Dificuldade em priorizar demandas
- 😣 Relatórios manuais demorados para diretoria
- 😣 Não consegue identificar gargalos rapidamente
- 😣 Surpresas de última hora (prazos vencendo)

**Objetivos:**
- 🎯 Ter controle completo sobre o PCA
- 🎯 Identificar e resolver gargalos proativamente
- 🎯 Demonstrar eficiência para a alta gestão
- 🎯 Garantir execução de 90% do PCA no ano
- 🎯 Reduzir reclamações de unidades demandantes

**Citações:**
> "Preciso saber em tempo real o status de cada demanda e se vamos conseguir executar tudo que foi planejado."

> "Quero ser informado antes que um problema se torne crítico."

**Tecnologia:**
- Habilidade: Média
- Dispositivos: Desktop e notebook
- Preferência: Visualizações gráficas e indicadores

---

### 3.2 Usuários Secundários

#### 3.2.1 Controle Interno

**Perfil:**
- Auditor interno do órgão
- Avalia processos e procedimentos
- Verifica conformidade legal
- Emite relatórios e recomendações

**Necessidades:**
- 🔍 Acesso read-only ao sistema
- 🔍 Trilha de auditoria completa
- 🔍 Relatórios de conformidade
- 🔍 Exportação de dados para análise
- 🔍 Histórico de todas as alterações
- 🔍 Identificação de padrões irregulares

**Frequência de uso:** Semanal/Mensal (auditorias programadas)

**Contexto:**
- Auditorias preventivas
- Investigações pontuais
- Análise de conformidade
- Relatórios para alta gestão

---

#### 3.2.2 Auditoria Externa (TCE/CGE)

**Perfil:**
- Auditor de órgãos de controle externo
- Realiza fiscalização
- Emite pareceres vinculantes
- Pode determinar correções

**Necessidades:**
- 📋 Exportação de dados em formatos padronizados (CSV, XLSX, JSON)
- 📋 Histórico completo de alterações
- 📋 Evidências de conformidade normativa
- 📋 Acesso temporário ao sistema (durante auditoria)
- 📋 Documentação completa da metodologia
- 📋 Relatórios personalizados

**Frequência de uso:** Eventual (auditorias específicas, 1-2x/ano)

**Contexto:**
- Auditorias externas
- Investigações de denúncias
- Avaliação de conformidade legal

**Requisitos especiais:**
- Acesso com usuário e senha temporários
- Perfil específico de "Auditor Externo"
- Log de tudo que foi acessado/exportado

---

#### 3.2.3 Unidade Demandante

**Perfil:**
- Gestor de área que solicita a contratação
- Não é especialista em licitações
- Aguarda resultado da análise para planejamento
- Ex: Diretor de TI, Diretor de RH, etc.

**Necessidades:**
- 📱 Acompanhamento do status da sua demanda
- 📱 Notificações por e-mail sobre andamento
- 📱 Consulta ao valor estimado
- 📱 Previsão de quando ficará pronto
- 📱 Entendimento simples do processo

**Frequência de uso:** Ocasional (acompanhamento de suas demandas)

**Contexto:**
- Acompanha 1-5 demandas próprias
- Não precisa ver demandas de outras áreas
- Pode adicionar informações/comentários
- Recebe notificações por e-mail

---

#### 3.2.4 Equipe de TI/Suporte

**Perfil:**
- Equipe técnica responsável pelo sistema
- Administração de infraestrutura
- Suporte a usuários
- Manutenção e atualizações

**Necessidades:**
- 🔧 Logs detalhados do sistema
- 🔧 Monitoramento de performance
- 🔧 Gestão de backups
- 🔧 Controle de usuários e permissões
- 🔧 Painel de administração
- 🔧 Alertas de erros/problemas

**Frequência de uso:** Diária (administração do sistema)

**Contexto:**
- Manutenção preventiva
- Resolução de problemas
- Criação de usuários
- Atualizações do sistema

---

### 3.3 Stakeholders

#### 3.3.1 Alta Gestão (Secretário/Diretor)

**Interesse:**
- Resultados e indicadores de desempenho
- Conformidade legal
- Eficiência operacional
- Transparência e prestação de contas
- Imagem institucional

**Expectativa:**
- Dashboard executivo com KPIs principais
- Relatórios consolidados mensais
- Alertas de problemas críticos
- Benchmarking com outros órgãos

**Influência:** 🔴 ALTA (toma decisão de implementação)

---

#### 3.3.2 Área Jurídica

**Interesse:**
- Conformidade legal das contratações
- Segurança jurídica nas decisões
- Documentação adequada
- Defesa em processos administrativos

**Expectativa:**
- Rastreabilidade completa
- Justificativas documentadas
- Evidências para defesa
- Pareceres jurídicos anexáveis

**Influência:** 🟡 MÉDIA (valida conformidade)

---

#### 3.3.3 Área Orçamentária/Financeira

**Interesse:**
- Previsão orçamentária precisa
- Execução conforme planejado
- Controle de custos
- Disponibilidade orçamentária

**Expectativa:**
- Valores estimados confiáveis
- Relatórios de execução
- Alertas de impacto orçamentário
- Integração com sistema financeiro (futuro)

**Influência:** 🟡 MÉDIA (valida viabilidade financeira)

---

#### 3.3.4 Fornecedores (indireto)

**Interesse:**
- Transparência no processo
- Critérios claros de análise
- Isonomia
- Oportunidades de contratação

**Expectativa:**
- Processo justo
- Metodologia transparente
- Sem favorecimentos

**Influência:** 🟢 BAIXA (não participa diretamente do sistema)

**Observação:** Embora não usem o sistema, são impactados pelos resultados.

---

## 4. Escopo do Sistema

### 4.1 O que o Sistema DEVE Fazer (In Scope)

#### 4.1.1 Gestão do PCA

✅ **Planejamento Anual:**
- Permitir o cadastro do Plano de Contratações Anual por exercício
- Controlar status do PCA (em elaboração, aprovado, em execução, encerrado)
- Registrar data de aprovação e responsável
- Vincular PCA ao órgão e unidades

✅ **Monitoramento:**
- Gerar dashboard com indicadores do PCA
- Exibir taxa de execução em tempo real
- Alertar sobre metas não atingidas
- Comparar com anos anteriores

✅ **Controle:**
- Permitir versionamento do PCA
- Manter histórico de alterações
- Controlar acesso por perfil
- Registrar aprovações

---

#### 4.1.2 Gestão de Demandas

✅ **Cadastro:**
- Cadastrar demandas vinculadas ao PCA
- Identificar demandas pelo padrão **PCA-[NúmeroProjeto]**
- Registrar justificativas técnica e administrativa
- Vincular a unidade demandante e responsável
- Definir tipo de contratação e natureza da despesa
- Estabelecer data prevista de contratação

✅ **Ciclo de Vida:**
- Controlar status: cadastrada → em análise → estimada → em contratação → contratada
- Permitir cancelamento/suspensão com justificativa
- Registrar transições de status com data/hora/usuário
- Bloquear edições após contratação

✅ **Documentação:**
- Permitir anexação de documentos (TR, ETP, estudos)
- Suportar múltiplos formatos (PDF, DOCX, XLSX)
- Controlar versões de documentos
- Anexos com descrição e data

✅ **Comunicação:**
- Enviar notificações sobre mudanças de status
- Alertar responsável e gestor sobre prazos
- Permitir comentários entre usuários
- Notificar unidade demandante

---

#### 4.1.3 Análise de Mercado

✅ **Cadastro de Itens:**
- Permitir cadastro de múltiplos itens por demanda
- Descrever item detalhadamente
- Definir unidade de medida e quantidade
- Especificar características técnicas
- Vincular a elemento de despesa

✅ **Coleta de Preços:**
- Registrar preços de múltiplas fontes
- Classificar tipo de fonte (fornecedor, portal, ata, contrato, etc.)
- Armazenar dados do fornecedor (CNPJ, razão social, contato)
- Registrar data da coleta
- Permitir observações

✅ **Evidências:**
- Anexar prints, orçamentos, propostas
- Suportar múltiplos anexos por preço (até 5 arquivos)
- Validar formatos aceitos (PDF, JPG, PNG, XLSX)
- Limite de 10 MB por arquivo
- Gerar hash MD5 para integridade

✅ **Cálculos Automáticos:**
- Calcular média aritmética
- Calcular mediana
- Definir limite inferior (mediana - 25%)
- Definir limite superior (mediana + 25%)
- Calcular desvio padrão (informativo)
- Contar preços válidos

✅ **Validação:**
- Classificar preços automaticamente (aceito / fora do intervalo)
- Destacar visualmente preços inválidos
- Alertar sobre quantidade insuficiente de preços (< 3)
- Validar data de coleta (não superior a 12 meses)
- Exigir mínimo de 3 preços por item

✅ **Consolidação:**
- Calcular valor estimado unitário (mediana dos aceitos)
- Calcular valor estimado total (unitário × quantidade)
- Consolidar valor total da demanda (soma dos itens)
- Permitir ajuste manual com justificativa (perfil Gestor)

✅ **Reutilização:**
- Manter catálogo de itens já cadastrados
- Sugerir itens similares ao digitar
- Permitir copiar item de outra demanda
- Exibir histórico de preços de análises anteriores

---

#### 4.1.4 Relatórios e Exportação

✅ **Tipos de Relatórios:**
1. **Relatório do PCA**
   - Visão consolidada de todas as demandas
   - Status, valores, prazos
   - Gráficos e indicadores

2. **Relatório de Análise de Mercado por Demanda**
   - Dados da demanda
   - Metodologia aplicada
   - Detalhamento de todos os itens
   - Evidências anexadas
   - Assinatura do responsável

3. **Relatório Detalhado por Item**
   - Descrição e especificações
   - Tabela completa de preços
   - Cálculos estatísticos
   - Gráfico de dispersão
   - Valor estimado final

4. **Relatório de Auditoria**
   - Histórico de alterações
   - Filtros por usuário, período, ação
   - Exportação de logs

✅ **Formatos:**
- **PDF:** formatação profissional, logo do órgão, numeração
- **XLSX:** dados estruturados, fórmulas preservadas
- **CSV:** dados brutos para integração

✅ **Personalização:**
- Escolher seções a incluir
- Filtros por período, status, valor
- Incluir/excluir anexos
- Templates customizáveis

✅ **Textos Automáticos:**
- Gerar texto padrão para ETP
- Gerar texto padrão para TR
- Justificativa de metodologia (conforme Decreto 9.900/2021)
- Texto editável pelo usuário

---

#### 4.1.5 Segurança e Auditoria

✅ **Autenticação:**
- Integração com Active Directory (preferencial)
- Autenticação local alternativa
- Senha forte obrigatória
- Bloqueio após tentativas falhas
- Timeout de sessão (30 minutos)
- Logout automático à meia-noite

✅ **Autorização:**
- Controle por perfis (Administrador, Gestor, Operador, Consulta, Auditor)
- Permissões granulares por funcionalidade
- Perfil de Unidade Demandante (visualiza apenas suas demandas)
- Segregação de funções

✅ **Auditoria:**
- Registrar todas as ações relevantes
- Dados: usuário, data/hora, ação, entidade, ID, valor anterior, valor novo, IP
- Logs imutáveis (não podem ser alterados/excluídos)
- Retenção mínima de 5 anos
- Soft delete (não excluir fisicamente)

✅ **Backup:**
- Backup incremental diário
- Backup completo semanal
- Backup mensal arquivado
- Criptografia AES-256
- Storage externo/cloud
- Testes trimestrais de restauração

✅ **Conformidade LGPD:**
- Minimização de dados pessoais
- Consentimento explícito
- Direitos dos titulares (acesso, correção, exclusão)
- Relatório de dados tratados
- DPO designado

---

#### 4.1.6 Usabilidade e Interface

✅ **Interface Web:**
- Responsiva (desktop 1920x1080, notebook 1366x768, tablet 1024x768)
- Navegadores: Chrome, Firefox, Edge (últimas 2 versões)
- Idioma: Português do Brasil
- Temas: claro e escuro

✅ **Funcionalidades:**
- Busca global (demandas, itens, fornecedores)
- Filtros avançados
- Ordenação por colunas
- Paginação
- Exportação de listas
- Ações em lote

✅ **Dashboard Personalizado:**
- Cards com indicadores principais
- Gráficos interativos
- Atalhos para ações frequentes
- Customização por usuário

✅ **Ajuda:**
- Ajuda contextual (tooltips)
- Vídeos tutoriais integrados
- FAQ
- Chat de suporte (futuro)

✅ **Acessibilidade:**
- Conformidade WCAG 2.1 nível AA
- Navegação por teclado
- Compatibilidade com leitores de tela
- Contraste adequado (mínimo 4.5:1)
- Textos alternativos em imagens
- Tamanho de fonte ajustável

---

### 4.2 O que o Sistema NÃO Fará (Out of Scope - Fase Inicial)

❌ **Integrações Externas:**
- Publicação automática em portais (ComprasNet, BEC)
- Integração obrigatória com sistemas federais
- Cotação eletrônica com fornecedores
- Portal do fornecedor

❌ **Gestão Financeira:**
- Execução financeira
- Empenho orçamentário
- Controle de pagamentos
- Integração com sistema de folha

❌ **Gestão Contratual:**
- Gestão de contratos e aditivos
- Controle de vigência
- Gestão de garantias
- Fiscalização de contratos

❌ **Processos Licitatórios:**
- Módulo de pregão eletrônico
- Disputa de lances
- Habilitação de fornecedores
- Julgamento de propostas

❌ **Gestão de Materiais:**
- Controle de almoxarifado
- Gestão de estoque
- Controle de patrimônio
- Movimentação de bens

❌ **Outras Funcionalidades:**
- App mobile nativo
- Assinatura digital integrada (ICP-Brasil)
- Blockchain para rastreabilidade
- Inteligência artificial para sugestões

**Observação:** Estes itens podem ser considerados em **fases futuras** conforme demanda, priorização e disponibilidade de recursos.

---

### 4.3 Premissas do Projeto

**Premissas Organizacionais:**
1. ✅ Alta gestão aprova e apoia o projeto
2. ✅ Orçamento aprovado e disponível
3. ✅ Equipe de desenvolvimento será alocada
4. ✅ Usuários estarão disponíveis para testes e treinamento
5. ✅ Dados históricos podem ser migrados manualmente (não há obrigação de migração automática)

**Premissas Técnicas:**
6. ✅ Usuários possuem conhecimento básico em informática
7. ✅ Acesso à internet está disponível
8. ✅ Navegadores modernos serão utilizados
9. ✅ Infraestrutura de servidor está disponível (on-premise ou cloud)
10. ✅ Active Directory está disponível para integração (preferencial)

**Premissas de Implementação:**
11. ✅ Haverá equipe de TI para administração do sistema
12. ✅ Treinamento de 4 horas será oferecido aos usuários
13. ✅ Suporte técnico será disponibilizado (interno ou externo)
14. ✅ Documentação técnica e funcional será produzida

**Premissas de Uso:**
15. ✅ Usuários receberão treinamento adequado antes do go-live
16. ✅ Haverá período de adaptação (convivência com planilhas)
17. ✅ Feedback dos usuários será coletado para melhorias

---

### 4.4 Restrições do Projeto

**Restrições Orçamentárias:**
1. 💰 Orçamento definido conforme disponibilidade do órgão
2. 💰 Preferência por tecnologias open-source (redução de custos de licença)
3. 💰 Desenvolvimento pode ser interno ou por empresa contratada

**Restrições de Prazo:**
4. ⏰ MVP (Minimum Viable Product) em até 3 meses
5. ⏰ Versão completa em até 6 meses
6. ⏰ Go-live alinhado com início de novo PCA (janeiro)

**Restrições Tecnológicas:**
7. 🔧 Deve atender normas de segurança da informação do Estado
8. 🔧 Compatível com infraestrutura existente
9. 🔧 Pode ser on-premise ou cloud (a definir com TI)
10. 🔧 Banco de dados: PostgreSQL ou MySQL (preferencial)

**Restrições de Recursos Humanos:**
11. 👥 Equipe de desenvolvimento: 3-5 pessoas
12. 👥 Equipe de testes: usuários do órgão + 1 QA
13. 👥 Product Owner: 1 pessoa (tempo parcial)

**Restrições Regulatórias:**
14. ⚖️ Conformidade com LGPD obrigatória
15. ⚖️ Conformidade com Decreto 9.900/2021 obrigatória
16. ⚖️ Aprovação da área jurídica necessária

**Restrições Operacionais:**
17. 🏢 Sistema deve funcionar em horário comercial (8h-18h) com alta disponibilidade
18. 🏢 Janela de manutenção: sábados, 22h às 6h
19. 🏢 Suporte: horário comercial (8h-18h)

---

### 4.5 Dependências

**Dependências Organizacionais:**
- ✋ Aprovação formal do projeto pela alta gestão
- ✋ Designação de Product Owner
- ✋ Liberação de usuários para testes (20h/pessoa)
- ✋ Alinhamento com área jurídica para validação de conformidade

**Dependências Técnicas:**
- ✋ Disponibilização de servidor/infraestrutura
- ✋ Acesso ao Active Directory (se houver integração)
- ✋ Configuração de firewall para acesso externo (se cloud)
- ✋ Certificado SSL válido

**Dependências de Dados:**
- ✋ Disponibilização de dados históricos para migração (opcional)
- ✋ Lista de elementos de despesa (SIAFI)
- ✋ Lista de unidades e centros de custo
- ✋ Cadastro de usuários (nome, CPF, matrícula, e-mail)

**Dependências de Processo:**
- ✋ Definição de fluxos de aprovação
- ✋ Definição de perfis e permissões
- ✋ Validação de metodologia com área jurídica
- ✋ Aprovação de templates de relatórios

---

### 4.6 Critérios de Aceitação do Sistema

Para o sistema ser considerado **aceito e pronto para produção**, deve atender:

**Funcionais:**
- ✅ Todos os requisitos funcionais de prioridade ALTA implementados
- ✅ 90% dos requisitos de prioridade MÉDIA implementados
- ✅ Testes de aceitação de usuário (UAT) aprovados
- ✅ Todos os bugs críticos corrigidos

**Não Funcionais:**
- ✅ Performance conforme SLA (90% das páginas < 3s)
- ✅ Disponibilidade de 99% em testes
- ✅ Testes de segurança aprovados (sem vulnerabilidades críticas)
- ✅ Acessibilidade WCAG 2.1 nível AA validada

**Documentação:**
- ✅ Manual do usuário completo
- ✅ Manual de administrador completo
- ✅ Documentação técnica (arquitetura, APIs)
- ✅ Vídeos tutoriais produzidos (mínimo 5)

**Treinamento:**
- ✅ Treinamento de usuários realizado (mínimo 80% de presença)
- ✅ Treinamento de administradores realizado
- ✅ Equipe de suporte treinada

**Conformidade:**
- ✅ Aprovação da área jurídica
- ✅ Aprovação do controle interno
- ✅ Parecer técnico de segurança da informação
- ✅ Conformidade LGPD validada

---


# PRD – Sistema de Análise de Mercado para Licitações Públicas

**Versão:** 2.0  
**Data:** Janeiro de 2026

---


5. [Requisitos Funcionais Detalhados](#5-requisitos-funcionais-detalhados)
   - 5.1 [Módulo de Gestão do PCA](#51-módulo-de-gestão-do-pca)
   - 5.2 [Módulo de Gestão de Demandas](#52-módulo-de-gestão-de-demandas)
   - 5.3 [Módulo de Análise de Mercado](#53-módulo-de-análise-de-mercado)
   - 5.4 [Módulo de Relatórios](#54-módulo-de-relatórios)
   - 5.5 [Módulo de Segurança e Auditoria](#55-módulo-de-segurança-e-auditoria)

---

## 5. Requisitos Funcionais Detalhados

### 5.1 Módulo de Gestão do PCA

#### RF-001: Cadastro do PCA

**Prioridade:** 🔴 Alta  
**Complexidade:** Baixa  
**Estimativa:** 8 horas

**Descrição:**  
O sistema deve permitir o cadastro do Plano de Contratações Anual com todos os dados necessários para controle e acompanhamento.

**Campos obrigatórios:**

| Campo | Tipo | Validação | Exemplo |
|-------|------|-----------|---------|
| Ano de referência | INT (YYYY) | 2020-2050 | 2026 |
| Número do PCA | VARCHAR(20) | Alfanumérico | PCA-2026-001 |
| Órgão responsável | VARCHAR(100) | Lista predefinida | Secretaria de Saúde |
| Situação | ENUM | 4 valores | Em elaboração |
| Data de criação | DATETIME | Automático | 2026-01-15 10:30:00 |
| Data de aprovação | DATE | Não futura | 2026-01-20 |
| Responsável | FK Usuario | Cadastrado | João Silva (mat. 12345) |
| Observações | TEXT | Opcional | - |

**Situações possíveis:**
- `em_elaboracao`: PCA sendo construído
- `aprovado`: PCA aprovado, mas ano ainda não iniciou
- `em_execucao`: Ano corrente, PCA em execução
- `encerrado`: Ano encerrado, PCA finalizado

**Regras de validação:**
1. ✅ Não permitir duplicação de PCA para o mesmo ano e órgão
2. ✅ Data de aprovação não pode ser anterior à data de criação
3. ✅ Ao mudar status para "aprovado", exigir data de aprovação obrigatória
4. ✅ Responsável deve ser um usuário cadastrado no sistema
5. ✅ Ano de referência não pode ser anterior a 2020
6. ✅ Número do PCA deve seguir padrão: PCA-[ANO]-[SEQUENCIAL]

**Regras de transição de status:**
```
em_elaboracao → aprovado → em_execucao → encerrado
       ↓              ↓            ↓
    cancelado     cancelado    cancelado
```

**Comportamentos:**
- Ao criar PCA, status inicial é sempre "em_elaboracao"
- Transição para "aprovado" requer confirmação
- Transição para "em_execucao" só é permitida se ano corrente = ano do PCA
- Não permite editar PCA "encerrado" (apenas visualizar)
- Cancela mento requer justificativa obrigatória

**Mensagens de validação:**
- ❌ "Já existe um PCA para este órgão no ano [ANO]"
- ❌ "Data de aprovação não pode ser anterior à data de criação"
- ❌ "Para aprovar o PCA, informe a data de aprovação"
- ✅ "PCA cadastrado com sucesso!"

**Critérios de aceitação:**
- [ ] Usuário consegue cadastrar novo PCA com todos os campos
- [ ] Sistema valida unicidade (ano + órgão)
- [ ] Sistema impede datas inconsistentes
- [ ] Histórico de alterações é registrado automaticamente
- [ ] Notificação é enviada ao criar/aprovar PCA

**Dependências:**
- Cadastro de usuários ativo
- Lista de órgãos configurada

---

#### RF-002: Dashboard do PCA

**Prioridade:** 🟡 Média  
**Complexidade:** Alta  
**Estimativa:** 24 horas

**Descrição:**  
O sistema deve apresentar um dashboard visual e interativo com indicadores consolidados do PCA.

**Indicadores obrigatórios:**

**1. Cards Numéricos (KPIs)**
- 📊 Total de demandas cadastradas
- 📊 Demandas por status:
  - Cadastradas
  - Em análise
  - Estimadas
  - Em contratação
  - Contratadas
- 💰 Valor total estimado (R$)
- 💰 Valor total contratado (R$)
- 📈 Taxa de execução do PCA (%)
- ⚠️ Demandas com prazo próximo (30 dias)
- 🔴 Demandas atrasadas

**2. Gráficos**

**Gráfico de Pizza: Distribuição por Status**
- Cores diferenciadas por status
- Percentual e quantidade
- Clicável (drill-down para lista)

**Gráfico de Barras: Evolução Mensal**
- Eixo X: Meses do ano
- Eixo Y: Quantidade de contratações
- Meta mensal em linha pontilhada
- Comparativo com ano anterior (opcional)

**Gráfico de Barras Horizontais: Top 5 Demandas por Valor**
- Ranking das maiores demandas
- Valor em R$
- Status (cor de fundo)

**Gráfico de Linha: Evolução do Valor Estimado vs Contratado**
- Eixo X: Linha do tempo
- Eixo Y: Valores acumulados
- Duas linhas: estimado (azul) e contratado (verde)

**3. Lista de Alertas**
```
⚠️ 3 demandas com prazo em 30 dias
   → PCA2026-001-025 | Aquisição de medicamentos | Prazo: 15 dias
   → PCA2026-001-087 | Equipamentos de TI | Prazo: 22 dias
   → PCA2026-001-156 | Manutenção predial | Prazo: 28 dias

🔴 2 demandas atrasadas
   → PCA2026-001-012 | Mobiliário | Atrasado há 5 dias
   → PCA2026-001-043 | Serviços de limpeza | Atrasado há 12 dias

💡 5 demandas inativas (> 60 dias em "Cadastrada")
```

**4. Filtros**
- Período: mês atual, trimestre, semestre, ano, personalizado
- Status: todos, específico
- Unidade demandante: todas, específica
- Valor: faixas configuráveis

**Funcionalidades:**
- ✅ Atualização em tempo real (ou botão "Atualizar")
- ✅ Exportação do dashboard em PDF (imagem dos gráficos + tabelas)
- ✅ Drill-down: clicar em gráfico abre lista filtrada
- ✅ Comparação com período anterior (toggle)
- ✅ Modo de apresentação (fullscreen)

**Performance:**
- Dashboard deve carregar em até **3 segundos**
- Gráficos devem ser interativos
- Responsivo (adaptar em tablets)

**Critérios de aceitação:**
- [ ] Todos os indicadores são exibidos corretamente
- [ ] Gráficos são interativos e responsivos
- [ ] Filtros funcionam e atualizam gráficos
- [ ] Drill-down funciona
- [ ] Dashboard carrega em < 3 segundos
- [ ] Exportação em PDF funciona

**Mockup conceitual:**
```
┌─────────────────────────────────────────────────────────┐
│ Dashboard do PCA 2026                       [Filtros ▼] │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Total     │  Em Análise │  Estimadas  │  Contratadas  │
│     45      │     12      │     18      │      10       │
├─────────────┴─────────────┴─────────────┴───────────────┤
│ Valor Estimado        │  Valor Contratado  │  Execução  │
│  R$ 12.5 milhões      │  R$ 5.2 milhões    │    41.6%   │
├──────────────────────────────┬────────────────────────────┤
│ [Gráfico Pizza: Status]      │ [Gráfico Barras: Mensal]  │
│                              │                            │
├──────────────────────────────┴────────────────────────────┤
│ ⚠️ Alertas                                                │
│ • 3 demandas com prazo próximo                           │
│ • 2 demandas atrasadas                                   │
└───────────────────────────────────────────────────────────┘
```

---

#### RF-003: Versionamento do PCA

**Prioridade:** 🟢 Baixa (Fase 2)  
**Complexidade:** Média  
**Estimativa:** 16 horas

**Descrição:**  
O sistema deve permitir controle de versões do PCA, facilitando auditoria e rastreamento de mudanças.

**Funcionalidades:**

**1. Criar Nova Versão**
- Ao editar PCA aprovado, sistema pergunta: "Criar nova versão?"
- Se SIM: salva versão atual e cria cópia editável
- Se NÃO: sobrescreve (apenas se não aprovado)
- Motivo da criação de versão é obrigatório

**2. Comparar Versões**
- Seleção de duas versões para comparar
- Visualização lado a lado (diff visual)
- Destaque de alterações:
  - 🟢 Verde: campos adicionados
  - 🔴 Vermelho: campos removidos
  - 🟡 Amarelo: campos alterados

**3. Histórico de Versões**
```
Versão | Data       | Usuário      | Motivo                    | Ações
-------|------------|--------------|---------------------------|-------
1.2    | 20/01/2026 | Maria Santos | Ajuste de valores         | [Ver] [Comparar]
1.1    | 15/01/2026 | João Silva   | Inclusão de 3 demandas    | [Ver] [Comparar]
1.0    | 10/01/2026 | João Silva   | Versão inicial            | [Ver]
```

**4. Restaurar Versão**
- Permite restaurar versão anterior
- Cria nova versão (não sobrescreve)
- Requer justificativa
- Requer confirmação (ação irreversível)

**Regras:**
- Versionamento automático ao mudar status para "aprovado"
- Versões são imutáveis (não podem ser editadas)
- Versão ativa sempre é a mais recente
- Todas as versões são preservadas (não há exclusão)

**Critérios de aceitação:**
- [ ] Sistema cria versão automaticamente ao aprovar
- [ ] Usuário consegue criar versão manualmente
- [ ] Comparação entre versões é clara
- [ ] Histórico é completo e inalterável
- [ ] Restauração funciona corretamente

---

### 5.2 Módulo de Gestão de Demandas

#### RF-004: Cadastro de Demandas

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 16 horas

**Descrição:**  
O sistema deve permitir cadastro completo de demandas vinculadas ao PCA.

**Formulário de Cadastro:**

**Seção 1: Identificação**
```
PCA: [Dropdown: PCA2026-001 - Secretaria de Saúde]
Número do Projeto: [Auto: 244] (sequencial)
Código da Demanda: [Auto gerado: PCA2026-001-244]
```

**Seção 2: Descrição**
```
Descrição da Demanda: [Textarea, 50-500 caracteres]
Exemplo: "Aquisição de papel A4 para atender as necessidades 
administrativas da secretaria durante o exercício de 2026"

Justificativa Técnica: [Textarea, 100+ caracteres, editor rico]
Exemplo: "O consumo médio mensal é de 100 resmas..."

Justificativa Administrativa: [Textarea, 100+ caracteres]
Exemplo: "A contratação é necessária para manutenção das 
atividades administrativas..."
```

**Seção 3: Valores e Prazos**
```
Valor Estimado Global: [R$ 0,00] (opcional, calculado dos itens)
Data Prevista de Contratação: [Date picker]
Prazo de Vigência: [Number] meses
```

**Seção 4: Classificação**
```
Tipo de Contratação:
( ) Nova contratação
( ) Renovação
( ) Prorrogação
( ) Adesão a ata
( ) Dispensa de licitação
( ) Inexigibilidade

Natureza da Despesa:
( ) Investimento
( ) Custeio

Elemento de Despesa: [Dropdown com pesquisa]
Ex: 3.3.90.30 - Material de Consumo
```

**Seção 5: Vinculações**
```
Unidade Demandante: [Dropdown]
Responsável pela Demanda: [Autocomplete usuário]
Centro de Custo: [Input, máscara]
Fonte de Recursos: [Input, opcional]
Programa/Ação: [Input, opcional]
```

**Seção 6: Complementares**
```
CNAE: [Input, opcional]
Processo Administrativo: [Input, opcional]
Observações: [Textarea, opcional]
```

**Seção 7: Anexos**
```
[Área de Upload - Drag and Drop]
Formatos aceitos: PDF, DOCX, XLSX, JPG, PNG
Tamanho máximo: 10 MB por arquivo
Anexos: TR, ETP, Estudos Técnicos, etc.

Anexos:
[📄] Termo_Referencia_v1.pdf (2.5 MB) [Visualizar] [Excluir]
[📄] Estudo_Tecnico.docx (1.2 MB) [Visualizar] [Excluir]
```

**Código da Demanda (geração automática):**
```javascript
Formato: PCA[Ano]-[NúmeroPCA com 3 dígitos]-[NúmeroProjeto com 3 dígitos]
Exemplos:
- PCA2026-001-001
- PCA2026-001-244
- PCA2026-002-015
```

**Regras de validação:**

| Campo | Regra | Mensagem de Erro |
|-------|-------|------------------|
| Descrição | 50-500 caracteres, sem apenas números | "Descrição deve ter entre 50 e 500 caracteres" |
| Justificativa Técnica | Mínimo 100 caracteres | "Justificativa técnica deve ter no mínimo 100 caracteres" |
| Data Prevista | Não pode ser passada | "Data prevista não pode ser anterior a hoje" |
| Valor Estimado | Se informado, > 0 | "Valor deve ser maior que zero" |
| Responsável | Deve existir no sistema | "Selecione um responsável válido" |
| Centro de Custo | Deve estar ativo | "Centro de custo inativo ou inválido" |

**Comportamentos especiais:**

**Duplicação de Demanda:**
- Botão "Duplicar" em demanda existente
- Copia todos os campos exceto: número projeto, datas
- Pergunta: "Deseja copiar os itens também?"
- Se SIM: copia itens mas NÃO copia preços

**Validação de CNPJ (fornecedor):**
- Se campo CNAE preenchido, aplicar máscara
- Validar dígitos verificadores
- Exibir mensagem se inválido

**Auto-save:**
- Sistema salva rascunho automaticamente a cada 2 minutos
- Indica no topo: "💾 Rascunho salvo às 14:32"
- Permite recuperar rascunho em caso de fechamento acidental

**Critérios de aceitação:**
- [ ] Formulário valida todos os campos conforme regras
- [ ] Código único é gerado automaticamente e corretamente
- [ ] Upload de anexos funciona (múltiplos arquivos)
- [ ] Duplicação de demanda funciona
- [ ] Auto-save funciona
- [ ] Histórico registra criação da demanda

---

#### RF-005: Controle de Status da Demanda

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 16 horas

**Descrição:**  
O sistema deve controlar o ciclo de vida completo da demanda com transições validadas.

**Diagrama de Estados:**

```
┌──────────────┐
│  Cadastrada  │ ←── Estado inicial ao criar demanda
└──────┬───────┘
       │ (automático ao adicionar 1º item)
       ↓
┌──────────────┐
│  Em Análise  │ ←── Análise de mercado em andamento
└──────┬───────┘
       │ (quando todos itens tiverem ≥3 preços)
       ↓
┌──────────────┐
│   Estimada   │ ←── Análise concluída, valor definido
└──────┬───────┘
       │ (manual, perfil Gestor)
       ↓
┌────────────────┐
│ Em Contratação │ ←── Processo licitatório iniciado
└────────┬───────┘
         │ (manual, perfil Gestor + nº processo)
         ↓
  ┌──────────────┐
  │  Contratada  │ ←── Contrato assinado
  └──────────────┘

  De qualquer estado:
  ↓
  ┌──────────────┐
  │  Cancelada   │ ←── Requer justificativa
  └──────────────┘
  
  ┌──────────────┐
  │   Suspensa   │ ←── Requer justificativa
  └──────────────┘
```

**Matriz de Transições Permitidas:**

| De \ Para | Cadastrada | Em Análise | Estimada | Em Contratação | Contratada | Cancelada | Suspensa |
|-----------|-----------|-----------|----------|---------------|-----------|-----------|----------|
| **Cadastrada** | - | ✅ Auto | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Em Análise** | ❌ | - | ✅ Auto | ❌ | ❌ | ✅ | ✅ |
| **Estimada** | ❌ | ❌ | - | ✅ Manual | ❌ | ✅ | ✅ |
| **Em Contratação** | ❌ | ❌ | ❌ | - | ✅ Manual | ✅ | ✅ |
| **Contratada** | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ |
| **Cancelada** | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ |
| **Suspensa** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | - |

**Regras de Transição:**

**1. Cadastrada → Em Análise (AUTOMÁTICA)**
- Trigger: Ao cadastrar o primeiro item da demanda
- Sem necessidade de confirmação do usuário
- Registra no log: "Status alterado automaticamente para 'Em Análise'"

**2. Em Análise → Estimada (AUTOMÁTICA)**
- Trigger: Quando TODOS os itens tiverem:
  - Mínimo 3 preços cadastrados
  - Pelo menos 1 preço classificado como "Aceito"
- Sistema exibe notificação: "✅ Análise de mercado concluída! Demanda movida para 'Estimada'"
- Se condições não atendidas, exibe alerta: "⚠️ Ainda faltam itens com análise incompleta"

**3. Estimada → Em Contratação (MANUAL)**
- Requer: Perfil Gestor
- Confirmação: Modal com resumo da demanda
- Campo obrigatório: Número do processo licitatório
- Botão: "Iniciar Contratação"

**4. Em Contratação → Contratada (MANUAL)**
- Requer: Perfil Gestor
- Campos obrigatórios:
  - Número do contrato
  - Data de assinatura
  - Valor contratado (R$)
  - Fornecedor contratado (CNPJ + Razão Social)
- Confirmação: "Confirma a contratação da demanda [código]?"
- Após contratação: demanda fica bloqueada para edição

**5. Qualquer → Cancelada (MANUAL)**
- Requer: Perfil Gestor
- Modal de cancelamento:
  ```
  ⚠️ Cancelar Demanda
  
  Tem certeza que deseja cancelar a demanda PCA2026-001-244?
  Esta ação não pode ser desfeita.
  
  Motivo do Cancelamento: [Dropdown]
  - Falta de orçamento
  - Mudança de prioridade
  - Item não mais necessário
  - Erro no cadastro
  - Outro (especificar)
  
  Justificativa (obrigatório, mín. 50 caracteres):
  [Textarea]
  
  [Cancelar] [Confirmar Cancelamento]
  ```
- Após cancelamento: demanda fica somente leitura

**6. Qualquer → Suspensa (MANUAL)**
- Similar ao cancelamento
- Diferença: pode ser reativada posteriormente
- Suspensa pode voltar ao status anterior

**Dados Registrados em Cada Transição:**

```sql
CREATE TABLE demanda_historico_status (
    id INT PRIMARY KEY,
    demanda_id INT,
    status_anterior VARCHAR(20),
    status_novo VARCHAR(20),
    usuario_id INT,
    data_hora DATETIME,
    tipo_transicao VARCHAR(20), -- 'automatica' ou 'manual'
    justificativa TEXT,
    dados_adicionais JSON, -- Ex: nº processo, nº contrato
    ip VARCHAR(45)
);
```

**Notificações Automáticas:**

| Evento | Destinatários | Canal | Conteúdo |
|--------|--------------|-------|----------|
| Mudança de status | Responsável + Gestor | E-mail + In-app | Status mudou de X para Y |
| Faltam 30 dias para prazo | Responsável + Gestor | E-mail + In-app | Demanda [código] vence em 30 dias |
| Prazo vencido | Responsável + Gestor + Alta Gestão | E-mail | Demanda [código] está atrasada |
| Análise concluída | Gestor | E-mail + In-app | Demanda pronta para contratação |
| Cancelamento/Suspensão | Todos envolvidos | E-mail | Demanda foi cancelada/suspensa |

**Configuração de Notificações (por usuário):**
```
Minhas Notificações:
☑️ Mudanças de status nas minhas demandas
☑️ Alertas de prazo (30 dias)
☑️ Alertas de atraso
☐ Notificações de demandas de outras unidades
☑️ Resumo diário (e-mail às 8h)
☐ Resumo semanal (e-mail segunda-feira)
```

**Visualização de Status:**
- Badge colorido:
  - 🔵 Cadastrada (azul)
  - 🟡 Em Análise (amarelo)
  - 🟢 Estimada (verde)
  - 🟠 Em Contratação (laranja)
  - ✅ Contratada (verde escuro, com ✓)
  - ❌ Cancelada (vermelho, com ✗)
  - ⏸️ Suspensa (cinza)

**Linha do Tempo (Timeline):**
```
Histórico de Status da Demanda PCA2026-001-244

🔵 15/01/2026 10:32  Cadastrada
   Por João Silva
   
🟡 15/01/2026 11:05  Em Análise
   Transição automática ao adicionar primeiro item
   
🟢 20/01/2026 14:18  Estimada
   Análise de mercado concluída automaticamente
   Valor estimado: R$ 18.500,00
   
🟠 25/01/2026 09:00  Em Contratação
   Por Maria Santos (Gestor)
   Processo: 2026.001.000123-5
   
✅ 10/02/2026 15:45  Contratada
   Por Maria Santos (Gestor)
   Contrato: 2026/0045
   Valor: R$ 17.800,00
   Fornecedor: Empresa XYZ Ltda (CNPJ 12.345.678/0001-99)
```

**Critérios de aceitação:**
- [ ] Transições automáticas funcionam corretamente
- [ ] Transições manuais respeitam permissões
- [ ] Justificativa é obrigatória para cancelamento/suspensão
- [ ] Notificações são enviadas conforme configuração
- [ ] Histórico completo é registrado
- [ ] Timeline visual está clara e precisa

---

#### RF-006: Comentários e Colaboração

**Prioridade:** 🟢 Baixa (Fase 2)  
**Complexidade:** Baixa  
**Estimativa:** 8 horas

**Descrição:**  
Permitir que usuários colaborem através de comentários na demanda.

**Funcionalidades:**

**1. Adicionar Comentário**
```
┌─────────────────────────────────────────────────────────┐
│ Comentários (3)                          [+ Adicionar]  │
├─────────────────────────────────────────────────────────┤
│ 👤 Maria Santos (Gestor) - 20/01/2026 14:22            │
│    Priorizar esta demanda para contratação em fevereiro│
│    [Responder] [Editar] [Excluir]                      │
│                                                         │
│    └─ 👤 João Silva - 20/01/2026 15:10                 │
│       Ok, vou agilizar a análise de mercado.           │
│       [Responder] [Editar] [Excluir]                   │
├─────────────────────────────────────────────────────────┤
│ 👤 João Silva - 15/01/2026 11:30                       │
│    Demanda criada. Iniciando análise de mercado.       │
│    [Responder] [Editar] [Excluir]                      │
└─────────────────────────────────────────────────────────┘
```

**2. Notificações**
- Comentário menciona usuário com @: notifica
  - Exemplo: "@maria.santos pode revisar?"
- Resposta a comentário: notifica autor do comentário original

**3. Permissões**
- Qualquer usuário com acesso à demanda pode comentar
- Editar/excluir: apenas autor ou Admin
- Tempo para edição: até 24h após publicação

**Critérios de aceitação:**
- [ ] Comentários são salvos corretamente
- [ ] Respostas são aninhadas
- [ ] Menções com @ funcionam
- [ ] Notificações são enviadas
- [ ] Edição/exclusão respeita permissões

---

### 5.3 Módulo de Análise de Mercado

#### RF-007: Cadastro de Itens

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 12 horas

**Descrição:**  
Permitir cadastro detalhado de itens que compõem a demanda.

**Formulário de Item:**

```
┌─────────────────────────────────────────────────────────┐
│ Adicionar Item à Demanda PCA2026-001-244               │
├─────────────────────────────────────────────────────────┤
│ Código do Item: [Auto: 001] (sequencial)               │
│                                                         │
│ Descrição Detalhada*: [Textarea, 30-1000 chars]       │
│ Ex: "Papel sulfite A4, 75g/m², branco, formato        │
│ 210x297mm, pacote com 500 folhas"                     │
│                                                         │
│ [💡 Sugestões do catálogo]                            │
│ • Papel A4 75g branco (usado em 15 demandas)          │
│ • Papel A4 90g branco (usado em 8 demandas)           │
│                                                         │
│ Especificações Técnicas: [Editor rico, opcional]       │
│ (Formatação: negrito, itálico, listas, tabelas)        │
│                                                         │
│ Unidade de Medida*: [Dropdown com busca]               │
│ [Resma        ▼]                                       │
│ Opções: kg, litro, unidade, resma, caixa, m², m³...   │
│                                                         │
│ Quantidade*: [Number, 3 decimais]                      │
│ [500,000]                                               │
│                                                         │
│ Elemento de Despesa*: [Dropdown com busca]             │
│ [3.3.90.30 - Material de Consumo ▼]                   │
│                                                         │
│ Marca de Referência: [Input, opcional]                 │
│ [Report, Chamex ou similar]                             │
│                                                         │
│ Código CATMAT/CATSER: [Input, opcional]                │
│ [     ]                                                 │
│                                                         │
│ Observações: [Textarea, opcional]                       │
│                                                         │
│ Anexos Técnicos: [Drag & Drop]                        │
│ (Catálogos, especificações, fotos)                     │
│                                                         │
│ [💾 Salvar e Adicionar Preços] [❌ Cancelar]           │
└─────────────────────────────────────────────────────────┘
```

**Catálogo Reutilizável:**

Sistema mantém biblioteca de itens já cadastrados:

```javascript
// Ao digitar "Papel A4", sistema sugere:
Sugestões do Catálogo (clique para usar):

1. ⭐ Papel A4 75g branco (usado 15x)
   Última análise: 12/2025 | Valor: R$ 18,50/resma

2. Papel A4 90g branco (usado 8x)
   Última análise: 11/2025 | Valor: R$ 22,00/resma

3. Papel A4 75g reciclado (usado 3x)
   Última análise: 10/2025 | Valor: R$ 20,00/resma
```

**Campos Obrigatórios (*):**
- Descrição (30-1000 caracteres)
- Unidade de medida
- Quantidade (> 0)
- Elemento de despesa

**Validações:**

| Campo | Regra | Erro |
|-------|-------|------|
| Descrição | Não duplicada na mesma demanda | "Item com descrição similar já existe nesta demanda" |
| Descrição | Não pode ser apenas números | "Descrição deve conter texto descritivo" |
| Quantidade | > 0, até 3 decimais | "Quantidade deve ser maior que zero" |
| Unidade | Deve existir na lista | "Selecione uma unidade válida" |

**Funcionalidades Especiais:**

**1. Importação em Lote (CSV/XLSX)**
```
[📤 Importar Itens]

Baixe o modelo: [📄 modelo_itens.xlsx]

Formato esperado:
| Descrição | Unidade | Quantidade | Elem. Despesa | Observações |
|-----------|---------|------------|---------------|-------------|
| Papel A4  | Resma   | 500        | 3.3.90.30     | Branco 75g  |
| ...       |         |            |               |             |

[Selecionar Arquivo] [Importar]

Resultado:
✅ 15 itens importados com sucesso
⚠️ 2 itens com avisos (revisar descrição)
❌ 1 item com erro (unidade inválida)
```

**2. Duplicação de Item**
- Dentro da mesma demanda: copia tudo, incrementa código
- De outra demanda: copia tudo exceto preços

**3. Histórico de Preços**
```
[💰 Ver Histórico de Preços]

Histórico: Papel A4 75g branco

📊 Análises Anteriores (últimas 5):
┌────────────┬──────────┬─────────────┬──────────────┐
│ Demanda    │ Data     │ Mediana     │ Qnt. Preços  │
├────────────┼──────────┼─────────────┼──────────────┤
│ PCA2025-001│ 12/2025  │ R$ 18,50    │ 5            │
│ PCA2025-087│ 10/2025  │ R$ 18,00    │ 4            │
│ PCA2024-156│ 08/2025  │ R$ 17,80    │ 6            │
└────────────┴──────────┴─────────────┴──────────────┘

[Gráfico de Evolução Temporal]
```

**Critérios de aceitação:**
- [ ] Formulário valida todos os campos
- [ ] Código do item é único dentro da demanda
- [ ] Sugestões do catálogo são relevantes
- [ ] Importação em lote funciona
- [ ] Duplicação funciona corretamente
- [ ] Histórico de preços é exibido

---

#### RF-008: Registro de Preços de Mercado

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 16 horas

**Descrição:**  
Permitir registro de múltiplos preços por item com evidências.

**Formulário de Preço:**

```
┌──────────────────────────────────────────────────────────┐
│ Adicionar Preço - Item 001: Papel A4 75g               │
├──────────────────────────────────────────────────────────┤
│ Fonte do Preço*:                                        │
│ [Empresa ABC Papelaria Ltda                    ]        │
│                                                          │
│ Tipo da Fonte*: [Dropdown]                              │
│ [Fornecedor (orçamento direto)              ▼]         │
│ Opções:                                                  │
│ • Fornecedor (orçamento direto)                         │
│ • ComprasNet (Painel de Preços)                         │
│ • Banco de Preços (estadual/municipal)                  │
│ • Ata de Registro de Preços                             │
│ • Contrato vigente                                       │
│ • Nota Fiscal                                            │
│ • Outro (especificar)                                    │
│                                                          │
│ Valor Unitário*: [Moeda]                                │
│ R$ [18,50]                                               │
│                                                          │
│ Data da Coleta*: [Date picker]                          │
│ [15/01/2026]  ℹ️ Não pode ser futura                   │
│                                                          │
│ Unidade: [Auto: Resma] (do item)                        │
│                                                          │
│ ──────────────────────────────────────────              │
│ Dados do Fornecedor (opcional mas recomendado)          │
│                                                          │
│ CNPJ: [12.345.678/0001-99] 🔍 ✅ Válido                │
│ Razão Social: [Auto: Empresa ABC Papelaria Ltda]        │
│ Cidade/UF: [Goiânia - GO                       ]        │
│ Telefone: [(62) 3333-4444                      ]        │
│ E-mail: [contato@empresaabc.com.br             ]        │
│                                                          │
│ ──────────────────────────────────────────              │
│ Referências (opcional)                                   │
│                                                          │
│ Nº Processo/Contrato/Ata: [                    ]        │
│ Link da Fonte: [                               ]        │
│                                                          │
│ Observações: [Textarea]                                 │
│ Ex: "Preço válido por 30 dias conforme orçamento"      │
│                                                          │
│ ──────────────────────────────────────────              │
│ Anexos (OBRIGATÓRIO)*:                                  │
│ [📎 Drag & Drop ou Clique para Selecionar]              │
│                                                          │
│ Anexos (0/5):                                            │
│ (nenhum anexo ainda)                                     │
│                                                          │
│ ⚠️ É obrigatório anexar pelo menos 1 evidência         │
│ (print, orçamento, proposta, etc.)                      │
│                                                          │
│ [💾 Salvar Preço] [❌ Cancelar]                          │
└──────────────────────────────────────────────────────────┘
```

**Após Adicionar Preço:**

```
┌──────────────────────────────────────────────────────────┐
│ Item 001: Papel A4 75g                                  │
│ Quantidade: 500 resmas                                   │
├──────────────────────────────────────────────────────────┤
│ Preços Coletados (3/mínimo 3) ✅                        │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🟢 ACEITO | R$ 18,50                             │   │
│ │ Fonte: Empresa ABC Papelaria                     │   │
│ │ Tipo: Fornecedor | Data: 15/01/2026              │   │
│ │ CNPJ: 12.345.678/0001-99                         │   │
│ │ Anexos: [📄 orcamento_abc.pdf]                  │   │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Detalhes]         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🟢 ACEITO | R$ 18,00                             │   │
│ │ Fonte: ComprasNet                                │   │
│ │ Tipo: Painel de Preços | Data: 10/01/2026       │   │
│ │ Anexos: [📄 print_comprasnet.jpg]               │   │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Detalhes]         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🔴 ACIMA DO LIMITE | R$ 25,00                    │   │
│ │ ⚠️ Este preço está 35% acima da mediana         │   │
│ │ Fonte: Empresa XYZ Ltda                          │   │
│ │ Tipo: Fornecedor | Data: 12/01/2026              │   │
│ │ Anexos: [📄 orcamento_xyz.pdf]                  │   │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Detalhes]         │   │
│ │ [⚙️ Justificar Inclusão] (requer aprovação)      │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ [➕ Adicionar Novo Preço]                               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📊 Cálculos Estatísticos (atualizados em tempo real)   │
│                                                          │
│ Média:     R$ 20,50                                      │
│ Mediana:   R$ 18,50  ⭐ (Valor de Referência)           │
│ Desvio:    R$ 3,78                                       │
│                                                          │
│ Limites de Aceitação (±25% da mediana):                 │
│ Inferior:  R$ 13,88  (18,50 - 25%)                      │
│ Superior:  R$ 23,13  (18,50 + 25%)                      │
│                                                          │
│ Preços Válidos: 2 de 3 (66,7%)                          │
│                                                          │
│ 💰 Valor Estimado Unitário: R$ 18,50 (mediana)         │
│ 💰 Valor Estimado Total: R$ 9.250,00 (500 × 18,50)     │
└──────────────────────────────────────────────────────────┘
```

**Validações e Alertas:**

| Validação | Tipo | Mensagem |
|-----------|------|----------|
| Valor unitário ≤ 0 | ❌ Bloqueio | "Valor deve ser maior que zero" |
| Data futura | ❌ Bloqueio | "Data não pode ser futura" |
| Data > 12 meses | 🔴 Bloqueio | "Preço com mais de 12 meses não é aceito" |
| Data > 6 meses | 🟠 Alerta | "Preço com mais de 6 meses. Considere coletar preço mais recente" |
| CNPJ inválido | 🟠 Alerta | "CNPJ inválido. Verifique os dígitos" |
| Sem anexo | ❌ Bloqueio | "Anexe pelo menos 1 evidência (print, orçamento, etc.)" |
| < 3 preços no item | 🟠 Alerta | "⚠️ Faltam [X] preços para completar análise (mínimo 3)" |
| Preço muito discrepante | 🟠 Alerta | "Preço está [X]% acima/abaixo da média atual. Confirma?" |

**Anexos:**

**Formatos aceitos:**
- PDF, JPG, JPEG, PNG, XLSX, DOCX

**Tamanho:**
- Máximo 10 MB por arquivo
- Máximo 5 arquivos por preço

**Upload:**
- Drag & drop
- Clique para selecionar
- Barra de progresso

**Armazenamento:**
- Nome original preservado para exibição
- Nome físico: UUID + extensão
- Hash MD5 para integridade
- Metadata: tamanho, tipo MIME, data upload

**Visualização:**
- PDF: visualizador inline
- Imagens: modal com zoom
- Outros: download

**Critérios de aceitação:**
- [ ] Formulário valida todos os campos
- [ ] CNPJ é validado corretamente
- [ ] Upload de anexos funciona (múltiplos)
- [ ] Classificação automática funciona
- [ ] Alertas são exibidos corretamente
- [ ] Cálculos são atualizados em tempo real

---



# PRD – Sistema de Análise de Mercado para Licitações Públicas

**Versão:** 2.0  
**Data:** Janeiro de 2026

---


5. [Requisitos Funcionais (Continuação)](#5-requisitos-funcionais-continuação)
   - 5.3 [Módulo de Análise de Mercado (Continuação)](#53-módulo-de-análise-de-mercado-continuação)
   - 5.4 [Módulo de Relatórios](#54-módulo-de-relatórios)
   - 5.5 [Módulo de Segurança e Auditoria](#55-módulo-de-segurança-e-auditoria)
6. [Requisitos Não Funcionais](#6-requisitos-não-funcionais)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Fluxos de Trabalho](#8-fluxos-de-trabalho)

---

## 5. Requisitos Funcionais (Continuação)

### 5.3 Módulo de Análise de Mercado (Continuação)

#### RF-009: Cálculo Estatístico Automático

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 12 horas

**Descrição:**  
Sistema deve calcular automaticamente todos os indicadores estatísticos necessários para validação dos preços.

**Cálculos Obrigatórios:**

**1. Média Aritmética**
```javascript
média = (Σ preços) / quantidade de preços

Exemplo:
Preços: [18.00, 18.50, 19.00, 25.00]
Média = (18 + 18.5 + 19 + 25) / 4 = 20.125
Resultado exibido: R$ 20,13
```

**2. Mediana (Valor de Referência)**
```javascript
// Ordenar preços em ordem crescente
preços_ordenados = [18.00, 18.50, 19.00, 25.00]

// Se quantidade ímpar: valor central
// Se quantidade par: média dos dois valores centrais

Quantidade par (4 valores):
mediana = (18.50 + 19.00) / 2 = 18.75
Resultado: R$ 18,75

Quantidade ímpar (3 valores): [18.00, 18.50, 19.00]
mediana = 18.50
Resultado: R$ 18,50
```

**3. Limite Inferior (25% abaixo da mediana)**
```javascript
limite_inferior = mediana × 0.75
// ou
limite_inferior = mediana - (mediana × 0.25)

Exemplo (mediana = 18.75):
limite_inferior = 18.75 × 0.75 = 14.0625
Resultado: R$ 14,06
```

**4. Limite Superior (25% acima da mediana)**
```javascript
limite_superior = mediana × 1.25
// ou
limite_superior = mediana + (mediana × 0.25)

Exemplo (mediana = 18.75):
limite_superior = 18.75 × 1.25 = 23.4375
Resultado: R$ 23,44
```

**5. Desvio Padrão (Informativo)**
```javascript
// Calcular variância
variância = Σ(xi - μ)² / n

// Desvio padrão = raiz quadrada da variância
desvio_padrão = √variância

Exemplo:
Preços: [18.00, 18.50, 19.00, 25.00]
Média (μ): 20.125

Variância:
(18 - 20.125)² = 4.515625
(18.5 - 20.125)² = 2.640625
(19 - 20.125)² = 1.265625
(25 - 20.125)² = 23.765625
Soma = 32.1875
Variância = 32.1875 / 4 = 8.046875

Desvio = √8.046875 = 2.837
Resultado: R$ 2,84
```

**6. Quantidade de Preços Válidos**
```javascript
// Contar preços dentro do intervalo [limite_inferior, limite_superior]

Exemplo:
Limites: [14.06, 23.44]
Preços: [18.00✅, 18.50✅, 19.00✅, 25.00❌]
Válidos: 3 de 4 (75%)
```

**7. Menor e Maior Preço**
```javascript
menor = MIN(preços) = 18.00
maior = MAX(preços) = 25.00
amplitude = maior - menor = 7.00
```

**Apresentação Visual:**

```
┌─────────────────────────────────────────────────────────┐
│ 📊 ESTATÍSTICAS DO ITEM                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💰 Valor de Referência (Mediana)                      │
│     R$ 18,75                                            │
│                                                         │
│  📈 Intervalo de Aceitação (±25%)                      │
│     Mínimo: R$ 14,06  ━━━━━━━━━━━━━━  Máximo: R$ 23,44│
│                        ↑                                │
│                     Mediana                             │
│                                                         │
│  📊 Estatísticas Complementares                         │
│     Média Aritmética:  R$ 20,13                        │
│     Desvio Padrão:     R$ 2,84                         │
│     Menor Preço:       R$ 18,00                        │
│     Maior Preço:       R$ 25,00                        │
│     Amplitude:         R$ 7,00                         │
│                                                         │
│  ✅ Preços Válidos: 3 de 4 (75%)                       │
│                                                         │
│  💰 VALOR ESTIMADO                                      │
│     Unitário: R$ 18,75 (mediana dos aceitos)          │
│     Total:    R$ 9.375,00 (500 × R$ 18,75)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Gráfico de Dispersão:**

```
Dispersão dos Preços Coletados

R$ 26 │                                    ❌ (25.00)
     │
R$ 24 │                                ┌────┐
     │                                │    │ Limite
R$ 22 │                                │    │ Superior
     │                                └────┘ (23.44)
R$ 20 │
     │                        ✓ (19.00)
R$ 18 │           ━━━━━━━━━━━━━━━━━━━━━ Mediana (18.75)
     │        ✓ (18.50)
R$ 16 │     ✓ (18.00)
     │
R$ 14 │                            ┌────┐
     │                            │    │ Limite
R$ 12 │                            │    │ Inferior
     │                            └────┘ (14.06)
R$ 10 │
     └───────────────────────────────────────
        Preço 1  Preço 2  Preço 3  Preço 4
```

**Momento do Cálculo:**
- ⚡ Automático e em tempo real
- ⚡ A cada inclusão de preço
- ⚡ A cada edição de preço
- ⚡ A cada exclusão de preço
- ⚡ Exibido imediatamente na interface (< 1 segundo)

**Arredondamento:**
- 2 casas decimais para valores monetários
- Usar arredondamento matemático (0.5 arredonda para cima)

**Tratamento de Casos Especiais:**

| Caso | Comportamento |
|------|---------------|
| Apenas 1 preço | Não calcular estatísticas. Alertar: "Adicione mais preços" |
| Apenas 2 preços | Calcular, mas alertar: "Recomendado mínimo 3 preços" |
| Todos preços iguais | Desvio = 0. Mediana = valor único |
| Preço = 0 | Não permitir (validação no cadastro) |
| Preço negativo | Não permitir (validação no cadastro) |

**Critérios de aceitação:**
- [ ] Cálculos são precisos (testados com casos de teste)
- [ ] Atualização é em tempo real
- [ ] Interface exibe valores de forma clara
- [ ] Fórmulas são documentadas no código
- [ ] Casos especiais são tratados
- [ ] Performance: cálculo em < 100ms para até 100 preços

---

#### RF-010: Validação e Classificação de Preços

**Prioridade:** 🔴 Alta  
**Complexidade:** Baixa  
**Estimativa:** 8 horas

**Descrição:**  
Sistema deve classificar automaticamente cada preço conforme o intervalo aceitável.

**Classificações:**

```
┌───────────────────────────────────────────────────────────┐
│ CLASSIFICAÇÃO DE PREÇOS                                   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  🟢 ACEITO                                                │
│     Condição: limite_inferior ≤ preço ≤ limite_superior  │
│     Cor: Verde (#28A745)                                  │
│     Ícone: ✅                                             │
│     Badge: "ACEITO"                                       │
│     Ação: Compõe o valor estimado                        │
│                                                           │
│  🟡 ABAIXO DO LIMITE                                      │
│     Condição: preço < limite_inferior                     │
│     Cor: Laranja (#FFA500)                                │
│     Ícone: ⚠️                                             │
│     Badge: "ABAIXO DO LIMITE"                             │
│     Ação: Não compõe o valor estimado                    │
│     Alerta: "Preço X% abaixo do limite inferior"         │
│                                                           │
│  🔴 ACIMA DO LIMITE                                       │
│     Condição: preço > limite_superior                     │
│     Cor: Vermelho (#DC3545)                               │
│     Ícone: ❌                                             │
│     Badge: "ACIMA DO LIMITE"                              │
│     Ação: Não compõe o valor estimado                    │
│     Alerta: "Preço X% acima do limite superior"          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Exemplo Visual na Tabela:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Preços Coletados (4)                          Limites: R$ 14,06 - 23,44 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ✅ ACEITO | R$ 18,00                                              │ │
│ │ Fonte: Empresa ABC | Tipo: Fornecedor | Data: 15/01/2026         │ │
│ │ Está 0,75% abaixo da mediana (dentro do intervalo aceitável)     │ │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Ver Detalhes]                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ✅ ACEITO | R$ 18,50                                              │ │
│ │ Fonte: ComprasNet | Tipo: Painel de Preços | Data: 10/01/2026    │ │
│ │ Está 1,33% abaixo da mediana (dentro do intervalo aceitável)     │ │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Ver Detalhes]                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ✅ ACEITO | R$ 19,00                                              │ │
│ │ Fonte: Empresa DEF | Tipo: Fornecedor | Data: 12/01/2026         │ │
│ │ Está 1,33% acima da mediana (dentro do intervalo aceitável)      │ │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Ver Detalhes]                       │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ❌ ACIMA DO LIMITE | R$ 25,00                                     │ │
│ │ ⚠️ Este preço está 33,33% ACIMA do limite superior               │ │
│ │ Fonte: Empresa XYZ | Tipo: Fornecedor | Data: 13/01/2026         │ │
│ │ ⚠️ Este preço NÃO será usado no cálculo do valor estimado       │ │
│ │ [✏️ Editar] [🗑️ Excluir] [👁️ Ver Detalhes]                       │ │
│ │ [⚙️ Justificar Inclusão] (requer aprovação de Gestor)            │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**

**1. Filtros**
```
Filtrar por: [Todos ▼]
Opções:
- Todos (4)
- Aceitos (3) 🟢
- Abaixo do limite (0) 🟡
- Acima do limite (1) 🔴
```

**2. Ordenação**
```
Ordenar por: [Data (mais recente) ▼]
Opções:
- Data (mais recente)
- Data (mais antiga)
- Valor (menor)
- Valor (maior)
- Classificação
- Fonte (A-Z)
```

**3. Exportação Seletiva**
```
[📥 Exportar]
- Apenas aceitos (3 preços)
- Apenas rejeitados (1 preço)
- Todos (4 preços)
Formato: [XLSX ▼] [PDF] [CSV]
```

**4. Inclusão Excepcional de Preço Rejeitado**

Se preço está fora do intervalo, usuário pode solicitar inclusão excepcional:

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Justificar Inclusão de Preço Fora do Intervalo      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Preço: R$ 25,00                                         │
│ Fonte: Empresa XYZ Ltda                                 │
│                                                         │
│ Situação:                                               │
│ • Mediana: R$ 18,75                                     │
│ • Limite superior: R$ 23,44                             │
│ • Este preço está 33,33% ACIMA do limite                │
│                                                         │
│ Motivo da Inclusão: [Dropdown]                          │
│ - Especificidade técnica do produto                     │
│ - Única opção disponível no mercado                     │
│ - Urgência da contratação                               │
│ - Outro (descrever)                                     │
│                                                         │
│ Justificativa Detalhada* (mín. 100 caracteres):        │
│ [Textarea]                                              │
│                                                         │
│ ⚠️ Esta solicitação será enviada para aprovação        │
│    do Gestor: [Maria Santos]                            │
│                                                         │
│ [❌ Cancelar] [✅ Solicitar Aprovação]                  │
└─────────────────────────────────────────────────────────┘
```

**Fluxo de Aprovação:**
1. Operador justifica inclusão
2. Sistema envia notificação para Gestor
3. Gestor recebe e-mail + notificação in-app
4. Gestor avalia e aprova/rejeita
5. Se aprovado: preço é marcado como "aceito (excepcional)"
6. Sistema registra tudo no log de auditoria

**Regras:**
- ❌ Preços fora do intervalo **não** compõem valor estimado (exceto se aprovados)
- ⚠️ Sistema alerta se não houver preços aceitos suficientes (< 3)
- 📊 Percentual de variação é calculado em relação à mediana
- 🔒 Apenas Gestor pode aprovar inclusão excepcional
- 📝 Justificativa é obrigatória e fica visível no relatório

**Alertas ao Usuário:**

```javascript
// Se todos os preços estão fora do intervalo:
⚠️ ATENÇÃO: Nenhum preço está dentro do intervalo aceitável!
   Recomendações:
   • Colete mais preços
   • Revise os preços coletados
   • Consulte o Gestor

// Se apenas 1 ou 2 preços aceitos:
⚠️ Apenas [X] preços válidos encontrados
   Recomenda-se coletar mais preços para análise robusta

// Se variação muito alta (desvio > 30% da mediana):
⚠️ Alta variação nos preços coletados
   Considere revisar as especificações do item
```

**Critérios de aceitação:**
- [ ] Classificação é automática e imediata
- [ ] Destaque visual é claro e intuitivo
- [ ] Filtros e ordenação funcionam
- [ ] Sistema impede uso de preços rejeitados sem justificativa
- [ ] Fluxo de aprovação funciona corretamente
- [ ] Alertas são exibidos quando pertinente

---

#### RF-011: Consolidação do Valor Estimado

**Prioridade:** 🔴 Alta  
**Complexidade:** Baixa  
**Estimativa:** 8 horas

**Descrição:**  
Sistema deve calcular e consolidar o valor estimado final do item e da demanda.

**Cálculos:**

**1. Valor Estimado Unitário do Item**
```javascript
// Usa APENAS preços classificados como "ACEITO"
preços_aceitos = [18.00, 18.50, 19.00]

// Valor estimado = MEDIANA dos preços aceitos
valor_unitário = MEDIANA(preços_aceitos) = 18.50

Resultado: R$ 18,50
```

**2. Valor Estimado Total do Item**
```javascript
valor_total_item = valor_unitário × quantidade

Exemplo:
valor_unitário = 18.50
quantidade = 500 resmas
valor_total = 18.50 × 500 = 9.250,00

Resultado: R$ 9.250,00
```

**3. Valor Estimado da Demanda**
```javascript
// Soma dos valores totais de TODOS os itens
valor_demanda = Σ (valor_total_item_1 + valor_total_item_2 + ... + valor_total_item_N)

Exemplo (3 itens):
Item 001: R$ 9.250,00
Item 002: R$ 5.600,00
Item 003: R$ 2.150,00
──────────────────────
Total:    R$ 17.000,00
```

**Apresentação:**

```
┌─────────────────────────────────────────────────────────┐
│ 💰 CONSOLIDAÇÃO DE VALORES                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Item 001: Papel A4 75g                                  │
│ ├─ Valor Unitário:  R$ 18,50 (mediana de 3 preços)    │
│ ├─ Quantidade:      500 resmas                          │
│ └─ Valor Total:     R$ 9.250,00                         │
│                                                         │
│ Item 002: Toner para impressora                         │
│ ├─ Valor Unitário:  R$ 280,00 (mediana de 5 preços)   │
│ ├─ Quantidade:      20 unidades                         │
│ └─ Valor Total:     R$ 5.600,00                         │
│                                                         │
│ Item 003: Grampeador                                    │
│ ├─ Valor Unitário:  R$ 21,50 (mediana de 4 preços)    │
│ ├─ Quantidade:      100 unidades                        │
│ └─ Valor Total:     R$ 2.150,00                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 💰 VALOR ESTIMADO DA DEMANDA: R$ 17.000,00             │
└─────────────────────────────────────────────────────────┘
```

**Regras:**

**1. Considerar Apenas Preços Aceitos**
```
✅ Preços com classificação "ACEITO" → Incluir no cálculo
❌ Preços "ABAIXO DO LIMITE" → Excluir
❌ Preços "ACIMA DO LIMITE" → Excluir
✅ Preços "ACEITO (EXCEPCIONAL)" → Incluir (se aprovado por Gestor)
```

**2. Se Não Houver Preços Aceitos**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ IMPOSSÍVEL CALCULAR VALOR ESTIMADO                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Não há preços válidos para o Item 001                   │
│                                                         │
│ Situação:                                               │
│ • 4 preços coletados                                    │
│ • 0 preços dentro do intervalo aceitável                │
│                                                         │
│ Ações recomendadas:                                     │
│ ✓ Coletar mais preços                                   │
│ ✓ Revisar especificações do item                        │
│ ✓ Solicitar inclusão excepcional ao Gestor             │
│                                                         │
│ [📝 Coletar Mais Preços]                                │
└─────────────────────────────────────────────────────────┘
```

**3. Ajuste Manual do Valor Estimado (Perfil Gestor)**

Gestor pode ajustar valor manualmente se necessário:

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Ajustar Valor Estimado (Requer Gestor)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Item 001: Papel A4 75g                                  │
│                                                         │
│ Valor Calculado (Mediana):                              │
│ R$ 18,50                                                 │
│                                                         │
│ Valor Ajustado Manualmente:                             │
│ R$ [19,00]                                               │
│                                                         │
│ Diferença: +R$ 0,50 (+2,70%)                            │
│                                                         │
│ Justificativa do Ajuste* (mín. 100 caracteres):        │
│ [Textarea]                                              │
│ Exemplo: "Ajuste devido a variação cambial do dólar    │
│ que impacta o preço do papel importado. Fonte: Banco   │
│ Central..."                                             │
│                                                         │
│ ⚠️ Este ajuste será registrado no log de auditoria     │
│                                                         │
│ [❌ Cancelar] [✅ Confirmar Ajuste]                     │
└─────────────────────────────────────────────────────────┘
```

**Exibição de Ajuste na Consolidação:**

```
Item 001: Papel A4 75g
├─ Valor Calculado:    R$ 18,50
├─ Valor Ajustado:     R$ 19,00 ⚙️ (ajustado manualmente)
│  └─ Diferença:       +R$ 0,50 (+2,70%)
│  └─ Justificativa:   [Ver justificativa completa]
│  └─ Ajustado por:    Maria Santos em 20/01/2026 14:22
├─ Quantidade:         500 resmas
└─ Valor Total:        R$ 9.500,00
```

**Arredondamento:**
- Valores são arredondados para 2 casas decimais
- Usar arredondamento matemático padrão

**Atualização Automática:**
- Valor estimado é recalculado automaticamente quando:
  - Um preço é adicionado
  - Um preço é editado
  - Um preço é excluído
  - Classificação de preço muda (ex: aprovação de excepcional)

**Critérios de aceitação:**
- [ ] Cálculos são precisos
- [ ] Sistema alerta quando não há preços válidos
- [ ] Ajuste manual requer e registra justificativa
- [ ] Diferença entre calculado e ajustado é destacada
- [ ] Atualização automática funciona
- [ ] Valores são apresentados de forma clara

---

### 5.4 Módulo de Relatórios

#### RF-012: Relatório do PCA

**Prioridade:** 🟡 Média  
**Complexidade:** Alta  
**Estimativa:** 16 horas

**Descrição:**  
Gerar relatório consolidado de todo o Plano de Contratações Anual.

**Estrutura do Relatório:**

**1. Capa**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              [LOGO DO ÓRGÃO]                            │
│                                                         │
│        ESTADO DE GOIÁS                                  │
│        SECRETARIA DE SAÚDE                              │
│                                                         │
│                                                         │
│         PLANO DE CONTRATAÇÕES ANUAL                     │
│                  PCA 2026                               │
│                                                         │
│                                                         │
│                                                         │
│         Goiânia, 20 de janeiro de 2026                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**2. Sumário Executivo**
```
SUMÁRIO EXECUTIVO

O Plano de Contratações Anual 2026 da Secretaria de Saúde 
contempla 45 demandas, com valor estimado total de 
R$ 12.500.000,00.

Situação Atual (20/01/2026):
• Demandas cadastradas:     8 (17,8%)
• Demandas em análise:     12 (26,7%)
• Demandas estimadas:      18 (40,0%)
• Demandas em contratação:  2 (4,4%)
• Demandas contratadas:    10 (22,2%)

Valores:
• Valor total estimado:    R$ 12.500.000,00
• Valor total contratado:  R$ 5.200.000,00
• Taxa de execução:        41,6%
```

**3. Lista de Demandas**

Tabela com todas as demandas:

| Código | Descrição | Unidade | Status | Valor Est. | Data Prev. | Situação |
|--------|-----------|---------|--------|------------|------------|----------|
| PCA2026-001-001 | Aquisição de medicamentos | Farm. Central | Contratada | R$ 850.000 | 15/01 | ✅ |
| PCA2026-001-002 | Equipamentos de TI | TI | Estimada | R$ 450.000 | 28/02 | 🟢 |
| ... | ... | ... | ... | ... | ... | ... |

**4. Gráficos**

- Gráfico de pizza: Distribuição por status
- Gráfico de barras: Distribuição por unidade demandante
- Gráfico de evolução mensal
- Gráfico de valores por categoria

**5. Análise de Execução**

```
ANÁLISE DE EXECUÇÃO

Meta de Execução Anual: 90%
Execução Atual (Jan):   41,6%
Projeção para Dez:      87,5% (dentro da meta)

Demandas com Prazo Próximo (30 dias): 3
Demandas Atrasadas: 2

Ações Recomendadas:
• Priorizar PCA2026-001-012 (atrasada há 12 dias)
• Agilizar análise de mercado das 12 demandas pendentes
• Monitorar demandas com prazo em fevereiro
```

**6. Anexos**
- Metodologia de análise de mercado
- Legislação aplicável
- Tabela de elementos de despesa

**Formatos de Exportação:**
- **PDF:** relatório completo formatado (20-50 páginas)
- **XLSX:** tabela de demandas + gráficos
- **CSV:** dados tabulares para análise

**Filtros e Opções:**
```
Opções do Relatório:
☑️ Incluir sumário executivo
☑️ Incluir lista detalhada de demandas
☑️ Incluir gráficos
☑️ Incluir análise de execução
☐ Incluir demandas canceladas
☑️ Incluir anexos (metodologia, legislação)

Filtrar demandas:
Status: [Todos ▼]
Unidade: [Todas ▼]
Período: [Todo o ano ▼]
```

**Critérios de aceitação:**
- [ ] Relatório é gerado em até 15 segundos
- [ ] PDF tem qualidade profissional
- [ ] Todos os dados são precisos
- [ ] Gráficos são claros e legíveis
- [ ] Filtros funcionam corretamente

---

#### RF-013: Relatório de Análise de Mercado por Demanda

**Prioridade:** 🔴 Alta  
**Complexidade:** Alta  
**Estimativa:** 20 horas

**Descrição:**  
Gerar relatório detalhado da análise de mercado de uma demanda específica, pronto para juntada em processo licitatório.

**Estrutura do Relatório:**

**1. Capa**
```
[LOGO DO ÓRGÃO]

ANÁLISE DE MERCADO

Demanda: PCA2026-001-244
Objeto: Aquisição de papel A4

Responsável: João Silva (Mat. 12345)
Data: 20 de janeiro de 2026
```

**2. Identificação da Demanda**
```
1. IDENTIFICAÇÃO

Código da Demanda: PCA2026-001-244
PCA de Referência: PCA 2026 - Secretaria de Saúde
Objeto: Aquisição de papel A4 para atendimento às 
        necessidades administrativas
Unidade Demandante: Departamento Administrativo
Responsável: João Silva (Matrícula 12345)
Tipo de Contratação: Nova contratação
Natureza da Despesa: Custeio
Elemento de Despesa: 3.3.90.30 - Material de Consumo
```

**3. Justificativa**
```
2. JUSTIFICATIVA

2.1 Justificativa Técnica
[Texto completo da justificativa técnica cadastrada]

2.2 Justificativa Administrativa
[Texto completo da justificativa administrativa cadastrada]
```

**4. Metodologia**
```
3. METODOLOGIA

A presente análise de mercado foi realizada em conformidade 
com o Decreto Estadual nº 9.900/2021, Art. 6º, que 
estabelece:

"A estimativa de preços será realizada mediante pesquisa 
de mercado, considerando-se a mediana dos valores obtidos, 
admitindo-se a fixação de intervalo de variação de até 25% 
(vinte e cinco por cento) para mais ou para menos."

Procedimentos adotados:
a) Consulta a múltiplas fontes de preços (fornecedores, 
   portais públicos, atas de registro de preços)
b) Coleta de no mínimo 3 (três) preços por item
c) Cálculo da mediana dos preços coletados
d) Definição de intervalo de aceitação de ±25% da mediana
e) Validação dos preços dentro do intervalo
f) Definição do valor estimado como a mediana dos preços 
   válidos
```

**5. Detalhamento por Item**

Para cada item:

```
4. ANÁLISE DE PREÇOS

4.1 ITEM 001 - Papel A4 75g branco

4.1.1 Especificações
Descrição: Papel sulfite A4, 75g/m², branco, formato 
210x297mm, pacote com 500 folhas
Unidade: Resma
Quantidade: 500

4.1.2 Preços Coletados

┌─────┬───────────────┬──────────┬────────┬────────────┬──────────────┐
│ Nº  │ Fonte         │ Tipo     │ Valor  │ Data       │ Classificação│
├─────┼───────────────┼──────────┼────────┼────────────┼──────────────┤
│ 1   │ Empresa ABC   │Fornecedor│ 18,00  │ 15/01/2026 │ Aceito       │
│ 2   │ ComprasNet    │ Portal   │ 18,50  │ 10/01/2026 │ Aceito       │
│ 3   │ Empresa DEF   │Fornecedor│ 19,00  │ 12/01/2026 │ Aceito       │
│ 4   │ Empresa XYZ   │Fornecedor│ 25,00  │ 13/01/2026 │ Acima limite │
└─────┴───────────────┴──────────┴────────┴────────────┴──────────────┘

4.1.3 Análise Estatística

Média Aritmética:     R$ 20,13
Mediana:              R$ 18,50 ⭐
Desvio Padrão:        R$ 3,18
Amplitude:            R$ 7,00 (18,00 - 25,00)

Intervalo de Aceitação (±25% da mediana):
Limite Inferior:      R$ 13,88
Limite Superior:      R$ 23,44

Preços Válidos: 3 de 4 (75%)

4.1.4 Valor Estimado

Valor Unitário:       R$ 18,50 (mediana dos preços aceitos)
Quantidade:           500 resmas
Valor Total do Item:  R$ 9.250,00

4.1.5 Justificativa
O valor estimado de R$ 18,50 por resma foi definido com 
base na mediana de 3 preços válidos coletados de fontes 
diversas (fornecedores e portal público), garantindo 
razoabilidade e economicidade conforme princípios da 
administração pública.

[Anexos: Ver documentos comprobatórios ao final]
```

**6. Consolidação**
```
5. CONSOLIDAÇÃO DE VALORES

┌──────┬─────────────────┬──────────┬────────────┬───────────────┐
│ Item │ Descrição       │ Quant.   │ Vlr Unit.  │ Vlr Total     │
├──────┼─────────────────┼──────────┼────────────┼───────────────┤
│ 001  │ Papel A4 75g    │ 500      │ R$ 18,50   │ R$ 9.250,00   │
│ 002  │ Toner impressora│ 20       │ R$ 280,00  │ R$ 5.600,00   │
│ 003  │ Grampeador      │ 100      │ R$ 21,50   │ R$ 2.150,00   │
├──────┴─────────────────┴──────────┴────────────┼───────────────┤
│ VALOR TOTAL ESTIMADO DA DEMANDA                │ R$ 17.000,00  │
└────────────────────────────────────────────────┴───────────────┘
```

**7. Conclusão**
```
6. CONCLUSÃO

Com base na análise de mercado realizada conforme 
metodologia estabelecida pelo Decreto Estadual nº 
9.900/2021, o valor estimado total para a presente 
contratação é de R$ 17.000,00 (dezessete mil reais).

A pesquisa de preços considerou fontes diversificadas e 
idôneas, garantindo a representatividade dos valores 
praticados no mercado.

Os valores estimados refletem os preços vigentes na data 
da análise e atendem aos princípios da economicidade e 
razoabilidade.
```

**8. Anexos**
```
7. ANEXOS

Anexo I   - Orçamento Empresa ABC Papelaria
Anexo II  - Print ComprasNet - Painel de Preços
Anexo III - Orçamento Empresa DEF
Anexo IV  - Orçamento Empresa XYZ (fora do intervalo)
...
```

**9. Assinatura**
```
──────────────────────────────────────────────────────

João Silva
Analista de Compras - Matrícula 12345
Responsável pela Análise de Mercado

Goiânia, 20 de janeiro de 2026

──────────────────────────────────────────────────────

Documento gerado eletronicamente pelo Sistema de 
Análise de Mercado para Licitações Públicas
Hash de Integridade: 
a7f8e9d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0

Para validar a autenticidade deste documento, acesse:
https://sistema.go.gov.br/validar?hash=a7f8e9d6...
```

**Opções de Personalização:**
```
☑️ Incluir capa
☑️ Incluir metodologia
☑️ Incluir análise detalhada por item
☑️ Incluir gráficos de dispersão
☑️ Incluir anexos (evidências)
☑️ Incluir assinatura eletrônica (hash)
☐ Incluir itens cancelados/suspensos
☑️ Incluir observações e justificativas
```

**Critérios de aceitação:**
- [ ] Relatório tem formato profissional
- [ ] Todos os dados são precisos e atualizados
- [ ] Metodologia está clara e conforme legislação
- [ ] Anexos são incluídos corretamente
- [ ] PDF pode ser impresso e anexado em processo
- [ ] Hash de integridade é gerado
- [ ] Geração ocorre em até 10 segundos

---

#### RF-014: Relatório de Auditoria

**Prioridade:** 🟡 Média  
**Complexidade:** Média  
**Estimativa:** 12 horas

**Descrição:**  
Gerar relatório completo do histórico de alterações para fins de auditoria.

**Estrutura:**

```
RELATÓRIO DE AUDITORIA

Período: 01/01/2026 a 31/01/2026
Filtros aplicados:
- Demanda: PCA2026-001-244
- Usuário: Todos
- Ação: Todas

Total de registros: 15

┌────┬────────────┬──────────┬────────────┬──────────┬─────────────┐
│ ID │ Data/Hora  │ Usuário  │ Ação       │ Entidade │ Detalhes    │
├────┼────────────┼──────────┼────────────┼──────────┼─────────────┤
│ 1  │ 15/01 10:32│João Silva│ CREATE     │ Demanda  │ Criou PCA...│
│ 2  │ 15/01 11:05│João Silva│ CREATE     │ Item     │ Adicionou...│
│ 3  │ 15/01 11:30│João Silva│ CREATE     │ Preco    │ Registrou...│
│ ...│ ...        │ ...      │ ...        │ ...      │ ...         │
│ 15 │ 20/01 14:22│Maria S.  │ UPDATE     │ Demanda  │ Ajustou val.│
└────┴────────────┴──────────┴────────────┴──────────┴─────────────┘

Detalhamento das Alterações:

[15] 20/01/2026 14:22:18 - Ajuste de Valor Estimado
├─ Usuário: Maria Santos (Gestor - Mat. 67890)
├─ IP: 192.168.1.50
├─ Navegador: Chrome 120.0
├─ Entidade: Demanda PCA2026-001-244
├─ Campo alterado: valor_estimado
├─ Valor anterior: R$ 18.500,00
├─ Valor novo: R$ 19.000,00
└─ Justificativa: "Ajuste devido a variação cambial..."
```

**Formatos:**
- PDF: relatório formatado
- CSV: dados tabulares
- XLSX: planilha com filtros
- JSON: para integração

**Filtros avançados:**
- Período (data início e fim)
- Usuário específico
- Tipo de ação (CREATE, UPDATE, DELETE, VIEW)
- Entidade (PCA, Demanda, Item, Preço, etc.)
- IP específico

**Critérios de aceitação:**
- [ ] Todos os logs são incluídos
- [ ] Diff (antes/depois) é claro
- [ ] Filtros funcionam corretamente
- [ ] Exportação em múltiplos formatos funciona

---

### 5.5 Módulo de Segurança e Auditoria

#### RF-015: Gestão de Usuários e Permissões

**Prioridade:** 🔴 Alta  
**Complexidade:** Média  
**Estimativa:** 16 horas

**Descrição:**  
Controle completo de usuários, perfis e permissões.

**Perfis e Permissões:**

| Funcionalidade | Admin | Gestor | Operador | Consulta | Auditor | Unid. Dem. |
|----------------|-------|--------|----------|----------|---------|------------|
| Criar PCA | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar PCA | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Aprovar PCA | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Criar Demanda | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Editar Demanda | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cancelar Demanda | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Criar Item | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cadastrar Preço | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ajustar Valor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Aprovar Exceção | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver Demandas | ✅ | ✅ | ✅ | ✅ | ✅ | Suas |
| Gerar Relatórios | ✅ | ✅ | ✅ | ✅ | ✅ | Seus |
| Ver Logs | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Gerenciar Usuários | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configurar Sistema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Interface de Gestão de Usuários:**

```
┌─────────────────────────────────────────────────────────┐
│ Usuários do Sistema                      [+ Novo Usuário│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Buscar: [_____________] [🔍]                           │
│ Filtrar por: [Todos os perfis ▼] [Ativos ▼]           │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ✅ João Silva                                      │ │
│ │ joao.silva@saude.go.gov.br | Mat. 12345           │ │
│ │ Perfil: Operador | Último acesso: 20/01 14:32     │ │
│ │ [✏️ Editar] [🔒 Desativar] [📊 Ver Atividade]     │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ✅ Maria Santos                                    │ │
│ │ maria.santos@saude.go.gov.br | Mat. 67890         │ │
│ │ Perfil: Gestor | Último acesso: 20/01 09:15       │ │
│ │ [✏️ Editar] [🔒 Desativar] [📊 Ver Atividade]     │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ [1] [2] [3] ... [10] →                                │
└─────────────────────────────────────────────────────────┘
```

**Formulário de Usuário:**

```
┌─────────────────────────────────────────────────────────┐
│ Novo Usuário                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Nome Completo*:                                         │
│ [João da Silva                              ]          │
│                                                         │
│ CPF*:                                                   │
│ [123.456.789-00] 🔍 ✅ Válido                          │
│                                                         │
│ Matrícula*:                                             │
│ [12345]                                                 │
│                                                         │
│ E-mail*:                                                │
│ [joao.silva@saude.go.gov.br                 ]          │
│                                                         │
│ Perfil*: [Dropdown]                                     │
│ [Operador                                   ▼]         │
│ Opções: Administrador, Gestor, Operador, Consulta,     │
│         Auditor, Unidade Demandante                     │
│                                                         │
│ Unidade (se Unidade Demandante):                        │
│ [Departamento Administrativo                ]          │
│                                                         │
│ Status:                                                 │
│ ( ) Ativo  ( ) Inativo                                  │
│                                                         │
│ ──────────────────────────────────────────             │
│ Autenticação                                            │
│                                                         │
│ Tipo:                                                   │
│ ( ) Active Directory (recomendado)                      │
│ (•) Local (senha no sistema)                            │
│                                                         │
│ Se Local:                                               │
│ Senha Temporária*: [************]                       │
│ ☑️ Forçar troca de senha no primeiro acesso            │
│                                                         │
│ [❌ Cancelar] [💾 Salvar Usuário]                       │
└─────────────────────────────────────────────────────────┘
```

**Critérios de aceitação:**
- [ ] Criação de usuário funciona
- [ ] Perfis restringem ações corretamente
- [ ] Integração com AD funciona (se configurada)
- [ ] Desativação de usuário bloqueia acesso
- [ ] Logs registram ações de gestão de usuários

---


# PRD – Sistema de Análise de Mercado para Licitações Públicas

**Versão:** 2.0  
**Data:** Janeiro de 2026

---


9. [Modelo de Dados](#9-modelo-de-dados)
10. [Interface do Usuário](#10-interface-do-usuário)
11. [Casos de Uso Detalhados](#11-casos-de-uso-detalhados)

---

## 9. Modelo de Dados

### 9.1 Diagrama Entidade-Relacionamento (Resumido)

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│   PCA    │──1:N──│ Demanda  │──1:N──│   Item   │──1:N──│  Preco   │
└──────────┘       └──────────┘       └──────────┘       └──────────┘
     │                  │                   │                   │
     │                  │                   │                   └──1:N──┐
     │                  │                   │                           │
     │                  │                   └──1:N──┐           ┌──────────┐
     │                  │                           │           │  Anexo   │
     │                  └──1:N──┐           ┌──────────┐       └──────────┘
     │                          │           │  Anexo   │
     └──1:N──┐          ┌───────────┐      └──────────┘
             │          │   Anexo   │
      ┌──────────┐      └───────────┘
      │ Usuario  │
      └──────────┘
           │
           └──1:N──┐
                   │
            ┌──────────────┐
            │ HistoricoLog │
            └──────────────┘
```

### 9.2 Entidades Principais

#### 9.2.1 Tabela: usuario

**Propósito:** Armazenar dados dos usuários do sistema

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| nome_completo | VARCHAR(150) | NÃO | | | | Nome do usuário |
| cpf | VARCHAR(14) | NÃO | | | | CPF (formato: 000.000.000-00) |
| matricula | VARCHAR(20) | NÃO | | | | Matrícula funcional |
| email | VARCHAR(100) | NÃO | | | | E-mail institucional |
| telefone | VARCHAR(20) | SIM | | | NULL | Telefone de contato |
| perfil | ENUM | NÃO | | | 'operador' | admin, gestor, operador, consulta, auditor, unidade_demandante |
| unidade_vinculada | VARCHAR(100) | SIM | | | NULL | Unidade (se perfil = unidade_demandante) |
| senha_hash | VARCHAR(255) | SIM | | | NULL | Hash da senha (bcrypt) |
| usa_ad | BOOLEAN | NÃO | | | FALSE | Se usa Active Directory |
| ativo | BOOLEAN | NÃO | | | TRUE | Se usuário está ativo |
| ultimo_acesso | DATETIME | SIM | | | NULL | Data/hora do último login |
| data_expiracao_senha | DATE | SIM | | | NULL | Data de expiração da senha |
| tentativas_falhas | INT | NÃO | | | 0 | Contador de tentativas falhas |
| bloqueado_ate | DATETIME | SIM | | | NULL | Bloqueio temporário |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Data de criação |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Última atualização |

**Índices:**
- UNIQUE (cpf)
- UNIQUE (matricula)
- UNIQUE (email)
- INDEX (perfil)
- INDEX (ativo)

**Validações:**
- CPF deve ser válido (algoritmo de validação)
- E-mail deve ser formato válido
- Senha (se local) deve ter mínimo 8 caracteres

---

#### 9.2.2 Tabela: pca

**Propósito:** Planos de Contratações Anuais

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| ano | INT | NÃO | | | | Ano de referência (ex: 2026) |
| numero_pca | VARCHAR(20) | NÃO | | | | Número do PCA |
| orgao | VARCHAR(100) | NÃO | | | | Órgão responsável |
| situacao | ENUM | NÃO | | | 'em_elaboracao' | em_elaboracao, aprovado, em_execucao, encerrado |
| data_criacao | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Data de criação |
| data_aprovacao | DATE | SIM | | | NULL | Data de aprovação |
| responsavel_id | INT | NÃO | | ✅ usuario(id) | | Responsável pelo PCA |
| observacoes | TEXT | SIM | | | NULL | Observações gerais |
| versao | INT | NÃO | | | 1 | Número da versão |
| versao_anterior_id | INT | SIM | | ✅ pca(id) | NULL | ID da versão anterior |
| motivo_versao | TEXT | SIM | | | NULL | Motivo da criação de versão |
| ativo | BOOLEAN | NÃO | | | TRUE | Soft delete |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp criação |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- UNIQUE (ano, numero_pca, orgao, versao)
- INDEX (situacao)
- INDEX (responsavel_id)
- INDEX (ativo)

**Constraints:**
- FK responsavel_id REFERENCES usuario(id)
- CHECK (ano >= 2020 AND ano <= 2050)
- CHECK (versao >= 1)

---

#### 9.2.3 Tabela: demanda

**Propósito:** Demandas de contratação vinculadas ao PCA

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| pca_id | INT | NÃO | | ✅ pca(id) | | PCA vinculado |
| numero_projeto | INT | NÃO | | | | Número do projeto (sequencial no PCA) |
| codigo_demanda | VARCHAR(50) | NÃO | | | | Código gerado (PCA[Ano]-[PCA]-[Proj]) |
| descricao | VARCHAR(500) | NÃO | | | | Descrição da demanda |
| justificativa_tecnica | TEXT | NÃO | | | | Justificativa técnica |
| justificativa_administrativa | TEXT | NÃO | | | | Justificativa administrativa |
| valor_estimado_global | DECIMAL(15,2) | SIM | | | NULL | Valor total (calculado) |
| valor_estimado_ajustado | DECIMAL(15,2) | SIM | | | NULL | Valor ajustado manualmente |
| justificativa_ajuste | TEXT | SIM | | | NULL | Justificativa do ajuste |
| ajustado_por_id | INT | SIM | | ✅ usuario(id) | NULL | Quem ajustou |
| ajustado_em | DATETIME | SIM | | | NULL | Quando ajustou |
| data_prevista_contratacao | DATE | NÃO | | | | Data prevista |
| tipo_contratacao | ENUM | NÃO | | | | nova, renovacao, prorrogacao, adesao, dispensa, inexigibilidade |
| natureza_despesa | ENUM | NÃO | | | | investimento, custeio |
| elemento_despesa | VARCHAR(20) | NÃO | | | | Código elemento SIAFI |
| unidade_demandante | VARCHAR(100) | NÃO | | | | Nome da unidade |
| responsavel_id | INT | NÃO | | ✅ usuario(id) | | Responsável |
| centro_custo | VARCHAR(50) | NÃO | | | | Centro de custo |
| prazo_vigencia_meses | INT | NÃO | | | | Prazo em meses |
| cnae | VARCHAR(10) | SIM | | | NULL | CNAE |
| fonte_recursos | VARCHAR(100) | SIM | | | NULL | Fonte de recursos |
| programa_acao | VARCHAR(100) | SIM | | | NULL | Programa/ação orçamentária |
| processo_administrativo | VARCHAR(50) | SIM | | | NULL | Nº processo |
| status | ENUM | NÃO | | | 'cadastrada' | cadastrada, em_analise, estimada, em_contratacao, contratada, cancelada, suspensa |
| data_cancelamento | DATETIME | SIM | | | NULL | Data cancelamento |
| justificativa_cancelamento | TEXT | SIM | | | NULL | Motivo cancelamento |
| motivo_cancelamento | ENUM | SIM | | | NULL | falta_orcamento, mudanca_prioridade, item_nao_necessario, erro_cadastro, outro |
| numero_processo_licitatorio | VARCHAR(50) | SIM | | | NULL | Nº processo (se em contratação) |
| numero_contrato | VARCHAR(50) | SIM | | | NULL | Nº contrato (se contratada) |
| data_contrato | DATE | SIM | | | NULL | Data assinatura |
| valor_contratado | DECIMAL(15,2) | SIM | | | NULL | Valor real contratado |
| cnpj_fornecedor_contratado | VARCHAR(18) | SIM | | | NULL | CNPJ do contratado |
| razao_social_contratado | VARCHAR(200) | SIM | | | NULL | Razão social |
| observacoes | TEXT | SIM | | | NULL | Observações |
| ativo | BOOLEAN | NÃO | | | TRUE | Soft delete |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp criação |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- UNIQUE (codigo_demanda)
- INDEX (pca_id)
- INDEX (status)
- INDEX (data_prevista_contratacao)
- INDEX (responsavel_id)
- INDEX (unidade_demandante)
- INDEX (ativo)
- FULLTEXT (descricao, justificativa_tecnica)

**Constraints:**
- FK pca_id REFERENCES pca(id)
- FK responsavel_id REFERENCES usuario(id)
- FK ajustado_por_id REFERENCES usuario(id)
- CHECK (valor_estimado_global >= 0)
- CHECK (prazo_vigencia_meses > 0)

---

#### 9.2.4 Tabela: item

**Propósito:** Itens da demanda para análise de mercado

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| demanda_id | INT | NÃO | | ✅ demanda(id) | | Demanda vinculada |
| codigo_item | INT | NÃO | | | | Código sequencial (dentro da demanda) |
| descricao | VARCHAR(1000) | NÃO | | | | Descrição detalhada |
| especificacoes_tecnicas | TEXT | SIM | | | NULL | Especificações (HTML rico) |
| unidade_medida | VARCHAR(20) | NÃO | | | | kg, litro, unidade, resma, etc. |
| quantidade | DECIMAL(10,3) | NÃO | | | | Quantidade estimada |
| elemento_despesa | VARCHAR(20) | NÃO | | | | Elemento SIAFI |
| marca_referencia | VARCHAR(100) | SIM | | | NULL | Marca de referência |
| codigo_catmat | VARCHAR(20) | SIM | | | NULL | CATMAT/CATSER |
| valor_estimado_unitario | DECIMAL(15,2) | SIM | | | NULL | Mediana preços (calculado) |
| valor_estimado_total | DECIMAL(15,2) | SIM | | | NULL | Unitário × Qtd (calculado) |
| valor_ajustado_unitario | DECIMAL(15,2) | SIM | | | NULL | Ajustado manualmente |
| justificativa_ajuste | TEXT | SIM | | | NULL | Justificativa ajuste |
| ajustado_por_id | INT | SIM | | ✅ usuario(id) | NULL | Quem ajustou |
| ajustado_em | DATETIME | SIM | | | NULL | Quando ajustou |
| observacoes | TEXT | SIM | | | NULL | Observações |
| analise_concluida | BOOLEAN | NÃO | | | FALSE | Se tem análise completa |
| data_conclusao_analise | DATETIME | SIM | | | NULL | Quando concluiu |
| ativo | BOOLEAN | NÃO | | | TRUE | Soft delete |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp criação |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- UNIQUE (demanda_id, codigo_item)
- INDEX (demanda_id)
- INDEX (analise_concluida)
- INDEX (ativo)
- FULLTEXT (descricao, especificacoes_tecnicas)

**Constraints:**
- FK demanda_id REFERENCES demanda(id) ON DELETE CASCADE
- FK ajustado_por_id REFERENCES usuario(id)
- CHECK (quantidade > 0)

---

#### 9.2.5 Tabela: preco

**Propósito:** Preços coletados para cada item

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| item_id | INT | NÃO | | ✅ item(id) | | Item vinculado |
| fonte | VARCHAR(200) | NÃO | | | | Nome da fonte |
| tipo_fonte | ENUM | NÃO | | | | fornecedor, comprasnet, banco_precos, ata, contrato, nota_fiscal, outro |
| valor_unitario | DECIMAL(15,2) | NÃO | | | | Valor em R$ |
| data_coleta | DATE | NÃO | | | | Data da coleta |
| unidade_medida | VARCHAR(20) | NÃO | | | | Unidade (deve corresponder ao item) |
| cnpj_fornecedor | VARCHAR(18) | SIM | | | NULL | CNPJ (formato: 00.000.000/0000-00) |
| razao_social | VARCHAR(200) | SIM | | | NULL | Razão social |
| cidade_uf | VARCHAR(100) | SIM | | | NULL | Cidade/UF |
| telefone | VARCHAR(20) | SIM | | | NULL | Telefone |
| email | VARCHAR(100) | SIM | | | NULL | E-mail |
| numero_referencia | VARCHAR(50) | SIM | | | NULL | Nº processo/contrato/ata |
| link_fonte | VARCHAR(500) | SIM | | | NULL | URL |
| observacoes | VARCHAR(500) | SIM | | | NULL | Observações |
| classificacao | ENUM | NÃO | | | | aceito, abaixo_limite, acima_limite |
| percentual_variacao | DECIMAL(5,2) | SIM | | | NULL | % de variação da mediana |
| justificativa_inclusao | TEXT | SIM | | | NULL | Justificativa (se fora do intervalo) |
| solicitacao_aprovacao | BOOLEAN | NÃO | | | FALSE | Se solicitou aprovação |
| aprovado | BOOLEAN | SIM | | | NULL | Se foi aprovado |
| aprovado_por_id | INT | SIM | | ✅ usuario(id) | NULL | Quem aprovou |
| aprovado_em | DATETIME | SIM | | | NULL | Quando aprovou |
| motivo_aprovacao | TEXT | SIM | | | NULL | Motivo da aprovação |
| cadastrado_por_id | INT | NÃO | | ✅ usuario(id) | | Quem cadastrou |
| ativo | BOOLEAN | NÃO | | | TRUE | Soft delete |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp criação |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- INDEX (item_id)
- INDEX (classificacao)
- INDEX (data_coleta)
- INDEX (aprovado)
- INDEX (cadastrado_por_id)
- INDEX (ativo)

**Constraints:**
- FK item_id REFERENCES item(id) ON DELETE CASCADE
- FK aprovado_por_id REFERENCES usuario(id)
- FK cadastrado_por_id REFERENCES usuario(id)
- CHECK (valor_unitario > 0)
- CHECK (data_coleta <= CURDATE())

---

#### 9.2.6 Tabela: anexo

**Propósito:** Arquivos anexados (evidências, documentos)

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| entidade_tipo | ENUM | NÃO | | | | pca, demanda, item, preco |
| entidade_id | INT | NÃO | | | | ID da entidade |
| nome_arquivo | VARCHAR(255) | NÃO | | | | Nome original |
| nome_arquivo_storage | VARCHAR(255) | NÃO | | | | Nome no storage (UUID) |
| extensao | VARCHAR(10) | NÃO | | | | Extensão (sem ponto) |
| tamanho_bytes | INT | NÃO | | | | Tamanho em bytes |
| mime_type | VARCHAR(100) | NÃO | | | | Tipo MIME |
| hash_md5 | VARCHAR(32) | NÃO | | | | Hash para integridade |
| path_storage | VARCHAR(500) | NÃO | | | | Caminho completo |
| descricao | VARCHAR(200) | SIM | | | NULL | Descrição do anexo |
| uploaded_by_id | INT | NÃO | | ✅ usuario(id) | | Quem fez upload |
| ativo | BOOLEAN | NÃO | | | TRUE | Soft delete |
| created_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Data do upload |

**Índices:**
- INDEX (entidade_tipo, entidade_id)
- INDEX (uploaded_by_id)
- INDEX (ativo)
- INDEX (hash_md5)

**Constraints:**
- FK uploaded_by_id REFERENCES usuario(id)
- CHECK (tamanho_bytes > 0 AND tamanho_bytes <= 10485760) -- 10MB

---

#### 9.2.7 Tabela: historico_log

**Propósito:** Log de auditoria de todas as ações

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | BIGINT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| usuario_id | INT | SIM | | ✅ usuario(id) | NULL | Usuário (NULL se sistema) |
| data_hora | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Timestamp da ação |
| acao | ENUM | NÃO | | | | LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW, EXPORT, APPROVE, REJECT |
| entidade_tipo | VARCHAR(50) | NÃO | | | | usuario, pca, demanda, item, preco, anexo, etc. |
| entidade_id | INT | SIM | | | NULL | ID do registro afetado |
| campo_alterado | VARCHAR(100) | SIM | | | NULL | Nome do campo (se UPDATE) |
| valor_anterior | TEXT | SIM | | | NULL | Valor antes (JSON) |
| valor_novo | TEXT | SIM | | | NULL | Valor depois (JSON) |
| descricao | TEXT | SIM | | | NULL | Descrição da ação |
| ip_origem | VARCHAR(45) | SIM | | | NULL | IP (suporta IPv6) |
| user_agent | VARCHAR(255) | SIM | | | NULL | Navegador/SO |
| resultado | ENUM | NÃO | | | 'sucesso' | sucesso, falha, bloqueado |
| mensagem_erro | TEXT | SIM | | | NULL | Mensagem (se falha) |

**Índices:**
- INDEX (usuario_id)
- INDEX (data_hora)
- INDEX (acao)
- INDEX (entidade_tipo, entidade_id)
- INDEX (resultado)

**Constraints:**
- FK usuario_id REFERENCES usuario(id)
- Particionamento por data (mensal) para performance

**Políticas:**
- Registros são **IMUTÁVEIS** (INSERT only, sem UPDATE/DELETE)
- Retenção mínima: 5 anos
- Backup automático semanal

---

#### 9.2.8 Tabela: configuracao

**Propósito:** Configurações do sistema

| Campo | Tipo | Nulo | PK | FK | Default | Descrição |
|-------|------|------|----|----|---------|-----------|
| id | INT | NÃO | ✅ | | AUTO_INCREMENT | ID único |
| chave | VARCHAR(100) | NÃO | | | | Chave da configuração |
| valor | TEXT | NÃO | | | | Valor (pode ser JSON) |
| tipo | ENUM | NÃO | | | 'texto' | texto, numero, booleano, json |
| descricao | VARCHAR(255) | SIM | | | NULL | Descrição |
| categoria | VARCHAR(50) | NÃO | | | | geral, email, integracao, seguranca |
| editavel | BOOLEAN | NÃO | | | TRUE | Se Admin pode editar |
| updated_at | DATETIME | NÃO | | | CURRENT_TIMESTAMP | Última atualização |

**Índices:**
- UNIQUE (chave)
- INDEX (categoria)

**Exemplos de configurações:**
```sql
INSERT INTO configuracao (chave, valor, tipo, categoria) VALUES
('intervalo_aceitacao_percentual', '25', 'numero', 'analise_mercado'),
('minimo_precos_por_item', '3', 'numero', 'analise_mercado'),
('validade_maxima_preco_meses', '12', 'numero', 'analise_mercado'),
('smtp_host', 'smtp.go.gov.br', 'texto', 'email'),
('smtp_porta', '587', 'numero', 'email'),
('sessao_timeout_minutos', '30', 'numero', 'seguranca'),
('tentativas_login_bloqueio', '5', 'numero', 'seguranca'),
('logo_orgao_path', '/storage/logo.png', 'texto', 'geral');
```

---

### 9.3 Views (Visões) Úteis

#### 9.3.1 View: v_demandas_dashboard

**Propósito:** Dados consolidados para dashboard

```sql
CREATE VIEW v_demandas_dashboard AS
SELECT 
    d.id,
    d.codigo_demanda,
    d.descricao,
    d.status,
    d.unidade_demandante,
    d.data_prevista_contratacao,
    d.valor_estimado_global,
    d.valor_contratado,
    u.nome_completo AS responsavel,
    p.ano AS ano_pca,
    p.numero_pca,
    DATEDIFF(d.data_prevista_contratacao, CURDATE()) AS dias_ate_prazo,
    (SELECT COUNT(*) FROM item WHERE demanda_id = d.id AND ativo = TRUE) AS total_itens,
    (SELECT COUNT(*) FROM item WHERE demanda_id = d.id AND analise_concluida = TRUE AND ativo = TRUE) AS itens_concluidos
FROM demanda d
INNER JOIN pca p ON d.pca_id = p.id
INNER JOIN usuario u ON d.responsavel_id = u.id
WHERE d.ativo = TRUE AND p.ativo = TRUE;
```

#### 9.3.2 View: v_estatisticas_item

**Propósito:** Estatísticas calculadas por item

```sql
CREATE VIEW v_estatisticas_item AS
SELECT 
    i.id AS item_id,
    i.codigo_item,
    i.descricao,
    i.quantidade,
    i.unidade_medida,
    COUNT(pr.id) AS total_precos,
    COUNT(CASE WHEN pr.classificacao = 'aceito' THEN 1 END) AS precos_aceitos,
    AVG(pr.valor_unitario) AS media,
    -- Mediana precisa ser calculada com função ou subconsulta
    MIN(pr.valor_unitario) AS menor_preco,
    MAX(pr.valor_unitario) AS maior_preco,
    STDDEV(pr.valor_unitario) AS desvio_padrao
FROM item i
LEFT JOIN preco pr ON i.id = pr.item_id AND pr.ativo = TRUE
WHERE i.ativo = TRUE
GROUP BY i.id;
```

---

## 10. Interface do Usuário

### 10.1 Arquitetura de Navegação

```
┌─────────────────────────────────────────────────────────┐
│ [LOGO] Sistema de Análise de Mercado  |  João Silva ▼  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────┐                                        │
│ │   MENU      │   [Área de Conteúdo Principal]        │
│ │             │                                        │
│ │ 🏠 Início    │                                        │
│ │ 📊 Dashboard│                                        │
│ │ 📋 PCAs     │                                        │
│ │ 📝 Demandas │                                        │
│ │ 📊 Relatórios│                                       │
│ │ 🔍 Auditoria│                                        │
│ │ ⚙️ Config.  │                                        │
│ │             │                                        │
│ │ [Atalhos]   │                                        │
│ │ + Nova Dem. │                                        │
│ │ 📥 Importar │                                        │
│ │             │                                        │
│ │ [Notif] 🔔3 │                                        │
│ │             │                                        │
│ └─────────────┘                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Layout Padrão

**Cabeçalho (Header):**
```
┌─────────────────────────────────────────────────────────┐
│ [LOGO] Sistema de Análise de Mercado                   │
│                                                         │
│ [🔍 Busca Global]      🔔(3)  👤 João Silva ▼  [Sair] │
└─────────────────────────────────────────────────────────┘
```

**Menu Lateral (Sidebar):**
- Colapsável (ícone hambúrguer)
- Itens com ícones
- Badges de notificação
- Atalhos rápidos

**Área de Conteúdo:**
- Breadcrumbs no topo
- Título da página
- Ações principais (botões no topo direito)
- Conteúdo principal
- Paginação (se aplicável)

**Rodapé (Footer):**
```
┌─────────────────────────────────────────────────────────┐
│ © 2026 Estado de Goiás - Todos os direitos reservados  │
│ Versão 2.0.1 | Suporte: (62) 3333-4444                 │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Componentes da Interface

#### 10.3.1 Cards (Cartões)

Usados para exibir métricas no dashboard:

```
┌─────────────────────┐
│ 📊 Total Demandas   │
│                     │
│        45           │
│                     │
│ +5 este mês ↑       │
└─────────────────────┘
```

#### 10.3.2 Tabelas

Padrão para listagens:

```
┌─────────────────────────────────────────────────────────┐
│ Demandas                      [🔍 Buscar] [+ Nova]     │
├──────┬──────────────┬─────────┬──────────┬─────────────┤
│ Cód. │ Descrição    │ Status  │ Valor    │ Ações       │
├──────┼──────────────┼─────────┼──────────┼─────────────┤
│ 001  │ Papel A4     │🟢 Estim.│ 9.250,00 │ [👁️][✏️][🗑️]│
│ 002  │ Toner        │🟡 Anál. │ 5.600,00 │ [👁️][✏️][🗑️]│
│ ...  │ ...          │ ...     │ ...      │ ...         │
├──────┴──────────────┴─────────┴──────────┴─────────────┤
│ Exibindo 1-10 de 45     [←] [1][2][3]...[5] [→]      │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Ordenação por coluna (clique no cabeçalho)
- Filtros rápidos
- Ações inline (ícones)
- Seleção múltipla (checkbox)
- Paginação

#### 10.3.3 Formulários

Padrão para entrada de dados:

```
┌─────────────────────────────────────────────────────────┐
│ Nova Demanda                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Descrição*:                                             │
│ [_______________________________________________]       │
│ ℹ️ Mínimo 50 caracteres                                │
│                                                         │
│ Justificativa Técnica*:                                 │
│ [                                                ]      │
│ [                                                ]      │
│ [                                                ]      │
│                                                         │
│ Data Prevista*:                                         │
│ [📅 __/__/____]                                         │
│                                                         │
│ [❌ Cancelar]  [💾 Salvar Rascunho]  [✅ Salvar]       │
└─────────────────────────────────────────────────────────┘
```

**Características:**
- Campos obrigatórios com *
- Ajuda contextual (ℹ️)
- Validação em tempo real
- Indicadores visuais (✅ ❌)
- Auto-save de rascunho

#### 10.3.4 Modais (Diálogos)

Para confirmações e ações secundárias:

```
┌─────────────────────────────────────────────┐
│ ⚠️ Confirmar Exclusão                       │
├─────────────────────────────────────────────┤
│                                             │
│ Tem certeza que deseja excluir a demanda   │
│ PCA2026-001-244?                            │
│                                             │
│ Esta ação não pode ser desfeita.            │
│                                             │
│ [Cancelar] [Excluir]                        │
└─────────────────────────────────────────────┘
```

#### 10.3.5 Notificações (Toasts)

Feedback visual de ações:

```
┌─────────────────────────────────────┐
│ ✅ Demanda salva com sucesso!       │
│    [Ver Demanda] [x]                │
└─────────────────────────────────────┘
```

Tipos:
- ✅ Sucesso (verde)
- ℹ️ Informação (azul)
- ⚠️ Aviso (amarelo)
- ❌ Erro (vermelho)

### 10.4 Paleta de Cores

**Cores Principais:**
- **Primária:** #1F4E78 (azul institucional)
- **Secundária:** #4472C4 (azul médio)
- **Sucesso:** #28A745 (verde)
- **Aviso:** #FFA500 (laranja)
- **Erro:** #DC3545 (vermelho)
- **Info:** #17A2B8 (ciano)

**Cores de Status:**
- **Cadastrada:** #007BFF (azul)
- **Em Análise:** #FFC107 (amarelo)
- **Estimada:** #28A745 (verde)
- **Em Contratação:** #FD7E14 (laranja)
- **Contratada:** #155724 (verde escuro)
- **Cancelada:** #DC3545 (vermelho)
- **Suspensa:** #6C757D (cinza)

**Cores Neutras:**
- **Texto Principal:** #212529 (quase preto)
- **Texto Secundário:** #6C757D (cinza médio)
- **Borda:** #DEE2E6 (cinza claro)
- **Fundo:** #F8F9FA (cinza muito claro)
- **Branco:** #FFFFFF

### 10.5 Tipografia

**Fontes:**
- **Principal:** Arial, Helvetica, sans-serif
- **Monospace:** 'Courier New', monospace (para códigos)

**Tamanhos:**
- **Título H1:** 32px (2rem)
- **Título H2:** 28px (1.75rem)
- **Título H3:** 24px (1.5rem)
- **Texto Normal:** 16px (1rem)
- **Texto Pequeno:** 14px (0.875rem)
- **Texto Muito Pequeno:** 12px (0.75rem)

### 10.6 Ícones

Usar biblioteca consistente (ex: Font Awesome, Material Icons)

**Ícones Comuns:**
- 🏠 Início
- 📊 Dashboard
- 📋 Lista
- 📝 Editar
- 🗑️ Excluir
- 👁️ Visualizar
- 💾 Salvar
- ❌ Cancelar
- ✅ Confirmar
- ⚙️ Configurações
- 🔍 Buscar
- 📥 Download
- 📤 Upload
- 🔔 Notificação
- 👤 Usuário
- 🚪 Sair

---

## 11. Casos de Uso Detalhados

### 11.1 UC-001: Cadastrar Análise de Mercado Completa

**Ator Principal:** Operador

**Pré-condições:**
- Usuário autenticado com perfil Operador ou superior
- PCA existe e está ativo
- Demanda cadastrada e em status "Cadastrada" ou "Em Análise"

**Pós-condições:**
- Item cadastrado com análise completa
- Valor estimado calculado
- Demanda muda para status "Estimada" (se todos itens concluídos)
- Notificação enviada ao Gestor

**Fluxo Principal:**

1. Operador acessa a demanda PCA2026-001-244
2. Sistema exibe detalhes da demanda
3. Operador clica em "Adicionar Item"
4. Sistema exibe formulário de cadastro de item
5. Operador preenche:
   - Descrição: "Papel sulfite A4, 75g/m², branco"
   - Especificações: [Rich text com detalhes]
   - Unidade: "Resma"
   - Quantidade: 500
   - Elemento de despesa: "3.3.90.30"
6. Operador clica em "Salvar e Adicionar Preços"
7. Sistema valida campos obrigatórios
8. Sistema salva item com código 001
9. Sistema muda status da demanda para "Em Análise" (se primeira vez)
10. Sistema exibe formulário de cadastro de preço
11. Operador preenche primeiro preço:
    - Fonte: "Empresa ABC Papelaria Ltda"
    - Tipo: "Fornecedor"
    - Valor: R$ 18,50
    - Data: 15/01/2026
    - CNPJ: 12.345.678/0001-99
    - Anexo: [upload de orçamento_abc.pdf]
12. Operador clica em "Salvar Preço"
13. Sistema valida campos e anexo
14. Sistema salva preço
15. Sistema exibe mensagem: "⚠️ Adicione pelo menos 2 preços para completar análise (mínimo 3)"
16. Operador repete passos 11-14 para mais 2 preços:
    - Preço 2: ComprasNet, R$ 18,00, 10/01/2026
    - Preço 3: Empresa DEF, R$ 19,00, 12/01/2026
17. Após o 3º preço, sistema:
    - Calcula média: R$ 18,50
    - Calcula mediana: R$ 18,50
    - Define limites: R$ 13,88 - R$ 23,44
    - Classifica todos preços como "Aceito" (verde)
    - Calcula valor estimado unitário: R$ 18,50
    - Calcula valor estimado total: R$ 9.250,00
    - Marca item como "analise_concluida = true"
18. Sistema exibe mensagem: "✅ Análise de mercado concluída para este item!"
19. Sistema verifica se todos os itens da demanda têm análise concluída
20. Se SIM, sistema muda status da demanda para "Estimada"
21. Sistema envia notificação por e-mail ao Gestor
22. Operador clica em "Gerar Relatório"
23. Sistema gera PDF da análise de mercado
24. Operador faz download do relatório

**Tempo Estimado:** 30-45 minutos para 1 item com 3 preços

**Fluxos Alternativos:**

**FA-01: Preço Fora do Intervalo**
- No passo 14, se preço está fora do intervalo:
  - Sistema calcula e exibe: "⚠️ Este preço está X% acima/abaixo do limite"
  - Sistema classifica como "Acima do Limite" ou "Abaixo do Limite" (vermelho/laranja)
  - Sistema NÃO conta este preço no cálculo do valor estimado
  - Operador pode:
    a) Aceitar e coletar novo preço
    b) Justificar inclusão (envia para aprovação do Gestor)
  - Se escolher (b):
    - Sistema abre modal de justificativa
    - Operador preenche motivo e justificativa
    - Sistema envia notificação ao Gestor
    - Gestor aprova/rejeita
    - Se aprovado, preço é marcado como "Aceito (Excepcional)"

**FA-02: Menos de 3 Preços**
- No passo 22, se item tem < 3 preços:
  - Sistema exibe erro: "❌ É necessário no mínimo 3 preços por item"
  - Sistema impede geração de relatório
  - Operador precisa voltar e adicionar mais preços

**FA-03: Todos os Preços Fora do Intervalo**
- No passo 17, se todos os preços estão fora:
  - Sistema exibe alerta: "⚠️ Nenhum preço válido encontrado!"
  - Sistema NÃO calcula valor estimado
  - Sistema sugere ações:
    - "Coletar mais preços"
    - "Revisar especificações do item"
    - "Consultar Gestor"

**Exceções:**

**E-01: Validação de Campos Falha**
- No passo 7, se campos inválidos:
  - Sistema exibe mensagens de erro específicas
  - Sistema destaca campos problemáticos em vermelho
  - Operador corrige e tenta novamente

**E-02: Upload de Anexo Falha**
- No passo 13, se upload falha:
  - Sistema exibe: "❌ Erro ao enviar arquivo. Tente novamente."
  - Operador tenta novamente
  - Se persistir, operador pode prosseguir e anexar depois

**E-03: Sessão Expirou**
- Em qualquer passo:
  - Sistema detecta sessão expirada
  - Sistema salva rascunho automaticamente (se possível)
  - Sistema redireciona para login
  - Após login, sistema oferece recuperar rascunho

**Critérios de Aceitação:**
- [ ] Todos os passos podem ser executados sem erros
- [ ] Validações funcionam corretamente
- [ ] Cálculos são precisos
- [ ] Status da demanda muda corretamente
- [ ] Notificações são enviadas
- [ ] Relatório é gerado com dados corretos
- [ ] Tempo de execução < 45 minutos

---

### 11.2 UC-002: Aprovar Demanda (Gestor)

**Ator Principal:** Gestor

**Pré-condições:**
- Usuário autenticado com perfil Gestor
- Demanda em status "Estimada"
- Todos os itens têm análise concluída

**Pós-condições:**
- Demanda muda para status "Em Contratação"
- Número de processo licitatório registrado
- Notificação enviada ao responsável
- Log de auditoria registrado

**Fluxo Principal:**

1. Gestor recebe notificação por e-mail: "Demanda PCA2026-001-244 pronta para aprovação"
2. Gestor clica no link da notificação
3. Sistema abre página de detalhes da demanda
4. Sistema exibe resumo:
   - Status atual: "Estimada"
   - Total de itens: 3
   - Valor estimado: R$ 17.000,00
   - Responsável: João Silva
   - Data prevista: 28/02/2026
5. Gestor clica em "Revisar Análise de Mercado"
6. Sistema exibe análise detalhada de cada item
7. Gestor revisa preços, cálculos e classificações
8. Gestor verifica se metodologia está correta
9. Gestor clica em "Iniciar Contratação"
10. Sistema exibe modal de confirmação:
    ```
    ⚠️ Iniciar Processo de Contratação
    
    Demanda: PCA2026-001-244
    Valor Estimado: R$ 17.000,00
    
    Número do Processo Licitatório*:
    [__________________________]
    
    Observações (opcional):
    [                          ]
    
    [Cancelar] [Confirmar]
    ```
11. Gestor preenche: "2026.001.000123-5"
12. Gestor clica em "Confirmar"
13. Sistema valida número do processo
14. Sistema muda status para "Em Contratação"
15. Sistema registra data/hora da mudança
16. Sistema registra usuário que aprovou
17. Sistema envia notificação ao responsável
18. Sistema registra ação no log de auditoria
19. Sistema exibe mensagem: "✅ Demanda movida para 'Em Contratação' com sucesso!"
20. Sistema redireciona para lista de demandas

**Tempo Estimado:** 5-10 minutos

**Fluxos Alternativos:**

**FA-01: Gestor Identifica Problema**
- No passo 7, se gestor encontra erro:
  - Gestor clica em "Solicitar Correção"
  - Sistema abre modal de feedback:
    ```
    📝 Solicitar Correção
    
    Motivo:
    ( ) Erro nos cálculos
    ( ) Preços inválidos
    ( ) Especificações incompletas
    ( ) Outro
    
    Detalhes*:
    [                          ]
    
    [Enviar]
    ```
  - Gestor preenche e envia
  - Sistema muda status da demanda para "Em Análise"
  - Sistema envia notificação ao responsável
  - Responsável corrige e submete novamente

**FA-02: Ajuste de Valor Necessário**
- No passo 8, se gestor precisa ajustar valor:
  - Gestor clica em "Ajustar Valor" (no item específico)
  - Sistema abre modal de ajuste
  - Gestor informa novo valor e justificativa
  - Sistema salva ajuste
  - Sistema recalcula valor total da demanda
  - Gestor continua aprovação normalmente

**Exceções:**

**E-01: Número de Processo Inválido**
- No passo 13:
  - Sistema exibe: "❌ Formato de número de processo inválido"
  - Gestor corrige e tenta novamente

**E-02: Demanda Não Está Mais em "Estimada"**
- No passo 3:
  - Sistema detecta mudança de status (outro usuário alterou)
  - Sistema exibe: "⚠️ Esta demanda foi alterada por outro usuário. Atualizando..."
  - Sistema recarrega página com status atual

**Critérios de Aceitação:**
- [ ] Gestor consegue revisar análise completa
- [ ] Validações impedem dados inválidos
- [ ] Status muda corretamente
- [ ] Notificações são enviadas
- [ ] Log registra todas as ações
- [ ] Fluxo alternativo de correção funciona

---



# PRD – Sistema de Análise de Mercado para Licitações Públicas

**Versão:** 2.0  
**Data:** Janeiro de 2026

---


12. [Requisitos Não Funcionais Completos](#12-requisitos-não-funcionais-completos)
13. [Estratégia de Testes](#13-estratégia-de-testes)
14. [Segurança e Conformidade](#14-segurança-e-conformidade)
15. [Cronograma e Fases](#15-cronograma-e-fases)
16. [Riscos e Mitigações](#16-riscos-e-mitigações)
17. [Métricas de Sucesso e KPIs](#17-métricas-de-sucesso-e-kpis)
18. [Roadmap Futuro](#18-roadmap-futuro)
19. [Glossário](#19-glossário)
20. [Anexos](#20-anexos)

---

## 12. Requisitos Não Funcionais Completos

### 12.1 Performance

**RNF-001: Tempo de Resposta**

| Operação | Meta | Crítico |
|----------|------|---------|
| Login | < 2s | < 5s |
| Carregar dashboard | < 3s | < 5s |
| Carregar lista de demandas (50 itens) | < 2s | < 4s |
| Salvar demanda | < 1s | < 3s |
| Calcular estatísticas (até 100 preços) | < 500ms | < 2s |
| Gerar relatório PDF (até 50 páginas) | < 10s | < 30s |
| Busca global | < 1s | < 3s |
| Upload de arquivo (5MB) | < 5s | < 15s |

**Testes de Performance:**
- Usar ferramentas: JMeter, LoadRunner ou k6
- Simular 100 usuários simultâneos
- Testes de carga: 150% da capacidade esperada
- Testes de estresse: até ponto de falha

**RNF-002: Throughput**

- Mínimo: 50 requisições/segundo
- Desejável: 100 requisições/segundo
- Pico: suportar 200 requisições/segundo por 10 minutos

**RNF-003: Capacidade**

| Recurso | Capacidade Mínima |
|---------|-------------------|
| Usuários simultâneos | 100 |
| PCAs ativos | 50 |
| Demandas/ano | 10.000 |
| Itens/demanda | 200 |
| Preços/item | 100 |
| Anexos/entidade | 10 |
| Tamanho BD | 500 GB (escalável) |

**RNF-004: Escalabilidade**

- Arquitetura deve permitir escalabilidade horizontal
- Banco de dados com replicação (read replicas)
- Cache distribuído (Redis/Memcached)
- CDN para arquivos estáticos
- Load balancer para distribuição de carga

---

### 12.2 Disponibilidade e Confiabilidade

**RNF-005: Uptime (SLA)**

- **Disponibilidade mínima:** 99.0% (downtime de ~7,2h/mês)
- **Disponibilidade desejável:** 99.5% (downtime de ~3,6h/mês)
- **Disponibilidade ideal:** 99.9% (downtime de ~43min/mês)

**Horário Crítico:**
- Segunda a sexta: 08h - 18h
- Maior criticidade: 09h - 17h

**Janela de Manutenção:**
- Sábados: 22h - 06h (domingo)
- Máximo 4 horas de downtime
- Notificação com 48h de antecedência

**RNF-006: Recuperação de Desastres**

| Métrica | Meta |
|---------|------|
| RTO (Recovery Time Objective) | 4 horas |
| RPO (Recovery Point Objective) | 24 horas |
| MTTR (Mean Time To Repair) | 2 horas |
| MTBF (Mean Time Between Failures) | 720 horas (30 dias) |

**Plano de Continuidade:**
- Backup automático diário (incremental)
- Backup completo semanal
- Storage secundário (offsite)
- Procedimento de recuperação documentado
- Testes de recuperação trimestrais

**RNF-007: Tolerância a Falhas**

- Sistema deve degradar gracefully (funcionalidade reduzida vs parada total)
- Transações devem ser atômicas (ACID)
- Retry automático para operações transientes
- Circuit breaker para serviços externos
- Mensagens de erro amigáveis

---

### 12.3 Segurança

**RNF-008: Autenticação**

- Suporte a múltiplos métodos:
  - Active Directory (LDAP) - preferencial
  - OAuth 2.0 / OpenID Connect
  - Autenticação local (fallback)
- Senha forte obrigatória (se autenticação local):
  - Mínimo 8 caracteres
  - Letras maiúsculas e minúsculas
  - Números
  - Caracteres especiais
- Bloqueio após 5 tentativas falhas (30 minutos)
- Logout automático após 30 minutos de inatividade
- Logout forçado às 00h

**RNF-009: Autorização**

- Controle de acesso baseado em perfis (RBAC)
- Segregação de funções
- Princípio do menor privilégio
- Auditoria de acessos não autorizados

**RNF-010: Criptografia**

| Camada | Protocolo/Algoritmo |
|--------|---------------------|
| Em trânsito | TLS 1.2+ (HTTPS obrigatório) |
| Em repouso (dados sensíveis) | AES-256 |
| Senhas | bcrypt (cost factor ≥ 10) |
| Tokens | JWT com RS256 |
| Backups | AES-256 |

**RNF-011: Proteções de Segurança**

- ✅ SQL Injection: prepared statements, ORM
- ✅ XSS: sanitização de inputs, CSP headers
- ✅ CSRF: tokens, SameSite cookies
- ✅ Clickjacking: X-Frame-Options
- ✅ MIME Sniffing: X-Content-Type-Options
- ✅ Session Fixation: regenerar session ID no login
- ✅ Brute Force: rate limiting, CAPTCHA
- ✅ File Upload: validação de tipo, antivírus

**RNF-012: Headers de Segurança**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer-when-downgrade
```

**RNF-013: Auditoria de Segurança**

- Testes de penetração semestrais
- Análise de vulnerabilidades mensais
- OWASP Top 10 compliance
- Code review focado em segurança
- Monitoramento de CVEs de dependências

---

### 12.4 Usabilidade e Acessibilidade

**RNF-014: Navegadores Suportados**

| Navegador | Versões |
|-----------|---------|
| Google Chrome | Últimas 2 versões |
| Mozilla Firefox | Últimas 2 versões |
| Microsoft Edge | Últimas 2 versões |
| Safari | Última versão (melhor esforço) |

**Não suportado:**
- Internet Explorer (qualquer versão)
- Navegadores mobile (inicialmente)

**RNF-015: Resoluções de Tela**

| Dispositivo | Resolução | Suporte |
|-------------|-----------|---------|
| Desktop | 1920x1080 | Otimizado |
| Notebook | 1366x768 | Otimizado |
| Tablet landscape | 1024x768 | Funcional |
| Mobile | < 768px | Não suportado (fase 1) |

**RNF-016: Acessibilidade (WCAG 2.1 Nível AA)**

- ✅ Navegação por teclado (Tab, Shift+Tab)
- ✅ Compatibilidade com leitores de tela (NVDA, JAWS)
- ✅ Contraste de cores ≥ 4.5:1
- ✅ Textos alternativos em imagens
- ✅ Labels em campos de formulário
- ✅ Foco visível
- ✅ Landmarks ARIA
- ✅ Tamanho de fonte ajustável
- ✅ Sem dependência de cor apenas
- ✅ Conteúdo piscante controlável

**RNF-017: Usabilidade**

- Formulários com validação em tempo real
- Mensagens de erro claras e acionáveis
- Confirmação antes de ações destrutivas
- Breadcrumbs para navegação
- Atalhos de teclado para ações frequentes
- Help contextual (tooltips, links para help)
- Busca global com autocomplete
- Feedback visual de carregamento
- Desfazer para ações críticas

**RNF-018: Internacionalização (i18n)**

- Sistema em Português do Brasil (pt-BR)
- Números: formato brasileiro (1.234,56)
- Datas: formato brasileiro (dd/mm/yyyy)
- Moeda: Real (R$)
- Fuso horário: Brasília (UTC-3)

---

### 12.5 Manutenibilidade

**RNF-019: Código**

- Código versionado em Git
- Branching strategy: GitFlow ou GitHub Flow
- Code review obrigatório (pelo menos 1 aprovação)
- Cobertura de testes mínima: 70%
- Documentação inline (comentários em código complexo)
- Naming conventions consistentes
- Linting automático (ESLint, Pylint, etc.)
- Formatação automática (Prettier, Black, etc.)

**RNF-020: Documentação**

Documentação obrigatória:
- README com instruções de setup
- Guia de contribuição
- Arquitetura do sistema (diagramas)
- Documentação de API (Swagger/OpenAPI)
- Manual do usuário
- Manual do administrador
- Vídeos tutoriais (mínimo 5)
- FAQ
- Troubleshooting guide

**RNF-021: Logs**

- Logs estruturados (JSON)
- Níveis: DEBUG, INFO, WARN, ERROR, FATAL
- Rotação automática diária
- Retenção: 90 dias em disco, 1 ano em archive
- Centralização de logs (ex: ELK Stack, Splunk)
- Monitoramento de erros (ex: Sentry)
- Alertas para erros críticos

**RNF-022: Monitoramento**

Métricas a monitorar:
- Uptime/Downtime
- Tempo de resposta (p50, p95, p99)
- Taxa de erro (4xx, 5xx)
- Uso de CPU, memória, disco
- Conexões de banco de dados
- Tamanho de filas
- Taxa de requisições/segundo
- Sessões ativas

Ferramentas sugeridas:
- Prometheus + Grafana
- New Relic / Datadog
- AWS CloudWatch (se cloud)

---

### 12.6 Compatibilidade e Portabilidade

**RNF-023: Tecnologias**

**Backend (sugestões):**
- Linguagem: Python 3.9+, Node.js 16+, ou Java 11+
- Framework: Django/Flask, Express, ou Spring Boot
- ORM: SQLAlchemy, Sequelize, ou Hibernate
- API: REST (JSON)

**Frontend (sugestões):**
- Framework: React 18+, Vue 3+, ou Angular 14+
- Linguagem: TypeScript
- Build: Webpack, Vite, ou Create React App
- Estilização: Tailwind CSS, Bootstrap 5, ou Material-UI

**Banco de Dados:**
- Preferencial: PostgreSQL 12+
- Alternativa: MySQL 8.0+
- Não usar: SQLite (não escala)

**RNF-024: Infraestrutura**

**Opções:**
1. **On-premise:**
   - Servidor Linux (Ubuntu 20.04 LTS ou superior)
   - Mínimo: 4 vCPUs, 8GB RAM, 500GB SSD
   - Recomendado: 8 vCPUs, 16GB RAM, 1TB SSD

2. **Cloud:**
   - AWS: EC2, RDS, S3, CloudFront
   - Azure: VMs, Azure SQL, Blob Storage
   - GCP: Compute Engine, Cloud SQL, Cloud Storage

**RNF-025: Deploy**

- CI/CD automatizado (Jenkins, GitLab CI, GitHub Actions)
- Containerização (Docker)
- Orquestração (Kubernetes ou Docker Compose)
- Blue-green deployment ou canary releases
- Rollback automático em caso de falha

---

## 13. Estratégia de Testes

### 13.1 Pirâmide de Testes

```
         /\
        /  \    Testes E2E (10%)
       /____\   
      /      \  
     / Testes \  Testes de Integração (20%)
    /   de Int.\
   /____________\
  /              \
 /   Testes      \ Testes Unitários (70%)
/    Unitários    \
/__________________\
```

### 13.2 Tipos de Testes

#### 13.2.1 Testes Unitários

**Objetivo:** Testar componentes isolados

**Cobertura mínima:** 70%

**Ferramentas:**
- Python: pytest
- JavaScript: Jest, Mocha
- Java: JUnit

**Exemplos de testes:**
```python
# Teste de cálculo de mediana
def test_calcula_mediana_impar():
    precos = [18.00, 18.50, 19.00]
    assert calcula_mediana(precos) == 18.50

def test_calcula_mediana_par():
    precos = [18.00, 18.50, 19.00, 25.00]
    assert calcula_mediana(precos) == 18.75

# Teste de validação de CNPJ
def test_valida_cnpj_valido():
    assert valida_cnpj("12.345.678/0001-99") == True

def test_valida_cnpj_invalido():
    assert valida_cnpj("00.000.000/0000-00") == False
```

#### 13.2.2 Testes de Integração

**Objetivo:** Testar interação entre componentes

**Exemplos:**
- API + Banco de Dados
- Upload de arquivo + Storage
- Envio de e-mail + Servidor SMTP
- Autenticação + Active Directory

**Ferramentas:**
- Postman / Newman
- REST Assured
- Supertest

#### 13.2.3 Testes E2E (End-to-End)

**Objetivo:** Testar fluxos completos do usuário

**Ferramentas:**
- Selenium
- Cypress
- Playwright

**Casos de teste prioritários:**
1. Login → Criar demanda → Adicionar item → Cadastrar 3 preços → Gerar relatório
2. Login → Dashboard → Filtrar demandas → Exportar lista
3. Login (Gestor) → Aprovar demanda → Iniciar contratação
4. Login → Busca global → Visualizar resultado
5. Login → Editar demanda → Salvar → Verificar histórico

#### 13.2.4 Testes de Performance

**Objetivo:** Validar requisitos de performance

**Tipos:**
- **Load Testing:** comportamento sob carga normal
- **Stress Testing:** comportamento sob carga extrema
- **Spike Testing:** comportamento com picos súbitos
- **Endurance Testing:** estabilidade por período prolongado

**Ferramentas:**
- Apache JMeter
- k6
- Gatling
- LoadRunner

**Cenários:**
```
Cenário 1: Carga Normal
- 50 usuários simultâneos
- Duração: 30 minutos
- Ramp-up: 5 minutos
- Ações: login, navegar, criar demanda, buscar

Cenário 2: Carga Pico
- 150 usuários simultâneos
- Duração: 10 minutos
- Ramp-up: 2 minutos

Cenário 3: Estresse
- Incrementar usuários de 10 em 10
- Até sistema apresentar erro
- Identificar limite de capacidade
```

#### 13.2.5 Testes de Segurança

**Objetivo:** Identificar vulnerabilidades

**Tipos:**
- **SAST (Static):** análise de código fonte
- **DAST (Dynamic):** análise em runtime
- **Penetration Testing:** simulação de ataque

**Ferramentas:**
- OWASP ZAP
- Burp Suite
- SonarQube (SAST)
- Snyk (dependências)

**Checklist:**
- ✅ SQL Injection
- ✅ XSS (Reflected e Stored)
- ✅ CSRF
- ✅ Authentication bypass
- ✅ Authorization bypass
- ✅ Session hijacking
- ✅ File upload vulnerabilities
- ✅ Information disclosure
- ✅ Broken access control
- ✅ Security misconfiguration

#### 13.2.6 Testes de Usabilidade

**Objetivo:** Validar experiência do usuário

**Métodos:**
- Testes com usuários reais (5-8 pessoas)
- Task analysis (concluir tarefa específica)
- Thinking aloud (verbalizar pensamentos)
- Questionários pós-teste (SUS, NPS)

**Tarefas típicas:**
1. Cadastrar uma nova demanda
2. Adicionar um item com 3 preços
3. Gerar relatório de análise de mercado
4. Encontrar demanda específica usando busca
5. Exportar lista de demandas em Excel

**Métricas:**
- Taxa de conclusão da tarefa
- Tempo para completar tarefa
- Número de erros
- SUS Score (System Usability Scale)
- NPS (Net Promoter Score)

#### 13.2.7 Testes de Acessibilidade

**Objetivo:** Validar conformidade WCAG 2.1 AA

**Ferramentas:**
- axe DevTools
- WAVE
- Lighthouse (Chrome)
- Screen readers (NVDA, JAWS)

**Checklist:**
- ✅ Navegação por teclado completa
- ✅ Foco visível
- ✅ Contraste de cores adequado
- ✅ Textos alternativos
- ✅ Labels em formulários
- ✅ ARIA landmarks
- ✅ Compatibilidade com leitores de tela
- ✅ Sem timeout forçado
- ✅ Conteúdo piscante controlável

### 13.3 Plano de Testes

**Fase 1: Desenvolvimento**
- Testes unitários contínuos (CI)
- Code review com foco em testes
- Cobertura de código monitorada

**Fase 2: Integração**
- Testes de integração automatizados
- Testes de API (Postman collections)
- Deploy em ambiente de QA

**Fase 3: QA (Quality Assurance)**
- Testes E2E automatizados
- Testes manuais exploratórios
- Testes de regressão
- Testes de performance
- Testes de segurança (OWASP ZAP)

**Fase 4: UAT (User Acceptance Testing)**
- Testes com usuários reais
- Validação de requisitos funcionais
- Testes de usabilidade
- Feedback collection

**Fase 5: Pré-Produção**
- Smoke tests
- Testes de carga em ambiente similar a produção
- Teste de backup e recuperação
- Validação de monitoramento

### 13.4 Critérios de Aceitação de Testes

**Para avançar para UAT:**
- ✅ 100% dos testes unitários passando
- ✅ 100% dos testes de integração passando
- ✅ 95% dos testes E2E passando
- ✅ Cobertura de código ≥ 70%
- ✅ 0 bugs críticos
- ✅ ≤ 5 bugs médios
- ✅ Requisitos de performance atendidos

**Para ir para produção:**
- ✅ UAT concluído com sucesso
- ✅ Todos os bugs críticos resolvidos
- ✅ 90% dos bugs médios resolvidos
- ✅ Testes de segurança sem vulnerabilidades críticas
- ✅ Testes de acessibilidade conformes
- ✅ Aprovação do Product Owner
- ✅ Aprovação da área jurídica
- ✅ Documentação completa
- ✅ Treinamento realizado

---

## 14. Segurança e Conformidade

### 14.1 LGPD (Lei Geral de Proteção de Dados)

**Dados Pessoais Tratados:**

| Dado | Finalidade | Base Legal | Retenção |
|------|------------|------------|----------|
| Nome completo | Identificação do usuário | Execução de contrato | Enquanto ativo + 5 anos |
| CPF | Identificação única | Execução de contrato | Enquanto ativo + 5 anos |
| E-mail | Comunicação | Execução de contrato | Enquanto ativo + 5 anos |
| Matrícula | Vínculo institucional | Execução de contrato | Enquanto ativo + 5 anos |
| Telefone | Contato (opcional) | Consentimento | Enquanto ativo + 1 ano |
| IP de acesso | Segurança e auditoria | Legítimo interesse | 6 meses |
| Logs de auditoria | Conformidade legal | Obrigação legal | 5 anos |

**Direitos dos Titulares:**

Implementar funcionalidades para:
- ✅ **Acesso:** usuário pode baixar seus dados (JSON/PDF)
- ✅ **Correção:** usuário pode corrigir dados cadastrais
- ✅ **Exclusão:** usuário pode solicitar exclusão (após desligamento)
- ✅ **Portabilidade:** exportar dados em formato estruturado
- ✅ **Revogação:** revogar consentimentos (ex: receber e-mails)
- ✅ **Informação:** política de privacidade clara e acessível

**Medidas de Segurança:**
- Criptografia de dados sensíveis
- Acesso restrito por perfil
- Logs de acesso a dados pessoais
- Anonimização de dados em relatórios estatísticos
- DPO (Data Protection Officer) designado

**Relatórios LGPD:**
- Relatório de dados pessoais tratados
- Relatório de bases legais
- Registro de incidentes de segurança
- Relatório de exercício de direitos

### 14.2 Auditoria e Controle Interno

**Trilha de Auditoria:**

Registrar OBRIGATORIAMENTE:
- Login e logout
- Criação, edição e exclusão de dados
- Mudanças de status
- Aprovações e rejeições
- Ajustes manuais de valores
- Exportação de dados
- Alteração de configurações
- Gestão de usuários
- Tentativas de acesso não autorizado

**Formato do Log:**
```json
{
  "id": 12345,
  "timestamp": "2026-01-20T14:22:18.000Z",
  "usuario_id": 67890,
  "usuario_nome": "Maria Santos",
  "usuario_perfil": "gestor",
  "acao": "UPDATE",
  "entidade_tipo": "demanda",
  "entidade_id": 244,
  "campo_alterado": "valor_estimado",
  "valor_anterior": "18500.00",
  "valor_novo": "19000.00",
  "justificativa": "Ajuste devido a variação cambial...",
  "ip": "192.168.1.50",
  "user_agent": "Mozilla/5.0...",
  "resultado": "sucesso"
}
```

**Relatórios de Auditoria:**
- Por período
- Por usuário
- Por tipo de ação
- Por entidade
- Comparação antes/depois (diff)

### 14.3 Políticas de Segurança

**Política de Senhas:**
- Mínimo 8 caracteres
- Complexidade obrigatória
- Histórico de 5 senhas (não reutilizar)
- Expiração a cada 90 dias
- Bloqueio após 5 tentativas falhas

**Política de Acesso:**
- Princípio do menor privilégio
- Revisão trimestral de acessos
- Desativação imediata de usuários desligados
- Acesso temporário para auditores externos

**Política de Backup:**
- Backup diário incremental
- Backup semanal completo
- Retenção: 7 diários, 4 semanais, 12 mensais
- Teste de restauração trimestral
- Criptografia AES-256

**Política de Logs:**
- Logs são imutáveis
- Retenção mínima: 5 anos
- Backup automático
- Acesso restrito (Admin e Auditor)

---

## 15. Cronograma e Fases

### 15.1 Roadmap de Implementação

**Fase 1: MVP (Minimum Viable Product) - 3 meses**

**Objetivo:** Sistema funcional com requisitos essenciais

**Entregas:**
- ✅ Autenticação e gestão de usuários
- ✅ Cadastro de PCA
- ✅ Cadastro de demandas
- ✅ Cadastro de itens
- ✅ Registro de preços
- ✅ Cálculos estatísticos automáticos
- ✅ Validação e classificação de preços
- ✅ Relatório básico de análise de mercado (PDF)
- ✅ Log de auditoria básico

**Não inclui:**
- Dashboard complexo
- Versionamento de PCA
- Aprovação de exceções
- Integração com AD
- Relatórios avançados

**Cronograma MVP:**

```
Mês 1: Setup e Backend Core
├─ Semana 1: Setup do projeto, definição de arquitetura
├─ Semana 2: Banco de dados, autenticação básica
├─ Semana 3: API de usuários, PCA, demandas
└─ Semana 4: API de itens e preços

Mês 2: Cálculos e Relatórios
├─ Semana 5: Lógica de cálculos estatísticos
├─ Semana 6: Validação e classificação de preços
├─ Semana 7: Geração de relatório em PDF
└─ Semana 8: Log de auditoria

Mês 3: Frontend e Testes
├─ Semana 9: Interface de login e gestão de usuários
├─ Semana 10: Telas de cadastro (PCA, demanda, item)
├─ Semana 11: Tela de preços e visualização de análise
└─ Semana 12: Testes, ajustes, deploy em QA
```

---

**Fase 2: Versão Completa - 3 meses adicionais**

**Objetivo:** Adicionar funcionalidades avançadas e melhorias

**Entregas:**
- ✅ Dashboard interativo
- ✅ Versionamento de PCA
- ✅ Fluxo de aprovação de exceções
- ✅ Integração com Active Directory
- ✅ Catálogo reutilizável de itens
- ✅ Histórico de preços
- ✅ Notificações por e-mail
- ✅ Comentários e colaboração
- ✅ Relatórios avançados (PCA, auditoria)
- ✅ Importação em lote (CSV/XLSX)
- ✅ Exportação em múltiplos formatos

**Cronograma Fase 2:**

```
Mês 4: Features Avançadas
├─ Semana 13: Dashboard com gráficos
├─ Semana 14: Versionamento de PCA
├─ Semana 15: Fluxo de aprovação de exceções
└─ Semana 16: Integração com AD

Mês 5: Melhorias e Relatórios
├─ Semana 17: Catálogo e histórico de preços
├─ Semana 18: Sistema de notificações
├─ Semana 19: Comentários e colaboração
└─ Semana 20: Relatórios avançados

Mês 6: Polimento e Go-Live
├─ Semana 21: Importação/exportação em lote
├─ Semana 22: Testes completos (E2E, performance, segurança)
├─ Semana 23: UAT com usuários reais, ajustes
└─ Semana 24: Treinamento, documentação, go-live
```

---

**Fase 3: Evoluções Futuras - Roadmap 12 meses**

Priorizado conforme feedback e necessidades:

**Q1 2027 (Jan-Mar):**
- Parametrização do percentual de intervalo (não fixo em 25%)
- App mobile (visualização)
- Modo offline (Progressive Web App)

**Q2 2027 (Abr-Jun):**
- Integração com ComprasNet (busca de preços)
- Integração com Banco de Preços (estadual)
- API pública para terceiros

**Q3 2027 (Jul-Set):**
- Geração automática de textos (ETP, TR) com IA
- Sugestões inteligentes de itens similares
- Análise preditiva de preços

**Q4 2027 (Out-Dez):**
- Portal do fornecedor (cotação online)
- Módulo de pregão eletrônico
- Assinatura digital integrada (ICP-Brasil)

### 15.2 Marcos (Milestones)

| Marco | Data | Descrição |
|-------|------|-----------|
| M1 - Kickoff | 01/02/2026 | Início do projeto |
| M2 - Backend MVP | 01/03/2026 | APIs essenciais prontas |
| M3 - Frontend MVP | 01/04/2026 | Interface básica funcional |
| M4 - MVP em QA | 15/04/2026 | MVP em ambiente de testes |
| M5 - MVP Go-Live | 01/05/2026 | MVP em produção (piloto) |
| M6 - Features Avançadas | 01/06/2026 | Dashboard, versionamento, etc. |
| M7 - UAT Completo | 15/07/2026 | Testes com usuários |
| M8 - Versão 2.0 Go-Live | 01/08/2026 | Versão completa em produção |

### 15.3 Equipe Necessária

**Time Core:**
- 1 Product Owner (tempo parcial 50%)
- 1 Scrum Master / Project Manager
- 2-3 Desenvolvedores Backend
- 2 Desenvolvedores Frontend
- 1 QA / Tester
- 1 UX/UI Designer (tempo parcial)
- 1 DevOps Engineer (tempo parcial)

**Apoio:**
- Especialista em segurança (consultoria)
- DBA (consultoria)
- Área jurídica (validação)
- Usuários para UAT (5-8 pessoas)

**Total:** 8-10 pessoas (tempo integral e parcial)

---

## 16. Riscos e Mitigações

### 16.1 Riscos do Projeto

| ID | Risco | Prob. | Impacto | Mitigação |
|----|-------|-------|---------|-----------|
| R1 | Mudança de requisitos durante desenvolvimento | 🟡 Média | 🔴 Alto | Freeze de escopo após aprovação do PRD. Mudanças vão para backlog de próxima versão. |
| R2 | Atraso na disponibilização de infraestrutura | 🟢 Baixa | 🔴 Alto | Planejar com antecedência. Usar cloud como alternativa. |
| R3 | Falta de disponibilidade de usuários para UAT | 🟡 Média | 🟡 Médio | Agendar UAT com antecedência (6 semanas). Compensação de horas. |
| R4 | Complexidade de integração com Active Directory | 🟡 Média | 🟡 Médio | Fazer PoC cedo. Ter autenticação local como fallback. |
| R5 | Vulnerabilidades de segurança descobertas | 🟢 Baixa | 🔴 Alto | Testes de segurança desde o início. Contratar pentester externo. |
| R6 | Performance insuficiente com grande volume | 🟡 Média | 🔴 Alto | Testes de carga desde o MVP. Otimizar queries e adicionar cache. |
| R7 | Resistência dos usuários à mudança | 🟡 Média | 🔴 Alto | Envolver usuários desde o início. Treinamento adequado. Suporte próximo no go-live. |
| R8 | Saída de membro chave da equipe | 🟢 Baixa | 🔴 Alto | Documentação contínua. Pair programming. Gestão do conhecimento. |
| R9 | Bugs críticos em produção após go-live | 🟡 Média | 🔴 Alto | Testes abrangentes. Soft launch (piloto). Rollback plan. |
| R10 | Não conformidade com LGPD identificada após | 🟢 Baixa | 🔴 Alto | Revisão jurídica antes do go-live. Consultoria especializada. |

**Legenda:**
- Probabilidade: 🟢 Baixa (< 30%), 🟡 Média (30-70%), 🔴 Alta (> 70%)
- Impacto: 🟢 Baixo, 🟡 Médio, 🔴 Alto

### 16.2 Plano de Contingência

**Contingência para R1 (Mudança de requisitos):**
- Manter backlog priorizado
- Avaliar impacto de cada mudança
- Aprovar apenas mudanças críticas
- Agendar mudanças não críticas para próxima versão

**Contingência para R7 (Resistência dos usuários):**
- Fase de convivência: planilha + sistema por 2 meses
- Champions em cada unidade (super usuários)
- Suporte dedicado nas primeiras 2 semanas
- Coleta de feedback contínua

**Contingência para R9 (Bugs críticos em produção):**
- Rollback para versão anterior
- Hotfix prioritário
- Comunicação transparente com usuários
- Post-mortem para evitar recorrência

---

## 17. Métricas de Sucesso e KPIs

### 17.1 KPIs de Adoção

| Métrica | Meta Mês 1 | Meta Mês 3 | Meta Mês 6 |
|---------|------------|------------|------------|
| Usuários ativos mensais | 20 | 50 | 80 |
| Taxa de login semanal | 40% | 70% | 90% |
| Demandas cadastradas | 10 | 50 | 100 |
| Análises concluídas | 5 | 30 | 80 |
| Relatórios gerados | 10 | 60 | 150 |

### 17.2 KPIs de Eficiência

| Métrica | Baseline (Atual) | Meta (6 meses) | Melhoria |
|---------|------------------|----------------|----------|
| Tempo médio para análise de mercado | 4-6 horas | 1-2 horas | -70% |
| Taxa de erro em cálculos | 15% | 0% | -100% |
| Tempo para gerar relatório | 1-2 horas | 2 minutos | -98% |
| Retrabalho por análise | 2 horas | 0 horas | -100% |

### 17.3 KPIs de Qualidade

| Métrica | Meta |
|---------|------|
| Bugs críticos em produção | 0 |
| Bugs médios em produção | < 5 |
| Uptime | ≥ 99% |
| NPS (Net Promoter Score) | ≥ 50 |
| SUS (System Usability Scale) | ≥ 70 |
| CSAT (Customer Satisfaction) | ≥ 4.0/5.0 |

### 17.4 KPIs de Conformidade

| Métrica | Meta |
|---------|------|
| Análises com metodologia correta | 100% |
| Análises com evidências completas | 100% |
| Aprovação em auditorias | 100% |
| Incidentes de segurança | 0 |
| Violações LGPD | 0 |

### 17.5 Como Medir

**Dashboard de Métricas:**
- Integrado ao sistema
- Atualização em tempo real
- Exportável (PDF, XLSX)
- Comparação com períodos anteriores

**Coleta de Feedback:**
- Pesquisa NPS trimestral
- Formulário de satisfação após treinamento
- Botão de feedback em cada tela
- Entrevistas semestrais com usuários

---

## 18. Roadmap Futuro

### 18.1 Funcionalidades Planejadas (2027-2028)

**Integrações:**
- ✨ Integração com ComprasNet (busca automática de preços)
- ✨ Integração com Banco de Preços estaduais
- ✨ Integração com sistema de protocolo
- ✨ Integração com ERP (TOTVS, SAP, etc.)
- ✨ API pública para terceiros

**Inteligência Artificial:**
- 🤖 Geração automática de descrição de itens
- 🤖 Sugestão inteligente de itens similares
- 🤖 Análise preditiva de preços
- 🤖 Detecção de anomalias (preços suspeitos)
- 🤖 Chatbot para suporte

**Mobile:**
- 📱 App nativo (iOS e Android)
- 📱 Notificações push
- 📱 Assinatura digital mobile

**Avançado:**
- 🔐 Assinatura digital ICP-Brasil
- 🔗 Blockchain para rastreabilidade
- 📊 Business Intelligence (BI) integrado
- 🌐 Portal do fornecedor (cotação online)
- 🎯 Módulo de pregão eletrônico

### 18.2 Versões Planejadas

**v2.1 (Trimestre 3/2026):**
- Parametrização de intervalos
- Análise comparativa entre exercícios
- Melhorias de performance

**v2.2 (Trimestre 4/2026):**
- App mobile
- Modo offline (PWA)
- Melhorias de UX

**v3.0 (2027):**
- Integrações externas
- IA para sugestões
- Portal do fornecedor

---

## 19. Glossário

| Termo | Definição |
|-------|-----------|
| **PCA** | Plano de Contratações Anual - documento que consolida todas as contratações previstas para o exercício |
| **Demanda** | Necessidade de contratação identificada e registrada no PCA |
| **Análise de Mercado** | Processo de coleta e análise de preços para estimativa |
| **Mediana** | Valor central de uma série ordenada de números |
| **Intervalo de Aceitação** | Faixa de preços considerados válidos (±25% da mediana) |
| **ETP** | Estudo Técnico Preliminar - documento que fundamenta a contratação |
| **TR** | Termo de Referência - especificação técnica do objeto |
| **SIAFI** | Sistema Integrado de Administração Financeira |
| **CATMAT/CATSER** | Catálogo de Materiais e Serviços do Governo Federal |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **MVP** | Minimum Viable Product - versão mínima funcional |
| **UAT** | User Acceptance Testing - testes com usuários finais |
| **SLA** | Service Level Agreement - acordo de nível de serviço |
| **RTO** | Recovery Time Objective - tempo máximo de recuperação |
| **RPO** | Recovery Point Objective - ponto máximo de recuperação |

---

## 20. Anexos

### 20.1 Checklist de Go-Live

**30 dias antes:**
- [ ] Todos os requisitos de prioridade ALTA implementados
- [ ] 90% dos requisitos de prioridade MÉDIA implementados
- [ ] Testes E2E completos e aprovados
- [ ] Testes de performance aprovados
- [ ] Testes de segurança sem vulnerabilidades críticas
- [ ] UAT agendado com usuários

**15 dias antes:**
- [ ] UAT concluído com aprovação
- [ ] Todos os bugs críticos corrigidos
- [ ] 90% dos bugs médios corrigidos
- [ ] Documentação completa (usuário e admin)
- [ ] Vídeos tutoriais produzidos
- [ ] Treinamento agendado

**7 dias antes:**
- [ ] Treinamento de usuários concluído
- [ ] Infraestrutura de produção provisionada
- [ ] Backup e disaster recovery testados
- [ ] Monitoramento configurado
- [ ] Suporte dedicado alocado

**1 dia antes:**
- [ ] Deploy em produção realizado
- [ ] Smoke tests aprovados
- [ ] Dados de produção migrados (se aplicável)
- [ ] Comunicação enviada a todos os usuários
- [ ] Plano de rollback validado

**Dia do Go-Live:**
- [ ] Sistema disponível às 08h
- [ ] Equipe de suporte em standby
- [ ] Monitoramento ativo
- [ ] Comunicação de status em tempo real

**Pós Go-Live (1 semana):**
- [ ] Acompanhamento diário de uso
- [ ] Coleta de feedback
- [ ] Resolução rápida de problemas
- [ ] Ajustes finos conforme necessário
- [ ] Retrospectiva com equipe

### 20.2 Contatos e Responsáveis

**Equipe do Projeto:**
- Product Owner: [Nome] - [email] - [telefone]
- Scrum Master: [Nome] - [email] - [telefone]
- Tech Lead: [Nome] - [email] - [telefone]
- QA Lead: [Nome] - [email] - [telefone]

**Stakeholders:**
- Secretário/Diretor: [Nome] - [email]
- Gestor de Compras: [Nome] - [email]
- Controle Interno: [Nome] - [email]
- TI: [Nome] - [email]
- Jurídico: [Nome] - [email]

**Suporte:**
- E-mail: suporte@sistema.go.gov.br
- Telefone: (62) 3333-4444
- Horário: Segunda a sexta, 08h-18h

### 20.3 Referências

**Legislação:**
- [Decreto Estadual nº 9.900/2021](link)
- [Lei nº 14.133/2021 - Nova Lei de Licitações](link)
- [Lei nº 13.709/2018 - LGPD](link)

**Documentação Técnica:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API REST Best Practices](link)

**Padrões de Projeto:**
- [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Twelve-Factor App](https://12factor.net/)
- [Clean Code](link)

---

## Conclusão

Este PRD documenta de forma completa e estruturada o **Sistema de Análise de Mercado para Licitações Públicas**. 

O sistema proposto vai além de uma simples automatização de planilhas: trata-se de uma solução integrada que:
- ✅ Reduz significativamente o tempo de trabalho
- ✅ Elimina erros de cálculo manual
- ✅ Garante conformidade legal e normativa
- ✅ Fornece rastreabilidade completa
- ✅ Facilita auditorias e prestação de contas
- ✅ Promove transparência e eficiência

Com a implementação planejada em 2 fases (MVP em 3 meses + versão completa em 6 meses), o Estado de Goiás terá uma ferramenta moderna, segura e escalável para gestão de suas contratações públicas.

**Próximos Passos:**
1. Aprovação formal do PRD pela alta gestão
2. Alocação de recursos (orçamento e equipe)
3. Kickoff do projeto
4. Sprint 0 (setup e planejamento detalhado)
5. Início do desenvolvimento

---

**Versão:** 2.0 - Completa e Funcional  
**Status:** Aguardando Aprovação  
**Data:** Janeiro de 2026

**Elaborado por:** Equipe de Desenvolvimento  
**Aprovado por:** _________________  
**Data de Aprovação:** ____/____/______

---

**FIM DO PRD - DOCUMENTO COMPLETO**

Este documento foi elaborado em 5 partes para facilitar a leitura e manutenção:
- ✅ Parte 1: Visão Geral, Base Legal, Personas e Escopo
- ✅ Parte 2: Requisitos Funcionais Detalhados
- ✅ Parte 3: Requisitos Não Funcionais e Regras de Negócio
- ✅ Parte 4: Modelo de Dados e Interface do Usuário
- ✅ Parte 5: Testes, Segurança, Cronograma e Roadmap
