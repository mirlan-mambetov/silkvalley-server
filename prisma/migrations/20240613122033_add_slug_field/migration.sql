/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `promotion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "promotion" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "promotion_slug_key" ON "promotion"("slug");
