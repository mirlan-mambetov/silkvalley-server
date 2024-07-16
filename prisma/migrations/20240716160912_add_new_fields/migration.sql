-- AlterTable
ALTER TABLE "product" ADD COLUMN     "default_price" INTEGER,
ADD COLUMN     "default_size" TEXT,
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
