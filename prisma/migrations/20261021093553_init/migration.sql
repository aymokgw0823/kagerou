-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "business" TEXT,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "email" TEXT NOT NULL,
    "tel" TEXT,
    "company" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "extra" TEXT,
    "consultationId" TEXT,
    "source" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "email" TEXT NOT NULL,
    "tel" TEXT,
    "business" TEXT NOT NULL,
    "topic" TEXT,
    "slot" DATETIME NOT NULL,
    "altSlot" DATETIME,
    "note" TEXT,
    "consultationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobSlug" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kana" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "address" TEXT,
    "message" TEXT,
    "resumeKey" TEXT,
    "resumeName" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tool" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "inputSummary" TEXT,
    "resultJson" TEXT,
    "emailMasked" TEXT,
    "tokensIn" INTEGER NOT NULL DEFAULT 0,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL DEFAULT 'demo',
    "sessionId" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateTable
CREATE TABLE "DailyUsage" (
    "date" TEXT NOT NULL PRIMARY KEY,
    "tokensIn" INTEGER NOT NULL DEFAULT 0,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "calls" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_kind_idx" ON "Lead"("kind");

-- CreateIndex
CREATE INDEX "Booking_slot_idx" ON "Booking"("slot");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Entry_createdAt_idx" ON "Entry"("createdAt");

-- CreateIndex
CREATE INDEX "Consultation_tool_createdAt_idx" ON "Consultation"("tool", "createdAt");
