-- CreateTable
CREATE TABLE `posts` (
    `postId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(256) NOT NULL,
    `description` VARCHAR(512) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `readingTime` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(256) NOT NULL,
    `language` VARCHAR(6) NOT NULL DEFAULT 'pt-br',
    `content` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `visitors` INTEGER UNSIGNED NOT NULL,
    `originalId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `tagId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(32) NOT NULL,
    `type` VARCHAR(32) NOT NULL DEFAULT 'undefined',

    UNIQUE INDEX `tags_label_key`(`label`),
    PRIMARY KEY (`tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_tags` (
    `postId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`postId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `authService` VARCHAR(191) NOT NULL DEFAULT '',
    `authServiceId` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
