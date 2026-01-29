# PRD – Sistema de Análise de Mercado para Licitações Públicas
## PARTE 4 - Modelo de Dados, Interface do Usuário e Casos de Uso

**Versão:** 2.0  
**Data:** Janeiro de 2026

---

## Índice da Parte 4

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

*Continua...*

**FIM DA PARTE 4**

➡️ **Continue na Parte 5:** Testes, Segurança, Cronograma e Roadmap
