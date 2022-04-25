-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hltvId" INTEGER NOT NULL,
    "hltvSlug" TEXT NOT NULL,
    "eventId" INTEGER,
    "team1Id" INTEGER,
    "team2Id" INTEGER,
    "date" DATETIME NOT NULL,
    "meta" TEXT NOT NULL,
    CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("date", "eventId", "hltvId", "hltvSlug", "id", "meta", "team1Id", "team2Id") SELECT "date", "eventId", "hltvId", "hltvSlug", "id", "meta", "team1Id", "team2Id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_hltvId_key" ON "Match"("hltvId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
