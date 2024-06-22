/*
  Warnings:

  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[variant_id]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `product_variant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_product_id_fkey";

-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "orderId" INTEGER;

-- DropTable
DROP TABLE "order_item";

-- CreateIndex
CREATE UNIQUE INDEX "colors_variant_id_key" ON "colors"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_orderId_key" ON "product_variant"("orderId");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
