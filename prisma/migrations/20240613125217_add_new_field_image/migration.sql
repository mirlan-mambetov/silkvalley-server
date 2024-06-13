/*
  Warnings:

  - Added the required column `image` to the `promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "promotion" ADD COLUMN     "image" TEXT NOT NULL;
