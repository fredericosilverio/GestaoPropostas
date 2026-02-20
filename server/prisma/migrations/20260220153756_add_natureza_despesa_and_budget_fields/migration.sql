-- CreateTable
CREATE TABLE "natureza_despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_item" (
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
    "natureza_despesa_id" INTEGER,
    "percentual_1grau" DECIMAL,
    "percentual_2grau" DECIMAL,
    "percentual_area_meio" DECIMAL,
    "tipo_despesa" TEXT,
    "forma_pagamento" TEXT,
    CONSTRAINT "item_demanda_id_fkey" FOREIGN KEY ("demanda_id") REFERENCES "demanda" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "item_ajustado_por_id_fkey" FOREIGN KEY ("ajustado_por_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "item_natureza_despesa_id_fkey" FOREIGN KEY ("natureza_despesa_id") REFERENCES "natureza_despesa" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_item" ("ajustado_em", "ajustado_por_id", "analise_concluida", "ativo", "codigo_catmat", "codigo_item", "created_at", "data_conclusao_analise", "demanda_id", "descricao", "elemento_despesa", "especificacoes_tecnicas", "id", "justificativa_ajuste", "marca_referencia", "observacoes", "quantidade", "unidade_medida", "updated_at", "valor_ajustado_unitario", "valor_estimado_total", "valor_estimado_unitario") SELECT "ajustado_em", "ajustado_por_id", "analise_concluida", "ativo", "codigo_catmat", "codigo_item", "created_at", "data_conclusao_analise", "demanda_id", "descricao", "elemento_despesa", "especificacoes_tecnicas", "id", "justificativa_ajuste", "marca_referencia", "observacoes", "quantidade", "unidade_medida", "updated_at", "valor_ajustado_unitario", "valor_estimado_total", "valor_estimado_unitario" FROM "item";
DROP TABLE "item";
ALTER TABLE "new_item" RENAME TO "item";
CREATE UNIQUE INDEX "item_demanda_id_codigo_item_key" ON "item"("demanda_id", "codigo_item");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "natureza_despesa_codigo_key" ON "natureza_despesa"("codigo");
