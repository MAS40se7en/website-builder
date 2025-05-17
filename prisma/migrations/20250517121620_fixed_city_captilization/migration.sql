/*
  Warnings:

  - You are about to drop the column `City` on the `agency` table. All the data in the column will be lost.
  - Added the required column `city` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agency` DROP COLUMN `City`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL;
