/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `product_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id]` on the table `product_category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_category_product_id_category_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "product_category_product_id_key" ON "product_category"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_category_id_key" ON "product_category"("category_id");
