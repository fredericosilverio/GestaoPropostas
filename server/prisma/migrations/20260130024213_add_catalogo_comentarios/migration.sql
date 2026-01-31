-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "perfil" TEXT NOT NULL DEFAULT 'OPERADOR',
    "unidade_vinculada" TEXT,
    "senha_hash" TEXT,
    "usa_ad" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acesso" DATETIME,
    "data_expiracao_senha" DATETIME,
    "tentativas_falhas" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_ate" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL,
    "numero_pca" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'EM_ELABORACAO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_aprovacao" DATETIME,
    "responsavel_id" INTEGER NOT NULL,
    "observacoes" TEXT,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "versao_anterior_id" INTEGER,
    "motivo_versao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pca_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pca_versao_anterior_id_fkey" FOREIGN KEY ("versao_anterior_id") REFERENCES "pca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "demanda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pca_id" INTEGER NOT NULL,
    "numero_projeto" INTEGER NOT NULL,
    "codigo_demanda" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "justificativa_tecnica" TEXT NOT NULL,
    "justificativa_administrativa" TEXT NOT NULL,
    "valor_estimado_global" DECIMAL,
    "valor_estimado_ajustado" DECIMAL,
    "justificativa_ajuste" TEXT,
    "ajustado_por_id" INTEGER,
    "ajustado_em" DATETIME,
    "data_prevista_contratacao" DATETIME NOT NULL,
    "tipo_contratacao" TEXT NOT NULL,
    "natureza_despesa" TEXT NOT NULL,
    "elemento_despesa" TEXT NOT NULL,
    "unidade_demandante" TEXT NOT NULL,
    "responsavel_id" INTEGER NOT NULL,
    "centro_custo" TEXT NOT NULL,
    "prazo_vigencia_meses" INTEGER NOT NULL,
    "cnae" TEXT,
    "fonte_recursos" TEXT,
    "programa_acao" TEXT,
    "processo_administrativo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CADASTRADA',
    "data_cancelamento" DATETIME,
    "justificativa_cancelamento" TEXT,
    "motivo_cancelamento" TEXT,
    "numero_processo_licitatorio" TEXT,
    "numero_contrato" TEXT,
    "data_contrato" DATETIME,
    "valor_contratado" DECIMAL,
    "cnpj_fornecedor_contratado" TEXT,
    "razao_social_contratado" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "demanda_pca_id_fkey" FOREIGN KEY ("pca_id") REFERENCES "pca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "demanda_ajustado_por_id_fkey" FOREIGN KEY ("ajustado_por_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "demanda_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "demanda_id" INTEGER NOT NULL,
    "codigo_item" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "especificacoes_tecnicas" TEXT,
    "unidade_medida" TEXT NOT NULL,
    "quantidade" DECIMAL NOT NULL,
    "elemento_despesa" TEXT NOT NULL,
    "marca_referencia" TEXT,
    "codigo_catmat" TEXT,
    "valor_estimado_unitario" DECIMAL,
    "valor_estimado_total" DECIMAL,
    "valor_ajustado_unitario" DECIMAL,
    "justificativa_ajuste" TEXT,
    "ajustado_por_id" INTEGER,
    "ajustado_em" DATETIME,
    "observacoes" TEXT,
    "analise_concluida" BOOLEAN NOT NULL DEFAULT false,
    "data_conclusao_analise" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "item_demanda_id_fkey" FOREIGN KEY ("demanda_id") REFERENCES "demanda" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "item_ajustado_por_id_fkey" FOREIGN KEY ("ajustado_por_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "preco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "fonte" TEXT NOT NULL,
    "tipo_fonte" TEXT NOT NULL,
    "valor_unitario" DECIMAL NOT NULL,
    "data_coleta" DATETIME NOT NULL,
    "unidade_medida" TEXT NOT NULL,
    "cnpj_fornecedor" TEXT,
    "razao_social" TEXT,
    "cidade_uf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "numero_referencia" TEXT,
    "link_fonte" TEXT,
    "observacoes" TEXT,
    "classificacao" TEXT NOT NULL,
    "percentual_variacao" DECIMAL,
    "justificativa_inclusao" TEXT,
    "solicitacao_aprovacao" BOOLEAN NOT NULL DEFAULT false,
    "aprovado" BOOLEAN,
    "aprovado_por_id" INTEGER,
    "aprovado_em" DATETIME,
    "motivo_aprovacao" TEXT,
    "cadastrado_por_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "preco_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "preco_aprovado_por_id_fkey" FOREIGN KEY ("aprovado_por_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "preco_cadastrado_por_id_fkey" FOREIGN KEY ("cadastrado_por_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "anexo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entidade_tipo" TEXT NOT NULL,
    "entidade_id" INTEGER NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "nome_arquivo_storage" TEXT NOT NULL,
    "extensao" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "hash_md5" TEXT NOT NULL,
    "path_storage" TEXT NOT NULL,
    "descricao" TEXT,
    "uploaded_by_id" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "anexo_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico_log" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "usuario_id" INTEGER,
    "data_hora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao" TEXT NOT NULL,
    "entidade_tipo" TEXT NOT NULL,
    "entidade_id" INTEGER,
    "campo_alterado" TEXT,
    "valor_anterior" TEXT,
    "valor_novo" TEXT,
    "descricao" TEXT,
    "ip_origem" TEXT,
    "user_agent" TEXT,
    "resultado" TEXT NOT NULL DEFAULT 'SUCESSO',
    "mensagem_erro" TEXT,
    CONSTRAINT "historico_log_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "configuracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL,
    "editavel" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "item_catalogo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "especificacoes_tecnicas" TEXT,
    "unidade_medida" TEXT NOT NULL,
    "codigo_catmat" TEXT,
    "categoria" TEXT,
    "preco_referencia" DECIMAL,
    "data_atualizacao_preco" DATETIME,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "comentario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "demanda_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_matricula_key" ON "usuario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pca_ano_numero_pca_orgao_versao_key" ON "pca"("ano", "numero_pca", "orgao", "versao");

-- CreateIndex
CREATE UNIQUE INDEX "demanda_codigo_demanda_key" ON "demanda"("codigo_demanda");

-- CreateIndex
CREATE UNIQUE INDEX "item_demanda_id_codigo_item_key" ON "item"("demanda_id", "codigo_item");

-- CreateIndex
CREATE UNIQUE INDEX "configuracao_chave_key" ON "configuracao"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "item_catalogo_codigo_key" ON "item_catalogo"("codigo");
