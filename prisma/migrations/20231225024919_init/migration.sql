-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "status_rating" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
