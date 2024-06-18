/*
  Warnings:

  - You are about to drop the column `color` on the `product_variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "color";

-- CreateTable
CREATE TABLE "colors" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" TEXT NOT NULL,
    "images" TEXT[],
    "variant_id" INTEGER,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "colors_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
