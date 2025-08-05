-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-08-05 21:55:00
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `interview_platform`
--

-- --------------------------------------------------------

--
-- 資料表結構 `personalizedquestion`
--

CREATE TABLE `personalizedquestion` (
  `id` int(11) NOT NULL,
  `resumeAnalysisId` int(11) NOT NULL,
  `question` text NOT NULL,
  `hint` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `hint` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `question`
--

INSERT INTO `question` (`id`, `question`, `hint`, `category`, `isActive`, `createdAt`) VALUES
(21, '請描述您對資訊管理的理解，以及為什麼選擇資管系？', '建議包含：對資管的認知、選擇動機、未來規劃', 'academic', 1, '2025-08-05 19:25:19.115'),
(22, '您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。', '建議包含：技術能力、管理能力、溝通能力、具體經驗', 'academic', 1, '2025-08-05 19:25:19.115'),
(23, '請分享一次您使用資訊科技解決問題的經驗。', '建議包含：問題背景、解決方案、使用工具、結果和學習', 'technical', 1, '2025-08-05 19:25:19.115'),
(24, '您對大數據分析有什麼了解？請舉例說明其應用。', '建議包含：大數據概念、應用領域、個人見解', 'technical', 1, '2025-08-05 19:25:19.115'),
(25, '請描述您對企業資源規劃(ERP)系統的理解。', '建議包含：ERP概念、功能模組、企業應用價值', 'technical', 1, '2025-08-05 19:25:19.115'),
(26, '您如何看待人工智慧在企業管理中的應用？', '建議包含：AI應用場景、優缺點分析、未來發展', 'technical', 1, '2025-08-05 19:25:19.115'),
(27, '請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。', '建議包含：專案背景、團隊分工、個人貢獻、學習收穫', 'personal', 1, '2025-08-05 19:25:19.115'),
(28, '您認為資管系畢業生在職場上最大的優勢是什麼？', '建議包含：跨領域能力、技術與管理結合、具體優勢', 'career', 1, '2025-08-05 19:25:19.115'),
(29, '請描述您對電子商務的理解，以及您認為未來發展趨勢如何？', '建議包含：電商概念、發展歷程、未來趨勢、個人見解', 'technical', 1, '2025-08-05 19:25:19.115'),
(30, '您如何平衡技術學習與管理知識的學習？', '建議包含：學習方法、時間分配、具體策略', 'academic', 1, '2025-08-05 19:25:19.115'),
(31, '請分享一次您面臨困難時的解決過程，以及從中學到了什麼？', '建議包含：困難背景、解決步驟、反思學習', 'personal', 1, '2025-08-05 19:25:19.115'),
(32, '您對資訊安全有什麼了解？請舉例說明其重要性。', '建議包含：資安概念、威脅類型、防護措施、重要性', 'technical', 1, '2025-08-05 19:25:19.115'),
(33, '請描述您對雲端運算的理解，以及其對企業的影響。', '建議包含：雲端概念、服務模式、企業影響、個人見解', 'technical', 1, '2025-08-05 19:25:19.115'),
(34, '您認為資管系學生應該如何培養創新思維？', '建議包含：創新重要性、培養方法、具體實踐', 'academic', 1, '2025-08-05 19:25:19.115'),
(35, '請分享一個您引以為傲的成就，並說明它對您的意義。', '建議包含：成就背景、過程、影響、個人成長', 'personal', 1, '2025-08-05 19:25:19.115'),
(36, '您對資料庫管理有什麼了解？請舉例說明其應用。', '建議包含：資料庫概念、管理系統、應用場景、重要性', 'technical', 1, '2025-08-05 19:25:19.115'),
(37, '請描述您對供應鏈管理的理解，以及資訊科技在其中扮演的角色。', '建議包含：供應鏈概念、IT應用、管理價值', 'technical', 1, '2025-08-05 19:25:19.115'),
(38, '您如何規劃大學四年的學習目標？', '建議包含：短期目標、長期規劃、具體行動、檢視調整', 'academic', 1, '2025-08-05 19:25:19.115'),
(39, '請分享您對行動商務的看法，以及其未來發展潛力。', '建議包含：行動商務概念、發展現況、未來趨勢、個人見解', 'technical', 1, '2025-08-05 19:25:19.115'),
(40, '您認為資管系學生在畢業後應該如何持續學習和成長？', '建議包含：終身學習重要性、學習方法、具體策略、未來規劃', 'career', 1, '2025-08-05 19:25:19.115');

-- --------------------------------------------------------

--
-- 資料表結構 `resumeanalysis`
--

CREATE TABLE `resumeanalysis` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `originalText` text NOT NULL,
  `scoreResult` text NOT NULL,
  `issuesResult` text NOT NULL,
  `rewriteResult` text NOT NULL,
  `structureResult` text NOT NULL,
  `overallScore` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `role`, `createdAt`) VALUES
(1, '123', '$2b$10$VF284klwpOlleV6oOD0bBOOaCfdNF7OKBNW2jX2X6vouzrIt5fH7q', 'student', '2025-08-05 19:24:08.507'),
(2, '321', '$2b$10$k5r3SxJ0dIc03bWdll5/l.s0uw7DUVbEbt9lPOyri6LjJY1yqVHYq', 'teacher', '2025-08-05 19:24:51.002');

-- --------------------------------------------------------

--
-- 資料表結構 `writtenanswer`
--

CREATE TABLE `writtenanswer` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `answer` text NOT NULL,
  `wordCount` int(11) NOT NULL,
  `clarityScore` int(11) NOT NULL,
  `exaggerationScore` int(11) NOT NULL,
  `issues` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('699717ec-e60a-4944-a8b0-7da487a4bb0f', '46a739a2a833eda91bad3b93afc6f1f79f93f0838b77f9211e1f99fc437aab22', '2025-08-05 19:15:09.670', '20250723043121_init', NULL, NULL, '2025-08-05 19:15:09.654', 1),
('ba525f3a-6076-4b36-9280-fd2611ba3c6d', 'a91641632bce4e325e79765893e0ac1ccc4a01eeac525d8bdbbc698fdeb527f5', '2025-08-05 19:15:19.028', '20250805191518_add_personalized_questions', NULL, NULL, '2025-08-05 19:15:18.852', 1);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `personalizedquestion`
--
ALTER TABLE `personalizedquestion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PersonalizedQuestion_resumeAnalysisId_fkey` (`resumeAnalysisId`);

--
-- 資料表索引 `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `resumeanalysis`
--
ALTER TABLE `resumeanalysis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ResumeAnalysis_userId_fkey` (`userId`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`);

--
-- 資料表索引 `writtenanswer`
--
ALTER TABLE `writtenanswer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `WrittenAnswer_userId_questionId_key` (`userId`,`questionId`);

--
-- 資料表索引 `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `personalizedquestion`
--
ALTER TABLE `personalizedquestion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `resumeanalysis`
--
ALTER TABLE `resumeanalysis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `writtenanswer`
--
ALTER TABLE `writtenanswer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `personalizedquestion`
--
ALTER TABLE `personalizedquestion`
  ADD CONSTRAINT `PersonalizedQuestion_resumeAnalysisId_fkey` FOREIGN KEY (`resumeAnalysisId`) REFERENCES `resumeanalysis` (`id`) ON UPDATE CASCADE;

--
-- 資料表的限制式 `resumeanalysis`
--
ALTER TABLE `resumeanalysis`
  ADD CONSTRAINT `ResumeAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- 資料表的限制式 `writtenanswer`
--
ALTER TABLE `writtenanswer`
  ADD CONSTRAINT `WrittenAnswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
