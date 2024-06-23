/*
  Warnings:

  - You are about to drop the column `promotion_id` on the `product_variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_promotion_id_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "promotion_id" INTEGER;

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "promotion_id";

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
