/*
  Warnings:

  - You are about to drop the `OnlineUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointsDeliver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderAddress" DROP CONSTRAINT "OrderAddress_order_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_is_online_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropTable
DROP TABLE "OnlineUsers";

-- DropTable
DROP TABLE "OrderAddress";

-- DropTable
DROP TABLE "PointsDeliver";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT DEFAULT '/images/default-avatar.png',
    "role" "UserRoles"[] DEFAULT ARRAY['USER']::"UserRoles"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_online_id" INTEGER,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "test_field" TEXT DEFAULT '',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_deliver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "points_deliver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_address" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "road" TEXT,
    "house_number" TEXT,
    "post_code" TEXT,
    "country_code" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city_district" TEXT,
    "village" TEXT,
    "town" TEXT,
    "order_id" INTEGER,

    CONSTRAINT "orders_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_is_online_id_key" ON "users"("is_online_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_address_order_id_key" ON "orders_address"("order_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_is_online_id_fkey" FOREIGN KEY ("is_online_id") REFERENCES "online_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_address" ADD CONSTRAINT "orders_address_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
