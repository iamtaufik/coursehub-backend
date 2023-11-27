/*
  Warnings:

  - Made the column `level` on table `Courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "level" DROP DEFAULT;
