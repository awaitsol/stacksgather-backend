/*
  Warnings:

  - You are about to drop the column `message` on the `write_for_us_quote` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `write_for_us_quote` table. All the data in the column will be lost.
  - Added the required column `article_outline` to the `write_for_us_quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `article_title` to the `write_for_us_quote` table without a default value. This is not possible if the table is not empty.
  - Made the column `topicId` on table `write_for_us_quote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `write_for_us_quote` DROP FOREIGN KEY `write_for_us_quote_topicId_fkey`;

-- DropIndex
DROP INDEX `write_for_us_quote_topicId_fkey` ON `write_for_us_quote`;

-- AlterTable
ALTER TABLE `write_for_us_quote` DROP COLUMN `message`,
    DROP COLUMN `subject`,
    ADD COLUMN `article_bio` VARCHAR(191) NULL,
    ADD COLUMN `article_outline` VARCHAR(191) NOT NULL,
    ADD COLUMN `article_title` VARCHAR(191) NOT NULL,
    ADD COLUMN `linkedin_source` VARCHAR(191) NULL,
    MODIFY `topicId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `write_for_us_quote` ADD CONSTRAINT `write_for_us_quote_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
