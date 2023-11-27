/*
  Warnings:

  - You are about to drop the column `users_id` on the `Courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_users_id_fkey";

-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "users_id";

-- CreateTable
CREATE TABLE "_UserToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToCourse_AB_unique" ON "_UserToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToCourse_B_index" ON "_UserToCourse"("B");

-- AddForeignKey
ALTER TABLE "_UserToCourse" ADD CONSTRAINT "_UserToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToCourse" ADD CONSTRAINT "_UserToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
