# PRD – Sistema de Análise de Mercado para Licitações Públicas
## PARTE 3 - Requisitos Funcionais (Continuação), Não Funcionais e Regras de Negócio

**Versão:** 2.0  
**Data:** Janeiro de 2026

---

## Índice da Parte 3

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

**FIM DA PARTE 3**

➡️ **Continue na Parte 4:** Modelo de Dados e Interface do Usuário
