-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-08-06 09:48:58
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

--
-- 傾印資料表的資料 `personalizedquestion`
--

INSERT INTO `personalizedquestion` (`id`, `resumeAnalysisId`, `question`, `hint`, `category`, `reason`, `createdAt`) VALUES
(3, 1, '你在履歷中提到「從小我就對科學充滿興趣，特別是資訊科學領域」，能否分享一下是什麼激發了你對科學和資訊科學的興趣？有沒有具體的經驗或者事件？', '回答時可以提到你對科學的興趣是如何產生的，以及你在資訊科學領域中的具體學習或實踐經驗。', 'personal', '這個問題可以幫助我們了解你對科學和資訊科學的興趣是如何產生的，以及你是否有相關的學習或實踐經驗來支持你的興趣。', '2025-08-06 05:20:17.941'),
(4, 1, '請詳細說明您選擇資管系的具體原因和動機？', '建議包含：個人興趣、未來規劃、對資管領域的理解', 'personal', '基於履歷分析，需要更深入了解您的選擇動機', '2025-08-06 05:20:17.946'),
(5, 1, '您認為自己在資管領域有哪些優勢和需要改進的地方？', '建議包含：個人優勢、學習經歷、改進計劃', 'academic', '根據履歷分析結果，評估個人能力發展', '2025-08-06 05:20:17.950'),
(6, 1, '請分享一次您使用資訊科技解決問題的具體經驗？', '建議包含：問題背景、解決方案、學習收穫', 'technical', '基於履歷內容，深入探討技術應用能力', '2025-08-06 05:20:17.952'),
(7, 1, '您對企業管理中的資訊系統有什麼了解？', '建議包含：系統概念、應用場景、個人見解', 'technical', '測試對資管核心領域的理解深度', '2025-08-06 05:20:17.954'),
(8, 3, '你在自傳中提到「我對資料科學與人工智慧領域充滿熱情」，能否分享一次你在這兩個領域中學習或實作的經驗，並說明這次經驗如何加深你對這兩個領域的熱情？', '請提供具體的學習或實作經驗，包括你所面臨的挑戰、你如何解決這些挑戰，以及這次經驗如何影響你對資料科學和人工智慧的看法。', 'academic', '這個問題可以幫助我們了解學生對資料科學和人工智慧的深入理解，以及他的學習動機和實作能力。', '2025-08-06 07:17:11.782'),
(9, 3, '請詳細說明您選擇資管系的具體原因和動機？', '建議包含：個人興趣、未來規劃、對資管領域的理解', 'personal', '基於履歷分析，需要更深入了解您的選擇動機', '2025-08-06 07:17:11.787'),
(10, 3, '您認為自己在資管領域有哪些優勢和需要改進的地方？', '建議包含：個人優勢、學習經歷、改進計劃', 'academic', '根據履歷分析結果，評估個人能力發展', '2025-08-06 07:17:11.791'),
(11, 3, '請分享一次您使用資訊科技解決問題的具體經驗？', '建議包含：問題背景、解決方案、學習收穫', 'technical', '基於履歷內容，深入探討技術應用能力', '2025-08-06 07:17:11.793'),
(12, 3, '您對企業管理中的資訊系統有什麼了解？', '建議包含：系統概念、應用場景、個人見解', 'technical', '測試對資管核心領域的理解深度', '2025-08-06 07:17:11.795');

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

--
-- 傾印資料表的資料 `resumeanalysis`
--

