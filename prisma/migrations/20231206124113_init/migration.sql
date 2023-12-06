/*
  Warnings:

  - A unique constraint covering the columns `[code_promo]` on the table `Promo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promo_code_promo_key" ON "Promo"("code_promo");
