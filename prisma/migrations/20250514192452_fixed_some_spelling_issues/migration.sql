/*
  Warnings:

  - You are about to drop the column `notificaiton` on the `notification` table. All the data in the column will be lost.
  - Added the required column `notification` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invitation` ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `notificaiton`,
    ADD COLUMN `notification` VARCHAR(191) NOT NULL;
