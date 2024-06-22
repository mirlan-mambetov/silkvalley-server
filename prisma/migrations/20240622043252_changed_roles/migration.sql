/*
  Warnings:

  - The values [MODERATOR,SUPERUSER] on the enum `UserRoles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRoles_new" AS ENUM ('USER', 'ADMIN', 'OWNER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRoles_new"[] USING ("role"::text::"UserRoles_new"[]);
ALTER TYPE "UserRoles" RENAME TO "UserRoles_old";
ALTER TYPE "UserRoles_new" RENAME TO "UserRoles";
DROP TYPE "UserRoles_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT ARRAY['USER']::"UserRoles"[];
COMMIT;
