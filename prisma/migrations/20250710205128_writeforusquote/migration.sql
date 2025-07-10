-- CreateTable
CREATE TABLE `write_for_us_quote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `topicId` INTEGER NULL,
    `message` VARCHAR(191) NULL,
    `file` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `write_for_us_quote` ADD CONSTRAINT `write_for_us_quote_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
