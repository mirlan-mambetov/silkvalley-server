/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_points_delivery_location_fkey";

-- DropTable
DROP TABLE "Location";

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "order_id" INTEGER,
    "points_delivery_location" INTEGER,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_order_id_key" ON "location"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_points_delivery_location_key" ON "location"("points_delivery_location");

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_points_delivery_location_fkey" FOREIGN KEY ("points_delivery_location") REFERENCES "points_deliver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
