-- AlterTable
ALTER TABLE `users` MODIFY `change_email_code` VARCHAR(191) NULL DEFAULT '',
    MODIFY `connect_google` VARCHAR(191) NULL DEFAULT '';
