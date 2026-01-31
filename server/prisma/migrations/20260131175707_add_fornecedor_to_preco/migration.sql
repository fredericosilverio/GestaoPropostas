-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_preco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "fonte" TEXT NOT NULL,
    "tipo_fonte" TEXT NOT NULL,
    "valor_unitario" DECIMAL NOT NULL,
    "data_coleta" DATETIME NOT NULL,
    "unidade_medida" TEXT NOT NULL,
    "fornecedor_id" INTEGER,
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
    CONSTRAINT "preco_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "preco_aprovado_por_id_fkey" FOREIGN KEY ("aprovado_por_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "preco_cadastrado_por_id_fkey" FOREIGN KEY ("cadastrado_por_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_preco" ("aprovado", "aprovado_em", "aprovado_por_id", "ativo", "cadastrado_por_id", "cidade_uf", "classificacao", "cnpj_fornecedor", "created_at", "data_coleta", "email", "fonte", "id", "item_id", "justificativa_inclusao", "link_fonte", "motivo_aprovacao", "numero_referencia", "observacoes", "percentual_variacao", "razao_social", "solicitacao_aprovacao", "telefone", "tipo_fonte", "unidade_medida", "updated_at", "valor_unitario") SELECT "aprovado", "aprovado_em", "aprovado_por_id", "ativo", "cadastrado_por_id", "cidade_uf", "classificacao", "cnpj_fornecedor", "created_at", "data_coleta", "email", "fonte", "id", "item_id", "justificativa_inclusao", "link_fonte", "motivo_aprovacao", "numero_referencia", "observacoes", "percentual_variacao", "razao_social", "solicitacao_aprovacao", "telefone", "tipo_fonte", "unidade_medida", "updated_at", "valor_unitario" FROM "preco";
DROP TABLE "preco";
ALTER TABLE "new_preco" RENAME TO "preco";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
