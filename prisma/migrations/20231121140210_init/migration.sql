-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Levels" AS ENUM ('beginners', 'intermediate', 'advanced');

-- CreateTable
CREATE TABLE "Users" (
    "ID" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "ID" SERIAL NOT NULL,
    "users_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "coutry" TEXT NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Categories" (
    "ID" SERIAL NOT NULL,
    "name_categories" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Courses" (
    "ID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "Levels" NOT NULL,
    "price" INTEGER NOT NULL,
    "ratings" INTEGER NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "users_id" INTEGER NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "ID" SERIAL NOT NULL,
    "name_chapter" TEXT NOT NULL,
    "module_id" INTEGER NOT NULL,
    "modulesID" INTEGER NOT NULL,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Modules" (
    "ID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_users_id_key" ON "Profiles"("users_id");

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapters"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "Users"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_modulesID_fkey" FOREIGN KEY ("modulesID") REFERENCES "Modules"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
