-- AlterTable
ALTER TABLE `question` ADD COLUMN `school` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `VideoAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `questionId` INTEGER NULL,
    `questionText` TEXT NULL,
    `videoPath` VARCHAR(191) NOT NULL,
    `durationSec` INTEGER NOT NULL,
    `speechRate` INTEGER NULL,
    `emotionScore` INTEGER NULL,
    `transcript` TEXT NULL,
    `analysisJson` TEXT NULL,
    `thumbnailPath` VARCHAR(191) NULL,
    `sizeBytes` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VideoAnswer_userId_idx`(`userId`),
    INDEX `VideoAnswer_questionId_idx`(`questionId`),
    UNIQUE INDEX `VideoAnswer_userId_questionId_key`(`userId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentUserId` INTEGER NOT NULL,
    `teacherUserId` INTEGER NOT NULL,
    `targetType` VARCHAR(191) NOT NULL,
    `videoAnswerId` INTEGER NULL,
    `questionId` INTEGER NULL,
    `comment` TEXT NOT NULL,
    `score` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TeacherComment_studentUserId_idx`(`studentUserId`),
    INDEX `TeacherComment_teacherUserId_idx`(`teacherUserId`),
    INDEX `TeacherComment_videoAnswerId_idx`(`videoAnswerId`),
    INDEX `TeacherComment_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoAnswer` ADD CONSTRAINT `VideoAnswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoAnswer` ADD CONSTRAINT `VideoAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherComment` ADD CONSTRAINT `TeacherComment_studentUserId_fkey` FOREIGN KEY (`studentUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherComment` ADD CONSTRAINT `TeacherComment_teacherUserId_fkey` FOREIGN KEY (`teacherUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherComment` ADD CONSTRAINT `TeacherComment_videoAnswerId_fkey` FOREIGN KEY (`videoAnswerId`) REFERENCES `VideoAnswer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherComment` ADD CONSTRAINT `TeacherComment_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
