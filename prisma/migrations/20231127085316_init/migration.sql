/*
  Warnings:

  - The values [beginners] on the enum `Levels` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Levels_new" AS ENUM ('beginner', 'intermediate', 'advanced');
ALTER TABLE "Courses" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "Courses" ALTER COLUMN "level" TYPE "Levels_new" USING ("level"::text::"Levels_new");
ALTER TYPE "Levels" RENAME TO "Levels_old";
ALTER TYPE "Levels_new" RENAME TO "Levels";
DROP TYPE "Levels_old";
ALTER TABLE "Courses" ALTER COLUMN "level" SET DEFAULT 'beginner';
COMMIT;

-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "level" SET DEFAULT 'beginner';
