-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'SUPERUSER', 'OWNER');

-- CreateEnum
CREATE TYPE "EnumStatusOrder" AS ENUM ('WAITING', 'PAYED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EnumPaymentMethod" AS ENUM ('CACHE', 'CARD', 'MBANK');

-- CreateEnum
CREATE TYPE "EnumTypeNotification" AS ENUM ('ORDER', 'PAYMENT_METHOD', 'PROMOTION', 'PROFILE');

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expire" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER,
    "type_notification" "EnumTypeNotification" NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineUsers" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "EnumStatusOrder" NOT NULL DEFAULT 'WAITING',
    "totalCache" INTEGER NOT NULL,
    "payment_type" "EnumPaymentMethod",
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAddress" (
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

    CONSTRAINT "OrderAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "color" TEXT,
    "sizes" TEXT,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "article_number" TEXT NOT NULL,
    "rating" INTEGER,
    "video" TEXT,
    "discount" INTEGER,
    "is_hit" BOOLEAN DEFAULT false,
    "is_new" BOOLEAN DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "sales" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category_id" INTEGER,
    "second_category_id" INTEGER,
    "childs_category_id" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" SERIAL NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "images" TEXT[],
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "second_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "second_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parent_category_id" INTEGER NOT NULL,

    CONSTRAINT "child_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_is_online_id_key" ON "User"("is_online_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderAddress_order_id_key" ON "OrderAddress"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_alias_key" ON "product"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "product_article_number_key" ON "product"("article_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "second_category_slug_key" ON "second_category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "child_categories_slug_key" ON "child_categories"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_is_online_id_fkey" FOREIGN KEY ("is_online_id") REFERENCES "OnlineUsers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_childs_category_id_fkey" FOREIGN KEY ("childs_category_id") REFERENCES "child_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_second_category_id_fkey" FOREIGN KEY ("second_category_id") REFERENCES "second_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specification" ADD CONSTRAINT "specification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "second_category" ADD CONSTRAINT "second_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_categories" ADD CONSTRAINT "child_categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "second_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
