-- CreateTable
CREATE TABLE `article_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `articleId` INTEGER NOT NULL,
    `comments` TEXT NULL,
    `replyToId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,
    `response` ENUM('LIKE', 'DISLIKE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_comments` ADD CONSTRAINT `article_comments_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `article_comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_responses` ADD CONSTRAINT `comment_responses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_responses` ADD CONSTRAINT `comment_responses_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `article_comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
