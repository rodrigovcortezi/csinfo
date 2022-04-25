-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hltvId" INTEGER NOT NULL,
    "hltvSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "team1Id" INTEGER NOT NULL,
    "team2Id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "meta" TEXT NOT NULL,
    CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_hltvId_key" ON "Team"("hltvId");