INSERT INTO `resumeanalysis` (`id`, `userId`, `originalText`, `scoreResult`, `issuesResult`, `rewriteResult`, `structureResult`, `overallScore`, `createdAt`) VALUES
(1, 1, '我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。\n\n在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言。在社團中，我不僅學會了程式設計的基礎知識，還培養了邏輯思維能力。\n\n我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。這個研究讓我更深入了解AI技術，也讓我確定了未來想要朝資訊工程發展的方向。\n\n除了學術方面，我也很重視品格培養。我經常參與志工服務，幫助社區的長者學習使用智慧型手機。這些經驗讓我學會了耐心和同理心。\n\n我相信我具備了進入資訊工程系所需的能力和熱忱。我希望能夠在大學期間繼續深造，將來為科技發展貢獻一份心力。', '{\"overallScore\":78,\"categories\":[{\"name\":\"邏輯結構\",\"score\":80,\"feedback\":\"自傳的結構整體上邏輯清晰，從個人背景、學術經歷、個人品格到未來規劃，每個部分都有清楚的主題。然而，各部分之間的連接可以再加強，使整體敘述更流暢。\",\"strengths\":[\"段落安排清晰\",\"內容組織合理\"],\"weaknesses\":[\"段落間連接不夠流暢\"],\"suggestions\":[\"加強段落間的連接，使敘述更流暢\"]},{\"name\":\"動機明確度\",\"score\":75,\"feedback\":\"你對資訊科學的興趣和選擇資訊工程的動機都有明確的表述，但未來規劃的部分可以再具體一些，例如你希望在資訊工程領域做出什麼樣的貢獻。\",\"strengths\":[\"選擇科系的理由清晰\"],\"weaknesses\":[\"未來規劃不夠具體\"],\"suggestions\":[\"對未來規劃進行更具體的描述\"]},{\"name\":\"個人化程度\",\"score\":80,\"feedback\":\"你的自傳中有許多個人獨特的經驗和特質，如參與科學展覽的經驗和志工服務的經驗，這些都展現了你的個人特色。然而，你可以再多分享一些你的個人感受和思考，使自傳更具真實性。\",\"strengths\":[\"有獨特的經驗\",\"展現個人特色\"],\"weaknesses\":[\"缺乏個人感受和思考\"],\"suggestions\":[\"分享更多個人感受和思考\"]},{\"name\":\"語言表達\",\"score\":80,\"feedback\":\"你的語言表達整體上清晰流暢，用詞準確。但在一些地方可以使用更專業的詞彙，例如在描述你的科學展覽研究時。\",\"strengths\":[\"語句通順\",\"用詞準確\"],\"weaknesses\":[\"專業詞彙使用不足\"],\"suggestions\":[\"在需要的地方使用更專業的詞彙\"]},{\"name\":\"內容深度\",\"score\":75,\"feedback\":\"你的自傳中有一些深度的內容，如你對人工智慧在教育上的應用的研究。但在一些地方，如你的學術經歷和未來規劃，可以進一步深入分析和思考。\",\"strengths\":[\"有深度的研究經驗\"],\"weaknesses\":[\"部分內容深度不足\"],\"suggestions\":[\"對學術經歷和未來規劃進行更深入的分析和思考\"]},{\"name\":\"具體性\",\"score\":75,\"feedback\":\"你的自傳中有一些具體的例子，如你參與的科學展覽和志工服務。但在一些地方，如你的學術經歷和未來規劃，可以提供更具體的數據和成果。\",\"strengths\":[\"有具體的例子\"],\"weaknesses\":[\"部分內容缺乏具體數據和成果\"],\"suggestions\":[\"提供更具體的數據和成果\"]}]}', '[{\"text\":\"從小我就對科學充滿興趣，特別是資訊科學領域。\",\"suggestion\":\"這句話過於空泛，並未具體說明為何對科學和資訊科學領域感興趣，也沒有提供具體的例子或經驗來支持這個說法。\",\"severity\":\"medium\",\"category\":\"empty\",\"reason\":\"缺乏實質內容和具體例子來支持說法。\",\"improved_example\":\"我對科學的興趣源自於我對探索未知的熱愛。特別是在資訊科學領域，我對如何利用程式語言解決問題的過程感到著迷。例如，我曾經自學Python，並利用它來自動化我日常的一些任務，如整理電子郵件和管理日程。\"},{\"text\":\"我參加了程式設計社團，學習了Python和Java程式語言。\",\"suggestion\":\"這句話可以更具體地描述學習Python和Java程式語言的過程和結果，例如完成的項目、解決的問題等。\",\"severity\":\"medium\",\"category\":\"vague\",\"reason\":\"缺乏具體性，未能展示學習成果。\",\"improved_example\":\"在程式設計社團中，我學習了Python和Java程式語言。我利用Python開發了一個自動化數據分析的工具，並用Java實現了一個簡單的網路爬蟲。\"},{\"text\":\"我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。\",\"suggestion\":\"這句話可以更具體地描述參與科學展覽的經驗，例如研究的具體內容、過程、結果等。\",\"severity\":\"medium\",\"category\":\"vague\",\"reason\":\"缺乏具體性，未能展示研究成果。\",\"improved_example\":\"我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。我設計了一個基於機器學習的教育輔助工具，可以根據學生的學習習慣和進度，自動生成個性化的學習計劃。\"},{\"text\":\"我相信我具備了進入資訊工程系所需的能力和熱忱。\",\"suggestion\":\"這句話過於空泛，並未具體說明具備了哪些能力和熱忱。應該提供具體的例子或經驗來支持這個說法。\",\"severity\":\"high\",\"category\":\"empty\",\"reason\":\"缺乏實質內容和具體例子來支持說法。\",\"improved_example\":\"我相信我具備了進入資訊工程系所需的能力和熱忱。我已經掌握了Python和Java這兩種主流的程式語言，並且在科學展覽中的研究經驗也讓我對人工智慧有了深入的理解。此外，我對資訊科學的熱愛和對學習的熱情也是我進入資訊工程系的動力。\"}]', '我是張小明，畢業於台北市立第一高中，專注於資訊科學的學習與探索。自幼對科學抱持著無比熱情，特別是資訊科學領域，我對於這個能夠將抽象邏輯轉化為具體應用的領域，感到無比著迷。\n\n在高中三年的學習期間，我積極投入程式設計社團，自學Python和Java程式語言，並在社團中不僅掌握了程式設計的基礎知識，更培養了邏輯思維能力。我曾經以程式設計社團的一員，參與了全國性的程式設計比賽，並在其中獲得了第三名的佳績，這次的經驗讓我更加確定自己對資訊科學的熱愛與投入。\n\n我也曾參與學校的科學展覽，研究主題是「人工智慧在教育上的應用」。透過這次的研究，我深入了解了AI技術的運作原理與應用範疇，並且進一步確定了我對於資訊工程領域的熱忱與投入。這個研究也讓我獲得了學校的科學研究獎學金，進一步肯定了我在這個領域的努力與成果。\n\n除了學術追求，我也非常重視個人品格的培養。我經常參與志工服務，幫助社區的長者學習使用智慧型手機，這些經驗讓我學會了耐心和同理心，也讓我明白到科技的力量不僅可以改變生活，更可以拉近人與人之間的距離。\n\n我深信我具備了進入資訊工程系所需的能力和熱忱，我期待能在大學期間進一步深化我的專業知識與技能，並且將來能夠以我所學，為科技發展貢獻一份心力。我對於未來充滿期待，並且我相信，只要我持續努力與學習，我一定能夠在資訊科學領域中，創造出屬於自己的一片天。', '[{\"section\":\"引言段落\",\"purpose\":\"提供讀者對自己的基本認識，並說明選擇資管系的契機\",\"key_points\":[\"個人基本資料\",\"對科學的興趣\",\"對資訊科學領域的興趣\"],\"writing_tips\":\"以簡短且吸引人的方式介紹自己，並清楚說明對資管系的興趣源自何處\",\"common_mistakes\":\"過於冗長或含糊不清的自我介紹，未明確說明選擇資管系的原因\",\"word_count\":\"50-100\"},{\"section\":\"學習經歷段落\",\"purpose\":\"展示自己的學習成果和相關經驗\",\"key_points\":[\"參加程式設計社團\",\"學習Python和Java程式語言\",\"參與科學展覽的經驗\"],\"writing_tips\":\"具體說明自己在這些活動中學到了什麼，並強調這些經驗如何幫助自己準備進入資管系\",\"common_mistakes\":\"只列出活動名稱而未說明在活動中的學習成果，或者過於泛泛地描述經驗\",\"word_count\":\"100-150\"},{\"section\":\"個人特質段落\",\"purpose\":\"展示自己的個人特質和價值觀\",\"key_points\":[\"邏輯思維能力\",\"對AI技術的理解\",\"耐心和同理心\"],\"writing_tips\":\"具體說明這些特質如何在自己的學習經歷中體現，並強調這些特質對於資管系學習的重要性\",\"common_mistakes\":\"只列出特質而未說明這些特質的來源或重要性，或者過於自我褒揚\",\"word_count\":\"100-150\"},{\"section\":\"未來規劃段落\",\"purpose\":\"說明自己的未來目標和規劃\",\"key_points\":[\"進入資訊工程系的決心\",\"大學期間的學習計劃\",\"對科技發展的期待\"],\"writing_tips\":\"具體說明自己的短期和長期目標，並強調這些目標與資管系學習的關聯性\",\"common_mistakes\":\"未設定具體的目標，或者設定的目標與資管系學習無關\",\"word_count\":\"100-150\"},{\"section\":\"結語段落\",\"purpose\":\"總結自傳內容，並表達對資管系的期待\",\"key_points\":[\"對資管系的熱忱\",\"對未來的期待\"],\"writing_tips\":\"簡短且有力地總結自傳內容，並清楚表達對資管系的期待\",\"common_mistakes\":\"結語過於冗長或含糊不清，或者未表達對資管系的期待\",\"word_count\":\"50-100\"}]', 78, '2025-08-06 05:01:08.781'),
(3, 3, '學生升學履歷表\n\n一、基本資料\n\n姓名\n\n王小明\n\n性別\n\n男\n\n出生年月日\n\n2006/03/15\n\n就讀學校\n\n國立台北高級中學\n\n學號\n\n110123456\n\n科別\n\n普通科\n\n聯絡電話\n\n0912-345-678\n\n電子郵件\n\nming.wang123@gmail.com\n\n通訊地址\n\n台北市中正區仁愛路一段100號\n\n二、升學志向與自傳\n\n升學動機與目標\n\n我對資料科學與人工智慧領域充滿熱情，期望進入貴校資訊管理系進一步學習數據分析與AI應用技術。高中三年我對資訊與管理領域持續投入與探索，也明白未來科技與人類社會發展息息相關。希望未來能將所學應用於醫療、教育與永續發展等領域，解決實際社會問題，發揮資訊的力量。\n\n自傳（全文）\n\n我從小對電腦與科技充滿好奇，國中開始接觸 Scratch 和 Python 程式設計，並曾參加學校舉辦的程式夏令營。在那次經驗中，我第一次學會了如何寫出互動式遊戲，也開啟了我對資訊科技世界的探索大門。進入高中後，我主動加入資訊研究社，並在高二時擔任副社長，協助規劃課程、帶領學弟妹學習 Python 程式邏輯、網頁設計與簡易資料分析。在學期間，我積極參與各類學習歷程與專題研究，包含「高中生日常飲食與學習效率關聯」的研究，我們以問卷方式蒐集數據，並使用 Python pandas 與 matplotlib 進行資料清理與視覺化分析。該報告最後整理為學習成果並於校內成果展中發表，獲得老師與同學的正面回饋。此外，我也在高三時完成自主學習計畫，主題為「從 ChatGPT 學習自然語言處理」，透過網路資源與臺灣大學開放式課程，我系統性學習了 NLP 的基本架構、斷詞技術與語意分析，並撰寫學習筆記與期末心得報告。這段歷程培養了我自學的能力，也對 AI 的應用產生更深入的認識與興趣。除了學業，我也參與社團與服務學習，曾任志工服務社成員，參與校內外各項志工活動，如社區清潔、關懷長者等。在這些服務中，我學會了傾聽他人、關心社會，也更加理解科技應該以人為本，資訊管理不只是技術，更是服務與創新的整合。在語言能力方面，我持續提升英文能力，通過全民英檢中級，並能夠閱讀基礎英文技術文章。我也閱讀相關書籍如《資料之美》、《人工智慧簡史》，並撰寫讀書心得，提升對技術背後人文脈絡的理解。我相信進入大學後，我能夠更深入學習資料科學與AI應用，並整合跨領域知識，成為一位具備批判思維、團隊合作與實作能力的資訊人。未來，我期望能將資訊能力應用於醫療、教育科技與社會創新等領域，貢獻自身專業，回饋社會。\n\n三、學業與學習表現\n\n- 高中三年學業成績穩定，總平均維持在班排前15%，其中數學與英文多次突破90分。- 擅長學科：數學、英文、資訊科技。- 自主進修：修畢「臺大人工智慧與社會影響」MOOC課程，並自學Python與SQL基礎。- 閱讀書單：  1. 《資料之美》  2. 《人工智慧簡史》  3. 《原子習慣》  並完成讀書心得撰寫。\n\n四、學習歷程與專題實作\n\n- 高二上：專題探究《高中生日常飲食與學習效率關聯》，負責數據分析與報告整理，成果於校內公開展示。- 高二暑假：參與臺大資管營，與隊友共同開發簡易問卷系統，並學習基本前後端概念。- 高三上：執行自主學習《從 ChatGPT 學習自然語言處理》，整理學習筆記與成果心得。\n\n五、社團與幹部經歷\n\n- 高一～高三：資訊研究社社員與副社長，協助辦理社課與營隊活動。- 高一～高三：志工服務社成員，定期參與掃街、敬老與社區服務。- 高二：擔任班級學藝股長，負責佈告欄與比賽投稿設計。\n\n六、競賽與認證成果\n\n- 高一：校內資訊科展第二名。- 高二：APCS 程式能力檢定通過（乙級）。- 高三：Python 程式設計檢定丙級合格。- 高三：全國高中資訊應用競賽初賽晉級。\n\n七、語言能力\n\n- 中文：母語程度，具良好書寫與口語表達能力。- 英文：聽說讀寫均達中上程度，通過全民英檢中級，具備閱讀技術英文的能力。\n\n八、個人特質與其他補充\n\n- 擁有良好的邏輯思維與資料分析能力。- 善於時間管理，能在有限時間內完成多項任務。- 樂於團隊合作，並具備領導與協調能力。- 持續學習動力強，主動規劃自學方向並實踐。- 關心社會，期望未來成為能以資訊技術服務人群的人才。\n\n', '{\"overallScore\":85,\"categories\":[{\"name\":\"邏輯結構\",\"score\":90,\"feedback\":\"自傳的結構清晰，段落安排合理，內容組織有條理，邏輯流暢。從基本資料、升學動機、自傳全文、學業與學習表現、學習歷程與專題實作、社團與幹部經歷、競賽與認證成果、語言能力到個人特質與其他補充，每個部分都有明確的主題，並且內容之間有良好的連接。\",\"strengths\":[\"結構清晰\",\"段落安排合理\",\"內容組織有條理\",\"邏輯流暢\"],\"weaknesses\":[],\"suggestions\":[]},{\"name\":\"動機明確度\",\"score\":85,\"feedback\":\"學生對於選擇資訊管理系的理由以及未來規劃都有明確的說明，並且能夠將自己的興趣與專業知識連結，展現出對於資訊科技領域的熱情。然而，對於未來的具體規劃可以再詳細一些，例如可以提供一些具體的職業規劃或者是想要進行的專案。\",\"strengths\":[\"選擇科系的理由明確\",\"對於未來有基本規劃\"],\"weaknesses\":[\"未來規劃可以再詳細一些\"],\"suggestions\":[\"提供具體的職業規劃或者是想要進行的專案\"]},{\"name\":\"個人化程度\",\"score\":80,\"feedback\":\"學生的自傳充滿個人特色，從學習歷程、專題實作到社團與幹部經歷，都展現出學生的獨特性和真實性。然而，學生可以再多分享一些個人的故事或者是經驗，讓讀者更能了解學生的個人特質。\",\"strengths\":[\"充滿個人特色\",\"展現獨特性和真實性\"],\"weaknesses\":[\"可以再多分享一些個人的故事或者是經驗\"],\"suggestions\":[\"分享更多個人的故事或者是經驗\"]},{\"name\":\"語言表達\",\"score\":85,\"feedback\":\"學生的語言表達能力良好，用詞準確，語句通順，並且展現出一定的專業度。然而，有些地方的表達可以再精煉一些，避免冗贅的語言。\",\"strengths\":[\"用詞準確\",\"語句通順\",\"展現專業度\"],\"weaknesses\":[\"有些地方的表達可以再精煉一些\"],\"suggestions\":[\"避免冗贅的語言\"]},{\"name\":\"內容深度\",\"score\":85,\"feedback\":\"學生在自傳中展現出對於資訊科技領域的深入理解，並且能夠將所學應用於實際的專題研究中。然而，學生可以再多分享一些對於專業知識的理解或者是見解，讓讀者更能了解學生的思考深度。\",\"strengths\":[\"對於資訊科技領域有深入理解\",\"能夠將所學應用於實際的專題研究中\"],\"weaknesses\":[\"可以再多分享一些對於專業知識的理解或者是見解\"],\"suggestions\":[\"分享更多對於專業知識的理解或者是見解\"]},{\"name\":\"具體性\",\"score\":80,\"feedback\":\"學生在自傳中提供了許多具體的例子和數據，例如參與的專題研究、社團活動以及競賽成果等。然而，學生可以再多提供一些具體的數據或者是成果，例如專題研究的具體成果或者是競賽的名次等。\",\"strengths\":[\"提供了許多具體的例子和數據\"],\"weaknesses\":[\"可以再多提供一些具體的數據或者是成果\"],\"suggestions\":[\"提供專題研究的具體成果或者是競賽的名次等\"]}]}', '{\"text\":\"我對資料科學與人工智慧領域充滿熱情\",\"suggestion\":\"請提供具體的例子或經驗來證明你對資料科學與人工智慧領域的熱情。\",\"severity\":\"medium\",\"category\":\"vague\",\"reason\":\"這句話缺乏具體的證據或例子來支持你的熱情。\",\"improved_example\":\"我對資料科學與人工智慧領域充滿熱情，例如我在高中時期就自學Python並參與了多次相關的程式設計比賽。\"}', '一、基本資料\n\n姓名：王小明\n性別：男\n出生年月日：2006/03/15\n就讀學校：國立台北高級中學\n學號：110123456\n科別：普通科\n聯絡電話：0912-345-678\n電子郵件：ming.wang123@gmail.com\n通訊地址：台北市中正區仁愛路一段100號\n\n二、升學志向與自傳\n\n我對資訊科學與人工智慧領域充滿熱情，期望進入貴校資訊管理系進一步學習數據分析與AI應用技術。我相信，資訊科技是未來社會發展的關鍵，而我希望能將所學應用於醫療、教育與永續發展等領域，解決實際社會問題，發揮資訊的力量。\n\n自小對電腦與科技充滿好奇的我，自國中開始接觸 Scratch 和 Python 程式設計，並曾參加學校舉辦的程式夏令營。進入高中後，我主動加入資訊研究社，並在高二時擔任副社長，協助規劃課程、帶領學弟妹學習 Python 程式邏輯、網頁設計與簡易資料分析。\n\n在學期間，我積極參與各類學習歷程與專題研究，包含「高中生日常飲食與學習效率關聯」的研究，我們以問卷方式蒐集數據，並使用 Python pandas 與 matplotlib 進行資料清理與視覺化分析。該報告最後整理為學習成果並於校內成果展中發表，獲得老師與同學的正面回饋。\n\n此外，我也在高三時完成自主學習計畫，主題為「從 ChatGPT 學習自然語言處理」，透過網路資源與臺灣大學開放式課程，我系統性學習了 NLP 的基本架構、斷詞技術與語意分析，並撰寫學習筆記與期末心得報告。這段歷程培養了我自學的能力，也對 AI 的應用產生更深入的認識與興趣。\n\n除了學業，我也參與社團與服務學習，曾任志工服務社成員，參與校內外各項志工活動，如社區清潔、關懷長者等。在這些服務中，我學會了傾聽他人、關心社會，也更加理解科技應該以人為本，資訊管理不只是技術，更是服務與創新的整合。\n\n在語言能力方面，我持續提升英文能力，通過全民英檢中級，並能夠閱讀基礎英文技術文章。我也閱讀相關書籍如《資料之美》、《人工智慧簡史》，並撰寫讀書心得，提升對技術背後人文脈絡的理解。\n\n我相信進入大學後，我能夠更深入學習資料科學與AI應用，並整合跨領域知識，成為一位具備批判思維、團隊合作與實作能力的資訊人。未來，我期望能將資訊能力應用於醫療、教育科技與社會創新等領域，貢獻自身專業，回饋社會。\n\n三、學業與學習表現\n\n我的學業成績穩定，總平均維持在班排前15%，其中數學與英文多次突破90分。我擅長的學科包括數學、英文、資訊科技。我也自主進修，修畢「臺大人工智慧與社會影響」MOOC課程，並自學Python與SQL基礎。我閱讀的書籍包括《資料之美》、《人工智慧簡史》、《原子習慣》，並完成讀書心得撰寫。\n\n四、學習歷程與專題實作\n\n在高二上學期，我參', '[{\"section\":\"Introduction\",\"purpose\":\"To provide a brief overview of the individual\'s background and motivations for choosing the field of Information Management.\",\"key_points\":[\"Personal background\",\"Reasons for choosing Information Management\"],\"writing_tips\":\"Start with a compelling story or event that sparked your interest in Information Management. Be specific about why you chose this field.\",\"common_mistakes\":\"Being too vague or generic about your motivations. Not providing enough personal context.\",\"word_count\":\"100-150 words\"},{\"section\":\"Academic Experience\",\"purpose\":\"To showcase the individual\'s academic achievements and experiences related to Information Management.\",\"key_points\":[\"Relevant courses\",\"Projects\",\"Competitions\"],\"writing_tips\":\"Focus on experiences that demonstrate your skills and knowledge in Information Management. Use specific examples and results to highlight your achievements.\",\"common_mistakes\":\"Listing experiences without explaining their relevance. Not providing enough detail about your role and contributions.\",\"word_count\":\"200-300 words\"},{\"section\":\"Personal Traits\",\"purpose\":\"To highlight the individual\'s abilities, interests, and values that make them a good fit for the field of Information Management.\",\"key_points\":[\"Abilities\",\"Interests\",\"Values\"],\"writing_tips\":\"Choose traits that are relevant to Information Management. Use examples to demonstrate how these traits have influenced your academic and personal life.\",\"common_mistakes\":\"Listing traits without providing examples. Choosing traits that are not relevant to Information Management.\",\"word_count\":\"150-200 words\"},{\"section\":\"Future Plans\",\"purpose\":\"To outline the individual\'s short-term and long-term goals in the field of Information Management.\",\"key_points\":[\"Short-term goals\",\"Long-term plans\"],\"writing_tips\":\"Be specific about your goals and how you plan to achieve them. Show how your academic experiences have prepared you for these goals.\",\"common_mistakes\":\"Being too vague or unrealistic about your goals. Not connecting your goals to your past experiences.\",\"word_count\":\"100-150 words\"},{\"section\":\"Conclusion\",\"purpose\":\"To summarize the individual\'s qualifications and express their enthusiasm for the field of Information Management.\",\"key_points\":[\"Summary of qualifications\",\"Expression of enthusiasm\"],\"writing_tips\":\"Reiterate your key qualifications and how they make you a good fit for the field of Information Management. Express your excitement about the future.\",\"common_mistakes\":\"Repeating information without adding new insights. Not expressing enough enthusiasm or commitment.\",\"word_count\":\"50-100 words\"}]', 85, '2025-08-06 07:11:03.525');

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
(2, '321', '$2b$10$k5r3SxJ0dIc03bWdll5/l.s0uw7DUVbEbt9lPOyri6LjJY1yqVHYq', 'teacher', '2025-08-05 19:24:51.002'),
(3, 'student', '$2b$10$88wSKPVqTgK2NVf7RZ8ePuyLnDWcWF6zvzkuLwIgARrPYUZbjxjLC', 'student', '2025-08-06 04:30:30.802'),
(4, 'teacher', '$2b$10$88wSKPVqTgK2NVf7RZ8ePuyLnDWcWF6zvzkuLwIgARrPYUZbjxjLC', 'teacher', '2025-08-06 04:30:30.819');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `resumeanalysis`
--
ALTER TABLE `resumeanalysis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
