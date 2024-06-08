/*
  Warnings:

  - Added the required column `lat` to the `PointsDeliver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `PointsDeliver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PointsDeliver" ADD COLUMN     "lat" INTEGER NOT NULL,
ADD COLUMN     "lng" INTEGER NOT NULL;
