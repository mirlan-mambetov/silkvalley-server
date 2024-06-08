/*
  Warnings:

  - You are about to drop the column `lat` on the `points_deliver` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `points_deliver` table. All the data in the column will be lost.
  - You are about to drop the `online_users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[points_delivery_location]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_order_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_is_online_id_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "points_delivery_location" INTEGER,
ALTER COLUMN "order_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "points_deliver" DROP COLUMN "lat",
DROP COLUMN "lng";

-- DropTable
DROP TABLE "online_users";

-- CreateIndex
CREATE UNIQUE INDEX "Location_points_delivery_location_key" ON "Location"("points_delivery_location");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_points_delivery_location_fkey" FOREIGN KEY ("points_delivery_location") REFERENCES "points_deliver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
