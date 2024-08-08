/*
  Warnings:

  - A unique constraint covering the columns `[order_id,product_variant_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_items_order_id_key";

-- DropIndex
DROP INDEX "order_items_product_variant_id_key";

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalCache" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_product_variant_id_key" ON "order_items"("order_id", "product_variant_id");
