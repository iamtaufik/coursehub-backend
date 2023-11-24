/*
  Warnings:

  - You are about to drop the column `coutry` on the `Profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "coutry",
ADD COLUMN     "country" TEXT;
