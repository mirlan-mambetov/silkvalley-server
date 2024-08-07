/*
  Warnings:

  - You are about to drop the column `ordered` on the `orders` table. All the data in the column will be lost.
  - Added the required column `ordered` to the `product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "ordered";

-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "ordered" TEXT NOT NULL;
