-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'USER';
