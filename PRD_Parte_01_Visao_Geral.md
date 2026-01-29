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

## Índice do Documento Completo

Este PRD está dividido em 5 partes:

- **Parte 1:** Visão Geral, Base Legal, Personas e Escopo (este arquivo)
- **Parte 2:** Requisitos Funcionais Detalhados
- **Parte 3:** Requisitos Não Funcionais, Regras de Negócio e Fluxos
- **Parte 4:** Modelo de Dados e Interface do Usuário
- **Parte 5:** Testes, Segurança, Cronograma e Roadmap

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
- Identificar demandas pelo padrão **PCA[Ano]-[NúmeroPCA]-[NúmeroProjeto]**
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

**FIM DA PARTE 1**

➡️ **Continue na Parte 2:** Requisitos Funcionais Detalhados
