-- DropForeignKey
ALTER TABLE `article_categories` DROP FOREIGN KEY `article_categories_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `article_categories` DROP FOREIGN KEY `article_categories_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `article_categories` ADD CONSTRAINT `article_categories_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_categories` ADD CONSTRAINT `article_categories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
