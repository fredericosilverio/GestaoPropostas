-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL,
    "numero_pca" TEXT NOT NULL,
    "denominacao" TEXT,
    "orgao" TEXT NOT NULL,
    "unidade_demandante" TEXT,
    "area_tecnica" TEXT,
    "responsavel_id" INTEGER NOT NULL,
    "responsavel_consolidacao_id" INTEGER,
    "contato_email" TEXT,
    "contato_telefone" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "versao_anterior_id" INTEGER,
    "motivo_versao" TEXT,
    "historico_alteracoes" TEXT,
    "situacao" TEXT NOT NULL DEFAULT 'EM_ELABORACAO',
    "periodo_vigencia_inicio" DATETIME,
    "periodo_vigencia_fim" DATETIME,
    "data_aprovacao" DATETIME,
    "autoridade_aprovadora" TEXT,
    "cargo_autoridade" TEXT,
    "forma_aprovacao" TEXT,
    "documento_aprovacao" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pca_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pca_responsavel_consolidacao_id_fkey" FOREIGN KEY ("responsavel_consolidacao_id") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pca_versao_anterior_id_fkey" FOREIGN KEY ("versao_anterior_id") REFERENCES "pca" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pca" ("ano", "ativo", "created_at", "data_aprovacao", "data_criacao", "id", "motivo_versao", "numero_pca", "observacoes", "orgao", "responsavel_id", "situacao", "updated_at", "versao", "versao_anterior_id") SELECT "ano", "ativo", "created_at", "data_aprovacao", "data_criacao", "id", "motivo_versao", "numero_pca", "observacoes", "orgao", "responsavel_id", "situacao", "updated_at", "versao", "versao_anterior_id" FROM "pca";
DROP TABLE "pca";
ALTER TABLE "new_pca" RENAME TO "pca";
CREATE UNIQUE INDEX "pca_ano_numero_pca_orgao_versao_key" ON "pca"("ano", "numero_pca", "orgao", "versao");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
