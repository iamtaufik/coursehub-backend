/*
  Warnings:

  - You are about to drop the column `completed` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessed` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserCourseProgress` table. All the data in the column will be lost.
  - You are about to drop the `GeneralNotification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notificationId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `UserCourseProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCourseProgress" DROP CONSTRAINT "UserCourseProgress_courseId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserCourseProgress" DROP COLUMN "completed",
DROP COLUMN "courseId",
DROP COLUMN "createdAt",
DROP COLUMN "lastAccessed",
DROP COLUMN "progress",
DROP COLUMN "updatedAt",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moduleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "GeneralNotification";

-- AddForeignKey
ALTER TABLE "UserCourseProgress" ADD CONSTRAINT "UserCourseProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
