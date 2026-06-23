/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropIndex
DROP INDEX "OrderItem_orderId_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "orderId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT;

-- CreateIndex
CREATE INDEX "OrderItem_id_idx" ON "OrderItem"("id");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_id_fkey" FOREIGN KEY ("id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
