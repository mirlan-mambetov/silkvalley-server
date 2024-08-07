/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_variant_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_items_order_id_product_variant_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_key" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_product_variant_id_key" ON "order_items"("product_variant_id");
