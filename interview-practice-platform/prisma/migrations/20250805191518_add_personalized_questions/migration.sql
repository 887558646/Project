-- CreateTable
CREATE TABLE `WrittenAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answer` TEXT NOT NULL,
    `wordCount` INTEGER NOT NULL,
    `clarityScore` INTEGER NOT NULL,
    `exaggerationScore` INTEGER NOT NULL,
    `issues` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WrittenAnswer_userId_questionId_key`(`userId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `hint` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResumeAnalysis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `originalText` TEXT NOT NULL,
    `scoreResult` TEXT NOT NULL,
    `issuesResult` TEXT NOT NULL,
    `rewriteResult` TEXT NOT NULL,
    `structureResult` TEXT NOT NULL,
    `overallScore` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalizedQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeAnalysisId` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `hint` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WrittenAnswer` ADD CONSTRAINT `WrittenAnswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResumeAnalysis` ADD CONSTRAINT `ResumeAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalizedQuestion` ADD CONSTRAINT `PersonalizedQuestion_resumeAnalysisId_fkey` FOREIGN KEY (`resumeAnalysisId`) REFERENCES `ResumeAnalysis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
