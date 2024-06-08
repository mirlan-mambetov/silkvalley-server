/*
  Warnings:

  - You are about to drop the column `city` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `city_district` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `house_number` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `post_code` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `road` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `town` on the `orders_address` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `orders_address` table. All the data in the column will be lost.
  - Added the required column `name` to the `orders_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders_address" DROP COLUMN "city",
DROP COLUMN "city_district",
DROP COLUMN "country",
DROP COLUMN "country_code",
DROP COLUMN "house_number",
DROP COLUMN "post_code",
DROP COLUMN "road",
DROP COLUMN "state",
DROP COLUMN "town",
DROP COLUMN "village",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_order_id_key" ON "Location"("order_id");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
