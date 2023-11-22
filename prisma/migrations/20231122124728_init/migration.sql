/*
  Warnings:

  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `Chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `modulesID` on the `Chapters` table. All the data in the column will be lost.
  - You are about to drop the column `name_chapter` on the `Chapters` table. All the data in the column will be lost.
  - The primary key for the `Courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Courses` table. All the data in the column will be lost.
  - The primary key for the `Modules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Modules` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `Modules` table. All the data in the column will be lost.
  - The primary key for the `Profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Profiles` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `Chapters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Chapters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter_id` to the `Modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapters" DROP CONSTRAINT "Chapters_modulesID_fkey";

-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_users_id_fkey";

-- DropForeignKey
ALTER TABLE "Modules" DROP CONSTRAINT "Modules_course_id_fkey";

-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_users_id_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Chapters" DROP CONSTRAINT "Chapters_pkey",
DROP COLUMN "ID",
DROP COLUMN "module_id",
DROP COLUMN "modulesID",
DROP COLUMN "name_chapter",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_pkey",
DROP COLUMN "ID",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "level" SET DEFAULT 'beginners',
ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Modules" DROP CONSTRAINT "Modules_pkey",
DROP COLUMN "ID",
DROP COLUMN "course_id",
ADD COLUMN     "chapter_id" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Modules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "profile_picture" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "coutry" DROP NOT NULL,
ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "ID",
DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "Roles";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "idAdmin" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_idAdmin_key" ON "Admin"("idAdmin");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
