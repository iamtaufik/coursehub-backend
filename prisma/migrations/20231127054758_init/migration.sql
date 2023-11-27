-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_users_id_fkey";

-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "users_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
