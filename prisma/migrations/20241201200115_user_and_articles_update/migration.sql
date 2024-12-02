-- AlterTable
ALTER TABLE `articles` ADD COLUMN `authorId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `reading_time` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
