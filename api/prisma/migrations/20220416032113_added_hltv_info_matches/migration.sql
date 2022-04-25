/*
  Warnings:

  - Added the required column `hltvId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hltvSlug` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hltvId" INTEGER NOT NULL,
    "hltvSlug" TEXT NOT NULL,
    "team1Id" INTEGER NOT NULL,
    "team2Id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "meta" TEXT NOT NULL,
    CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("date", "id", "meta", "team1Id", "team2Id") SELECT "date", "id", "meta", "team1Id", "team2Id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_hltvId_key" ON "Match"("hltvId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
