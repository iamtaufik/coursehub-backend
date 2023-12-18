/*
  Warnings:

  - You are about to drop the column `ratings` on the `Courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "ratings";

-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "isTrailer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CourseRatings" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseRatings_courseId_userId_key" ON "CourseRatings"("courseId", "userId");

-- AddForeignKey
ALTER TABLE "CourseRatings" ADD CONSTRAINT "CourseRatings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRatings" ADD CONSTRAINT "CourseRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
