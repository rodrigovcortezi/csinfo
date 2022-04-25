-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hltvId" INTEGER NOT NULL,
    "hltvSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT
);
INSERT INTO "new_Event" ("hltvId", "hltvSlug", "id", "logoUrl", "name") SELECT "hltvId", "hltvSlug", "id", "logoUrl", "name" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_hltvId_key" ON "Event"("hltvId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
