/*
  Warnings:

  - Added the required column `companyPhone` to the `SubAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subaccount` ADD COLUMN `companyPhone` VARCHAR(191) NOT NULL;
