-- CreateTable
CREATE TABLE `SelfIntroAnalysis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `introText` TEXT NOT NULL,
    `duration` INTEGER NOT NULL,
    `speechRate` DOUBLE NULL,
    `energy` DOUBLE NULL,
    `pitch` DOUBLE NULL,
    `confidence` DOUBLE NULL,
    `continuity` DOUBLE NULL,
    `overallScore` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfIntroPersonalizedQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `selfIntroAnalysisId` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `hint` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SelfIntroAnalysis` ADD CONSTRAINT `SelfIntroAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfIntroPersonalizedQuestion` ADD CONSTRAINT `SelfIntroPersonalizedQuestion_selfIntroAnalysisId_fkey` FOREIGN KEY (`selfIntroAnalysisId`) REFERENCES `SelfIntroAnalysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
