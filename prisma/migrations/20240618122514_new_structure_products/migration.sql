/*
  Warnings:

  - You are about to drop the column `name` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `alias` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `article_number` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `childs_category_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_hit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_new` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `promotion_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sales` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `second_category_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `product_attributes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "product_attributes" DROP CONSTRAINT "product_attributes_productId_fkey";

-- DropForeignKey
ALTER TABLE "specification" DROP CONSTRAINT "specification_productId_fkey";

-- DropIndex
DROP INDEX "product_alias_key";

-- DropIndex
DROP INDEX "product_article_number_key";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "name",
DROP COLUMN "sizes",
ADD COLUMN     "size" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "alias",
DROP COLUMN "article_number",
DROP COLUMN "childs_category_id",
DROP COLUMN "discount",
DROP COLUMN "is_hit",
DROP COLUMN "is_new",
DROP COLUMN "price",
DROP COLUMN "promotion_id",
DROP COLUMN "quantity",
DROP COLUMN "rating",
DROP COLUMN "sales",
DROP COLUMN "second_category_id",
DROP COLUMN "video",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "specification" ADD COLUMN     "variants_id" INTEGER;

-- DropTable
DROP TABLE "product_attributes";

-- CreateTable
CREATE TABLE "product_variant" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,
    "article_number" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "rating" INTEGER,
    "discount" INTEGER,
    "is_hit" BOOLEAN DEFAULT false,
    "is_new" BOOLEAN DEFAULT false,
    "sales" INTEGER DEFAULT 0,
    "video" TEXT,
    "promotion_id" INTEGER,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_article_number_key" ON "product_variant"("article_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specification" ADD CONSTRAINT "specification_variants_id_fkey" FOREIGN KEY ("variants_id") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
