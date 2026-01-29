# PRD – Sistema de Análise de Mercado para Licitações Públicas
## PARTE 2 - Requisitos Funcionais Detalhados

**Versão:** 2.0  
**Data:** Janeiro de 2026

---

## Índice da Parte 2

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

*Continua na Parte 3...*

**FIM DA PARTE 2**

➡️ **Continue na Parte 3:** Requisitos Não Funcionais, Regras de Negócio e Fluxos
