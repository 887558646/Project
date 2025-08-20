-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-08-20 10:14:43
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
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `school` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `question`
--

INSERT INTO `question` (`id`, `question`, `hint`, `category`, `isActive`, `createdAt`, `school`) VALUES
(161, '請描述您對資訊管理的理解，以及為什麼選擇資管系？', '建議包含：對資管的認知、選擇動機、未來規劃', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(162, '您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。', '建議包含：技術能力、管理能力、溝通能力、具體經驗', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(163, '請分享一次您使用資訊科技解決問題的經驗。', '建議包含：問題背景、解決方案、使用工具、結果和學習', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(164, '您對大數據分析有什麼了解？請舉例說明其應用。', '建議包含：大數據概念、應用領域、個人見解', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(165, '請描述您對企業資源規劃(ERP)系統的理解。', '建議包含：ERP概念、功能模組、企業應用價值', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(166, '您如何看待人工智慧在企業管理中的應用？', '建議包含：AI應用場景、優缺點分析、未來發展', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(167, '請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。', '建議包含：專案背景、團隊分工、個人貢獻、學習收穫', 'personal', 1, '2025-08-20 07:38:27.449', '通用'),
(168, '您認為資管系畢業生在職場上最大的優勢是什麼？', '建議包含：跨領域能力、技術與管理結合、具體優勢', 'career', 1, '2025-08-20 07:38:27.449', '通用'),
(169, '請描述您對電子商務的理解，以及您認為未來發展趨勢如何？', '建議包含：電商概念、發展歷程、未來趨勢、個人見解', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(170, '您對自己的學習規劃和未來發展有什麼想法？', '建議包含：短期目標、長期規劃、具體行動、檢視調整', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(171, '請分享您對行動商務的看法，以及其未來發展潛力。', '建議包含：行動商務概念、發展現況、未來趨勢、個人見解', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(172, '您認為資管系學生在畢業後應該如何持續學習和成長？', '建議包含：終身學習重要性、學習方法、具體策略、未來規劃', 'career', 1, '2025-08-20 07:38:27.449', '通用'),
(173, '請分享您對理論與實務結合的看法，以及如何在學習中實踐這種理念？', '建議包含：理論重要性、實務應用、個人學習方式、未來規劃', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(174, '您希望參與哪些類型的產學合作專案？請說明您的興趣和期望。', '建議包含：興趣領域、專案類型、期望收穫、具體規劃', 'career', 1, '2025-08-20 07:38:27.449', '通用'),
(175, '請分享您對創新思維的理解和經驗，以及如何在學習中培養創新能力？', '建議包含：創新定義、個人經驗、創新思維、未來應用', 'personal', 1, '2025-08-20 07:38:27.449', '通用'),
(176, '您希望結合哪些領域進行跨領域學習？請說明您的想法和規劃。', '建議包含：興趣領域、跨領域優勢、學習規劃、未來發展', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(177, '請分享您對新興科技的了解，以及您最感興趣的科技領域。', '建議包含：科技趨勢、個人興趣、應用場景、學習規劃', 'technical', 1, '2025-08-20 07:38:27.449', '通用'),
(178, '您對國際化學習有什麼想法？請分享您的語言能力和文化適應經驗。', '建議包含：國際化重要性、語言能力、文化適應、未來規劃', 'career', 1, '2025-08-20 07:38:27.449', '通用'),
(179, '請分享您對管理的理解，以及您認為管理思維在資訊管理中的重要性。', '建議包含：管理概念、管理經驗、管理思維、未來應用', 'academic', 1, '2025-08-20 07:38:27.449', '通用'),
(180, '您希望在哪類企業實習？請說明您的實習目標和期望。', '建議包含：企業類型、實習目標、學習期望、未來發展', 'career', 1, '2025-08-20 07:38:27.449', '通用'),
(442, '台大跨院資源豐富。請設計一個「醫療/農業/工程 × 資訊管理」的跨域專題，提出資料治理與倫理規範。', '資料授權與去識別、資料湖/倉、版本與權限、審計與合規、風險控管', 'academic', 1, '2025-08-20 08:00:11.947', '台大'),
(443, '若進入新創或研究中心，你會如何以資料驅動建立 MVP 並驗證 PMF？', '問題假設、實驗設計、北極星指標、A/B 測試、迭代與里程碑', 'career', 1, '2025-08-20 08:00:11.953', '台大'),
(444, '分享你在大型團隊/競賽中的協作經驗，如何在多模組整合下確保品質與交付？', '介面合約、CI/CD、測試策略、風險管理、回顧改善', 'personal', 1, '2025-08-20 08:00:11.955', '台大'),
(445, '面對研究數據與開放資料，你會如何建構可重現的分析流水線？', '數據版本控制、環境管理、容器化、授權、再現性驗證', 'academic', 1, '2025-08-20 08:00:11.957', '台大'),
(446, '你打算如何運用台大的跨域平台，打造具社會影響力的資訊專案？', '利害關係人、影響地圖、衡量指標、永續性', 'motivation', 1, '2025-08-20 08:00:11.961', '台大'),
(447, '清大強調理工基礎。請設計一個資料科學實驗，從資料蒐集到模型評估完整規劃。', '資料品質、特徵工程、基準模型、交叉驗證、誤差分析', 'academic', 1, '2025-08-20 08:00:11.968', '清大'),
(448, '針對半導體/硬體供應鏈，你會如何做資料驅動的產能與良率分析？', '感測資料、流程參數、因果/統計方法、可視化、決策支持', 'career', 1, '2025-08-20 08:00:11.970', '清大'),
(449, '描述你在高壓時程下完成技術挑戰的經驗，你如何拆解問題與調度資源？', '瓶頸定位、工具選擇、時間管理、協作分工、回顧改善', 'personal', 1, '2025-08-20 08:00:11.972', '清大'),
(450, '對於演算法與效能，你會如何評估在產業情境中的取捨？', '時間/空間複雜度、可維運性、成本、合規風險', 'academic', 1, '2025-08-20 08:00:11.974', '清大'),
(451, '你想在清大完成哪個資料/系統專題？為何重要？', '問題價值、技術路線、實驗設計、資源需求、成功標準', 'motivation', 1, '2025-08-20 08:00:11.975', '清大'),
(452, '交大著重通訊與資電。請設計結合 IoT 與雲端的資料平台，支援邊緣到雲的處理。', '通訊協定、邊緣計算、串流/批次、資料一致性、監控告警', 'academic', 1, '2025-08-20 08:00:11.979', '交大'),
(453, '若在車用/智慧城市場域，你會如何規劃資料收集與安全架構？', '資料分級、加密匿名、權限、傳輸安全、法規與資安事件應變', 'career', 1, '2025-08-20 08:00:11.981', '交大'),
(454, '分享你在系統整合專案中的角色，如何協調跨平台相依與部署？', '系統設計圖、環境差異、藍綠/金絲雀、回滾機制、SLA', 'personal', 1, '2025-08-20 08:00:11.983', '交大'),
(455, '針對高頻資料，你會如何設計可擴充的資料管線與儲存？', '資料分片、壓縮/快取、熱冷分層、成本控管、觀測性', 'academic', 1, '2025-08-20 08:00:11.985', '交大'),
(456, '你想在交大推進哪個智慧交通/物聯資料專題？說明影響與風險。', '場域、利害人、成效指標、風險與緩解', 'motivation', 1, '2025-08-20 08:00:11.987', '交大'),
(457, '政大強於社科與商管。請提出結合政策資料與企業數據的決策支持系統。', '資料治理、指標體系、可視化溝通、政策/商業影響評估', 'academic', 1, '2025-08-20 08:00:11.990', '政大'),
(458, '若進入金融/公部門資料職位，如何處理資料敏感性與合規？', '法遵要求、權限與稽核、留痕、模型可解釋性、壓力測試', 'career', 1, '2025-08-20 08:00:11.992', '政大'),
(459, '分享一次與利害關係人談判協調的經驗，如何兼顧效率與公平？', '利益地圖、議程設計、決策紀錄、衝突解法、追蹤', 'personal', 1, '2025-08-20 08:00:11.994', '政大'),
(460, '面對假訊息/政策溝通，如何設計資料驅動的輿情分析與策略建議？', '資料來源、主題/情緒模型、議題映射、回饋機制', 'academic', 1, '2025-08-20 08:00:11.996', '政大'),
(461, '你想在政大推動哪個資料治理或公共創新專題？', '痛點、合作單位、衡量指標、風險/倫理', 'motivation', 1, '2025-08-20 08:00:11.997', '政大'),
(462, '成大與醫工/製造鏈結強。請提出結合醫材或智慧製造的資訊管理專題。', '需求訪談、資料流/系統圖、法規/資安、驗證與導入', 'academic', 1, '2025-08-20 08:00:12.001', '成大'),
(463, '若進入南部產業鏈企業，你會如何以數據提升營運效率與品質？', '瓶頸診斷、KPI、資料平台、改善路線圖、ROI', 'career', 1, '2025-08-20 08:00:12.002', '成大'),
(464, '資源有限情境下完成專案的案例，你如何取捨與創新？', '最小可行、替代方案、技術債、回饋循環', 'personal', 1, '2025-08-20 08:00:12.004', '成大'),
(465, '對於時序與感測資料，你的特徵工程與模型評估策略？', '前處理、特徵設計、交叉驗證、效能/穩定性、可解釋性', 'academic', 1, '2025-08-20 08:00:12.006', '成大'),
(466, '你想在成大完成哪個與在地產業共創的資料專題？', '合作夥伴、場域、指標、永續性', 'motivation', 1, '2025-08-20 08:00:12.008', '成大'),
(467, '中央數理基礎紮實。請設計一個統計/機器學習方法論專題，並說明驗證設計。', '假設檢定、交叉驗證、偏差/變異、敏感度分析、可解釋性', 'academic', 1, '2025-08-20 08:00:12.012', '中央'),
(468, '若在資料平台團隊任職，你會如何建立資料品質監控與告警？', '品質指標、校驗規則、儀表板、告警策略、事故處理', 'career', 1, '2025-08-20 08:00:12.014', '中央'),
(469, '說明一次把抽象數理轉化為可用產品的經驗。', '建模、工程化、用戶回饋、效益量測', 'personal', 1, '2025-08-20 08:00:12.016', '中央'),
(470, '多來源異質資料的整併與一致性策略？', '匹配與去重、結構/半結構/非結構、權威來源、稽核', 'academic', 1, '2025-08-20 08:00:12.018', '中央'),
(471, '你在中央想完成的學術×實務橋接專題是什麼？', '目標、方法、資源、影響', 'motivation', 1, '2025-08-20 08:00:12.020', '中央'),
(472, '中山海事/環境與商管並重。規劃結合海事或港都資料的決策系統。', '資料來源、感測網、GIS、可視化、決策情境', 'academic', 1, '2025-08-20 08:00:12.023', '中山'),
(473, '若在港都產業服務，如何設計資料取得與權限機制？', '資料契約、API/批次、權限/稽核、法規遵循', 'career', 1, '2025-08-20 08:00:12.026', '中山'),
(474, '與不同背景同學協作的經驗，如何整合觀點並完成交付？', '需求對齊、衝突處理、文件化、回顧', 'personal', 1, '2025-08-20 08:00:12.028', '中山'),
(475, '地理/環境/即時資料的系統設計與容量規劃取捨？', '存儲分層、快取、擴充、成本/可用性', 'academic', 1, '2025-08-20 08:00:12.030', '中山'),
(476, '你想在中山打造哪個結合在地特色的資料服務？', '受益者、價值、風險、衡量', 'motivation', 1, '2025-08-20 08:00:12.032', '中山'),
(477, '中興重視農業與生命科學。設計一個智慧農業決策數據平台。', '感測/天氣、病蟲害偵測、產量預測、行動建議、成本效益', 'academic', 1, '2025-08-20 08:00:12.036', '中興'),
(478, '與農會/產銷班合作時的資料蒐集與隱私合規？', '授權、匿名化、共享機制、資料品質控管', 'career', 1, '2025-08-20 08:00:12.039', '中興'),
(479, '戶外/田間資料採集的挑戰與解法？', '設備限制、缺失值、校正、後處理、驗證', 'personal', 1, '2025-08-20 08:00:12.041', '中興'),
(480, '時空資料的資料庫與分析流程如何設計？', '座標系統、索引/查詢、視覺化、模型評估', 'academic', 1, '2025-08-20 08:00:12.044', '中興'),
(481, '你想在中興推進的智慧農業/食品追溯專題是什麼？', '利害人、價值鏈、指標、永續', 'motivation', 1, '2025-08-20 08:00:12.047', '中興'),
(482, '台科大工程與實務導向。提出以雲端與 API 為核心的系統整合專題。', '微服務、認證授權、整合測試、壓力測試、監控', 'academic', 1, '2025-08-20 08:00:12.052', '台科大'),
(483, '與中小企業合作導入數位轉型，你會如何落地並衡量成效？', '需求盤點、導入路線圖、教育訓練、KPI、財務影響', 'career', 1, '2025-08-20 08:00:12.055', '台科大'),
(484, '把理論快速落地為產品的經驗，如何平衡速度與品質？', '技術債、代碼規範、驗收、回滾與熱修', 'personal', 1, '2025-08-20 08:00:12.058', '台科大'),
(485, '資料工程與分析協作時，資料契約與模式管理怎麼做？', 'Schema 演進、向後相容、資料校驗、契約測試', 'academic', 1, '2025-08-20 08:00:12.062', '台科大'),
(486, '你想在台科大完成哪個產學協作專案？', '題目來源、里程碑、資源需求、成功指標', 'motivation', 1, '2025-08-20 08:00:12.064', '台科大'),
(487, '北科大貼近產業。設計結合智慧製造/智慧建築的資料平台，說明邊緣到雲的資料流。', '感測與通訊、資料匯聚、串流/批次、存取與視覺化', 'academic', 1, '2025-08-20 08:00:12.069', '北科大'),
(488, '協助傳產升級時，如何用資料治理解決資料孤島與品質問題？', '主數據、資料目錄、血緣/影響分析、品質指標、治理流程', 'career', 1, '2025-08-20 08:00:12.072', '北科大'),
(489, '在產線/工地推動數位工具的經驗，如何克服阻力？', '利害人訪談、試點與擴散、教育訓練、回饋改進', 'personal', 1, '2025-08-20 08:00:12.075', '北科大'),
(490, '高可用系統的容錯與備援架構如何設計？', '多區域、故障演練、恢復目標、監控與告警', 'academic', 1, '2025-08-20 08:00:12.078', '北科大'),
(491, '你想在北科大做哪個與在地產業鏈結的資料應用？', '場域/合作夥伴、價值、風險、衡量', 'motivation', 1, '2025-08-20 08:00:12.081', '北科大'),
(492, '暨南大學為僑校，校園多元國際化。請說明你如何在跨文化團隊中進行資料需求訪談，避免語意誤解並確保系統需求完整？', '跨文化溝通、雙語文件、標準用詞、樣本驗證、迭代澄清', 'academic', 1, '2025-08-20 08:00:12.086', '暨南大學'),
(493, '若在粵港澳大灣區企業進行數據專案，你會如何結合產業生態設計可落地的數據產品？', '資料來源與合規、核心指標、最小可行產品、價值驗證', 'career', 1, '2025-08-20 08:00:12.089', '暨南大學'),
(494, '與海外僑生協作完成專題/活動的經驗，你如何處理時差、語言與文化差異並維持專案節奏？', '協作工具、節奏安排、衝突溝通、風險管理', 'personal', 1, '2025-08-20 08:00:12.092', '暨南大學'),
(495, '面對多語內容（繁/簡/英），你如何設計文本資料清洗、標註與分析流程？', '分詞與編碼、清洗規則、標註流程、模型選擇、效能評估', 'academic', 1, '2025-08-20 08:00:12.095', '暨南大學'),
(496, '為何選擇在暨南大學發展資訊管理？如何運用僑校網絡與國際資源創造跨境合作價值？', '資源盤點、合作對象、預期產出、衡量指標', 'motivation', 1, '2025-08-20 08:00:12.098', '暨南大學'),
(497, '東海重視博雅教育與跨域融合。提出一門你想設計的跨域課程（如資訊×環境永續），並說明評量指標與成果呈現。', '課綱、學習目標、工具方法、評量方式、學習歷程檔案', 'academic', 1, '2025-08-20 08:00:12.103', '東海大學'),
(498, '以資料視覺化呈現校園能源/垃圾/用水的洞察，提供改善建議。', '資料來源、清理轉換、圖型選擇、洞察重點、行動建議', 'personal', 1, '2025-08-20 08:00:12.106', '東海大學'),
(499, '若進入中部製造/服務業實習，你會如何導入流程數位化專案？', '現況盤點、痛點優先、系統雛形、ROI 與導入計畫、變更管理', 'career', 1, '2025-08-20 08:00:12.110', '東海大學'),
(500, '面對開源工具與雲端服務，你如何規劃資料治理與版本控管，以確保專題可重現與可維護？', '資料字典、命名規範、權限與備援、CI/CD、審計紀錄', 'academic', 1, '2025-08-20 08:00:12.113', '東海大學'),
(501, '在人文環境中，如何培養同理與商業敏銳度，並平衡使用者體驗與技術可行性？', '用研方法、用戶旅程、技術評估、決策取捨', 'motivation', 1, '2025-08-20 08:00:12.117', '東海大學'),
(502, '輔大強調全人與倫理。若為醫療/社福單位打造資料平台，如何兼顧隱私、同意與可用性？', '去識別、最小必要、存取控管、倫理審查、資料生命周期', 'academic', 1, '2025-08-20 08:00:12.122', '輔仁大學'),
(503, '規劃一個醫院門診效率優化的資訊專案，會蒐集哪些資料並如何驗證成效？', '排隊與掛號、動線/等候、瓶頸分析、實驗設計、滿意度', 'career', 1, '2025-08-20 08:00:12.124', '輔仁大學'),
(504, '面對價值衝突（效率 vs. 公平）的抉擇，你如何與利害關係人溝通並達成共識？', '利害關係人分析、準則與權衡、會議紀錄、決策後追蹤', 'personal', 1, '2025-08-20 08:00:12.126', '輔仁大學'),
(505, '在課程中導入生成式AI輔助寫作與分析時，如何設計學術誠信與引用規範？', '界線定義、引用格式、查核流程、作業設計、抄襲偵測', 'academic', 1, '2025-08-20 08:00:12.129', '輔仁大學'),
(506, '為何適合在輔大學習資訊管理？請提出一個想做的校園/社會服務專案。', '問題定義、受益族群、解法構想、資源需求、成效衡量', 'motivation', 1, '2025-08-20 08:00:12.132', '輔仁大學'),
(507, '淡江以國際化見長。若參與國際交換/雙聯計畫，你會如何把不同學校的學習成果整合為可移轉的能力證明？', '學習地圖、能力對照、數位徽章、作品集、第三方驗證', 'academic', 1, '2025-08-20 08:00:12.136', '淡江大學'),
(508, '設計一個跨語系電商的成長分析框架（中文/英文/日文），用以制定在地化營運策略。', '市場區隔、轉換漏斗、關鍵指標、A/B 測試、在地內容策略', 'career', 1, '2025-08-20 08:00:12.139', '淡江大學'),
(509, '在多外語環境中主持會議與寫作文件，使團隊快速對齊且可追溯。', '會議節奏、紀錄範本、決議追蹤、版本控管、文化敏感度', 'personal', 1, '2025-08-20 08:00:12.141', '淡江大學'),
(510, '若要導入雲端/AI 工作流於校務或社團，你會如何評估成本、效益與資安風險？', 'TCO/ROI、資料分類分級、權限、供應商風險、備援與監控', 'academic', 1, '2025-08-20 08:00:12.144', '淡江大學'),
(511, '描述你在淡江的國際資源下，想完成的一個跨國資料專案，預期影響為何？', '合作夥伴、里程碑、成功指標、法規合規、可持續性', 'motivation', 1, '2025-08-20 08:00:12.146', '淡江大學'),
(512, '規劃社群輿情與品牌健康度監測：資料蒐集、模型與儀表板如何設計？', '來源、標註、情緒/主題模型、視覺化、異常警示', 'academic', 1, '2025-08-20 08:00:12.151', '銘傳大學'),
(513, '企業行銷成效歸因專案，如何處理跨通路與跨裝置的識別？', 'ID 合併、Cookie 限制、MMM/多觸點、業務指標', 'career', 1, '2025-08-20 08:00:12.154', '銘傳大學'),
(514, '將設計思維導入資料產品的案例：如何釐清痛點並驗證雛形？', '同理訪談、旅程地圖、線框/原型、可用性測試', 'personal', 1, '2025-08-20 08:00:12.156', '銘傳大學'),
(515, '為影像/短影音做推薦，如何處理冷啟動與同質化？', '特徵工程、混合式推薦、探索/利用、評估多樣性', 'academic', 1, '2025-08-20 08:00:12.158', '銘傳大學'),
(516, '在銘傳如何結合傳播與資訊，打造具影響力的資料敘事？', '議題、來源、敘事結構、互動設計、傳播渠道', 'motivation', 1, '2025-08-20 08:00:12.160', '銘傳大學'),
(517, '以使用者研究為核心設計數位服務，資料如何支持設計決策？', '族群、方法、指標、實驗與追蹤、迭代機制', 'academic', 1, '2025-08-20 08:00:12.164', '實踐大學'),
(518, '與時尚/家設品牌合作，如何以數據優化商品企劃與補貨？', '銷售資料、供應鏈限制、季節/流行、預測模型、營運KPI', 'career', 1, '2025-08-20 08:00:12.167', '實踐大學'),
(519, '把分析結果轉化為視覺設計的經驗，如何兼顧美感與可讀性？', '層級、色彩、標註/圖例、可及性、迭代', 'personal', 1, '2025-08-20 08:00:12.169', '實踐大學'),
(520, '產學合作專題的版本管理與交付驗收如何規劃？', '里程碑、需求凍結、變更單、驗收標準、回顧', 'academic', 1, '2025-08-20 08:00:12.172', '實踐大學'),
(521, '為何適合在實踐？提出一個想落地的生活創新專題。', '痛點、解法、資源、產出、衡量', 'motivation', 1, '2025-08-20 08:00:12.174', '實踐大學'),
(522, '針對假資訊與深偽影像，設計跨來源的偵測系統與查核流程。', '來源比對、影像/文本模型、可信度、人工複核、發布', 'academic', 1, '2025-08-20 08:00:12.178', '世新大學'),
(523, '在媒體/公關產業，如何用數據支持內容選題與投放？', '受眾分群、成效指標、A/B 測試、競品追蹤、聲量', 'career', 1, '2025-08-20 08:00:12.180', '世新大學'),
(524, '處理輿情危機/社群爭議的經驗：蒐證、對策與成效追蹤。', '資料蒐集、利害關係人、溝通腳本、時程與後評估', 'personal', 1, '2025-08-20 08:00:12.182', '世新大學'),
(525, '影音推薦與版權保護之間如何平衡？', '辨識技術、白/黑名單、授權資料、風險評估、法遵', 'academic', 1, '2025-08-20 08:00:12.184', '世新大學'),
(526, '在世新想做的媒體資料專題與影響？', '議題意義、利害人、來源、產出、傳播', 'motivation', 1, '2025-08-20 08:00:12.185', '世新大學'),
(527, '提出一個「文化×資料」的校園或城市議題專題，規劃資料流程。', '主題聚焦、來源、清洗標準、資料庫設計、故事化', 'academic', 1, '2025-08-20 08:00:12.189', '文化大學'),
(528, '跨學院團隊中，如何平衡人文視角與技術可行性完成交付？', '分工、需求對齊、設計權衡、驗收與回顧', 'personal', 1, '2025-08-20 08:00:12.191', '文化大學'),
(529, '文創/觀光產業數據分析，建立哪些核心指標衡量成效？', '互動、來客/回流、轉換與客單、口碑、LTV', 'career', 1, '2025-08-20 08:00:12.193', '文化大學'),
(530, '地理與氣候資料的地圖儀表板如何設計以支援公共服務？', 'GIS、資料更新、權限、警示、使用者測試', 'academic', 1, '2025-08-20 08:00:12.195', '文化大學'),
(531, '在文化大學想做的文化創意與資料敘事企劃？', '題材、受眾、素材、產出形式、影響評估', 'motivation', 1, '2025-08-20 08:00:12.196', '文化大學'),
(532, '與在地企業合作的智慧製造資料專案構想。', '感測蒐集、即時監控、瓶頸分析、預測維護、導入', 'academic', 1, '2025-08-20 08:00:12.200', '逢甲大學'),
(533, '在團隊中建立專案管理與程式碼規範以提升交付品質。', 'Git 規範、看板/站會、程式/查核標準、CI/CD、自動化測試', 'career', 1, '2025-08-20 08:00:12.201', '逢甲大學'),
(534, '與產業導師合作帶來的實作與職涯啟發。', '情境、任務、成果、反思、後續行動', 'personal', 1, '2025-08-20 08:00:12.203', '逢甲大學'),
(535, '資料平台選型（自建/雲端/混合）的成本與擴充性評估。', '需求規模、TCO、性能、維運、SLA 與供應商管理', 'academic', 1, '2025-08-20 08:00:12.205', '逢甲大學'),
(536, '在逢甲想完成的創新專題與資源串連。', '資源盤點、合作夥伴、里程碑、風險與成功指標', 'motivation', 1, '2025-08-20 08:00:12.207', '逢甲大學'),
(537, '建立社會議題資料觀測站時，如何設計資料倫理與公開原則？', '授權、匿名化、偏誤辨識、開放資料分級、影響評估', 'academic', 1, '2025-08-20 08:00:12.210', '靜宜大學'),
(538, '服務學習/志工經驗中，如何把資料蒐集與回饋機制設計進活動？', '表單、回饋、定量/質化、改善循環', 'personal', 1, '2025-08-20 08:00:12.212', '靜宜大學'),
(539, '協助非營利組織募款成效分析的儀表板與溝通報告。', '捐款分群、留存/回流、活動成效、故事化、治理', 'career', 1, '2025-08-20 08:00:12.213', '靜宜大學'),
(540, '將資料工具融入雙語/通識課程與助教工作以提升學習成效。', '學習資料、形成性評量、同儕互評、學習歷程、隱私', 'academic', 1, '2025-08-20 08:00:12.215', '靜宜大學'),
(541, '在靜宜想完成的社會關懷資料專題與影響。', '受益對象、合作單位、資料方法、產出、影響指標', 'motivation', 1, '2025-08-20 08:00:12.216', '靜宜大學');

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
-- 資料表結構 `teachercomment`
--

CREATE TABLE `teachercomment` (
  `id` int(11) NOT NULL,
  `studentUserId` int(11) NOT NULL,
  `teacherUserId` int(11) NOT NULL,
  `targetType` varchar(191) NOT NULL,
  `videoAnswerId` int(11) DEFAULT NULL,
  `questionId` int(11) DEFAULT NULL,
  `comment` text NOT NULL,
  `score` int(11) DEFAULT NULL,
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
(2, '321', '$2b$10$k5r3SxJ0dIc03bWdll5/l.s0uw7DUVbEbt9lPOyri6LjJY1yqVHYq', 'teacher', '2025-08-05 19:24:51.002'),
(3, 'student', '$2b$10$88wSKPVqTgK2NVf7RZ8ePuyLnDWcWF6zvzkuLwIgARrPYUZbjxjLC', 'student', '2025-08-06 04:30:30.802'),
(4, 'teacher', '$2b$10$88wSKPVqTgK2NVf7RZ8ePuyLnDWcWF6zvzkuLwIgARrPYUZbjxjLC', 'teacher', '2025-08-06 04:30:30.819');

-- --------------------------------------------------------

--
-- 資料表結構 `videoanswer`
--

CREATE TABLE `videoanswer` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `questionId` int(11) DEFAULT NULL,
  `questionText` text DEFAULT NULL,
  `videoPath` varchar(191) NOT NULL,
  `durationSec` int(11) NOT NULL,
  `speechRate` int(11) DEFAULT NULL,
  `emotionScore` int(11) DEFAULT NULL,
  `transcript` text DEFAULT NULL,
  `analysisJson` text DEFAULT NULL,
  `thumbnailPath` varchar(191) DEFAULT NULL,
  `sizeBytes` int(11) NOT NULL,
  `mimeType` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
('8ce7fad2-1362-41f5-8e06-a1f4793aebcc', '42a4d06d19a8c4d29e7c97119caaee3a76fda2d26cc1f6e490aec9413a83a932', '2025-08-20 06:42:43.612', '20250820064243_add_school_to_questions', NULL, NULL, '2025-08-20 06:42:43.248', 1),
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
-- 資料表索引 `teachercomment`
--
ALTER TABLE `teachercomment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TeacherComment_studentUserId_idx` (`studentUserId`),
  ADD KEY `TeacherComment_teacherUserId_idx` (`teacherUserId`),
  ADD KEY `TeacherComment_videoAnswerId_idx` (`videoAnswerId`),
  ADD KEY `TeacherComment_questionId_idx` (`questionId`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`);

--
-- 資料表索引 `videoanswer`
--
ALTER TABLE `videoanswer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `VideoAnswer_userId_questionId_key` (`userId`,`questionId`),
  ADD KEY `VideoAnswer_userId_idx` (`userId`),
  ADD KEY `VideoAnswer_questionId_idx` (`questionId`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=542;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `resumeanalysis`
--
ALTER TABLE `resumeanalysis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `teachercomment`
--
ALTER TABLE `teachercomment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `videoanswer`
--
ALTER TABLE `videoanswer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `writtenanswer`
--
ALTER TABLE `writtenanswer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- 資料表的限制式 `teachercomment`
--
ALTER TABLE `teachercomment`
  ADD CONSTRAINT `TeacherComment_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `TeacherComment_studentUserId_fkey` FOREIGN KEY (`studentUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `TeacherComment_teacherUserId_fkey` FOREIGN KEY (`teacherUserId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `TeacherComment_videoAnswerId_fkey` FOREIGN KEY (`videoAnswerId`) REFERENCES `videoanswer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- 資料表的限制式 `videoanswer`
--
ALTER TABLE `videoanswer`
  ADD CONSTRAINT `VideoAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `VideoAnswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- 資料表的限制式 `writtenanswer`
--
ALTER TABLE `writtenanswer`
  ADD CONSTRAINT `WrittenAnswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
