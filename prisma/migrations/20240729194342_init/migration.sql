/*
  Warnings:

  - Added the required column `destination` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` ADD COLUMN `destination` VARCHAR(191) NOT NULL;
