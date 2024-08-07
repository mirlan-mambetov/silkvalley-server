/*
  Warnings:

  - Changed the type of `ordered` on the `product_variant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "ordered",
ADD COLUMN     "ordered" INTEGER NOT NULL;
