-- DropIndex
DROP INDEX "Category_slug_key";

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT,
    "storeName" TEXT NOT NULL DEFAULT 'Sofía',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
