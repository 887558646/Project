// 針對每個學校寫入/更新 5 題具該校特色的題目
// 使用：node rewrite-unique-school-questions.js

const LIST_URL = "http://localhost:3000/api/written-qa/admin/questions"
const MUTATE_URL = "http://localhost:3000/api/written-qa/admin/questions"

const SCHOOL_TEMPLATES = {
  "暨南大學": [
    { category: "academic", question: "暨南大學為僑校，校園多元國際化。請說明你如何在跨文化團隊中進行資料需求訪談，避免語意誤解並確保系統需求完整？", hint: "建議包含：跨文化溝通策略、需求文件雙語化、用詞標準化、樣本驗證、迭代澄清機制" },
    { category: "career", question: "若在粵港澳大灣區的企業進行數據專案，你會如何結合大灣區產業生態（電商/物流/金融）設計可落地的數據產品？", hint: "建議包含：情境選擇、資料來源與合規、核心指標、最小可行產品、商業價值驗證" },
    { category: "personal", question: "請分享你與海外僑生協作完成專題/活動的經驗，你如何處理時差、語言與文化差異並維持專案節奏？", hint: "建議包含：協作工具、節奏安排、衝突溝通、風險管理、交付檢核" },
    { category: "academic", question: "面對多語內容（繁中/簡中/英文），你會如何設計文本資料的清洗、標註與分析流程，以支援校務或企業洞察？", hint: "建議包含：分詞與編碼、清洗規則、標註流程、模型選擇、效能與準確度評估" },
    { category: "motivation", question: "為何選擇在暨南大學發展資訊管理？你希望如何運用僑校網絡與國際資源，創造跨境合作的價值？", hint: "建議包含：資源盤點、合作對象、預期產出、衡量指標、個人優勢" }
  ],
  "東海大學": [
    { category: "academic", question: "東海重視博雅教育與跨域融合。請提出一門你想設計的跨域課程（如資訊×環境永續），並說明評量指標與成果呈現。", hint: "建議包含：課綱架構、學習目標、工具與方法、評量方式、學習歷程檔案" },
    { category: "personal", question: "東海校園推動永續與生態。請描述你會如何以資料視覺化呈現校園能源/垃圾/用水的洞察，提供改善建議。", hint: "建議包含：資料來源、清理轉換、可視化圖型選擇、洞察重點、行動建議" },
    { category: "career", question: "若進入中部製造/服務業實習，你會如何導入流程數位化專案？", hint: "建議包含：現況盤點、痛點優先順序、系統雛形、ROI 與導入計畫、變更管理" },
    { category: "academic", question: "面對開源工具與雲端服務，你如何規劃團隊的資料治理與版本控管，以確保專題可重現與可維護？", hint: "建議包含：資料字典、命名規範、權限與備援、CI/CD、審計紀錄" },
    { category: "motivation", question: "說說你在東海的人文環境中，如何培養同理與商業敏銳度，並在資訊專案裡平衡使用者體驗與技術可行性。", hint: "建議包含：用研方法、用戶旅程、技術評估、決策取捨、學習反思" }
  ],
  "輔仁大學": [
    { category: "academic", question: "輔大強調全人與倫理。若為醫療/社福單位打造資料平台，你如何兼顧隱私、同意、與資料可用性？", hint: "建議包含：去識別、最小必要、存取控管、倫理審查、資料生命周期管理" },
    { category: "career", question: "請規劃一個醫院門診效率優化的資訊專案，你會蒐集哪些資料並如何驗證成效？", hint: "建議包含：排隊與掛號資料、動線/等候時間、瓶頸分析、實驗設計、病患滿意度" },
    { category: "personal", question: "分享一次你在專案中面對價值衝突（效率 vs. 公平）的抉擇，你如何與利害關係人溝通並達成共識？", hint: "建議包含：利害關係人分析、準則與權衡、會議紀錄、決策後追蹤" },
    { category: "academic", question: "若要在課程中導入生成式AI輔助寫作與分析，你會如何設計學術誠信與引用規範，避免濫用？", hint: "建議包含：界線定義、引用格式、查核流程、作業設計、抄襲偵測" },
    { category: "motivation", question: "你為何適合在輔大學習資訊管理？請結合人本關懷與科技應用，提出一個想做的校園/社會服務專案。", hint: "建議包含：問題定義、受益族群、解法構想、資源需求、成效衡量" }
  ],
  "淡江大學": [
    { category: "academic", question: "淡江以國際化見長。若參與國際交換/雙聯計畫，你會如何把不同學校的學習成果整合為可移轉的能力證明？", hint: "建議包含：學習地圖、能力對照、數位徽章、作品集、第三方驗證" },
    { category: "career", question: "請設計一個跨語系電商的成長分析框架（中文/英文/日文），用以制定在地化營運策略。", hint: "建議包含：市場區隔、轉換漏斗、關鍵指標、A/B 測試、在地內容策略" },
    { category: "personal", question: "分享你如何在多外語環境中主持會議與寫作文件，使團隊快速對齊且可追溯。", hint: "建議包含：會議節奏、紀錄範本、決議追蹤、版本控管、文化敏感度" },
    { category: "academic", question: "若要導入雲端/AI 工作流於校務或社團，你會如何評估成本、效益與資安風險？", hint: "建議包含：TCO/ROI、資料分類分級、權限、供應商風險、備援與監控" },
    { category: "motivation", question: "描述你在淡江的國際資源下，想完成的一個跨國資料專案，預期影響為何？", hint: "建議包含：合作夥伴、里程碑、成功指標、法規合規、可持續性" }
  ],
  "銘傳大學": [
    { category: "academic", question: "銘傳在傳播與設計有優勢。若要做社群輿情與品牌健康度監測，你的資料蒐集、模型與儀表板會如何設計？", hint: "建議包含：資料來源、標註策略、情緒/主題模型、視覺化、異常警示" },
    { category: "career", question: "請規劃一個與企業合作的行銷成效歸因專案，如何處理跨通路與跨裝置的識別問題？", hint: "建議包含：ID 合併、Cookie/隱私限制、MMM/多觸點歸因、業務指標" },
    { category: "personal", question: "分享一次你將設計思維導入資料產品的案例，如何釐清痛點、跑使用者旅程、並驗證雛形？", hint: "建議包含：同理訪談、旅程地圖、線框/原型、可用性測試、學習迭代" },
    { category: "academic", question: "若要為影像/短影音內容做推薦，你會如何處理冷啟動與同質化問題？", hint: "建議包含：特徵工程、混合式推薦、探索/利用、評估指標、內容多樣性" },
    { category: "motivation", question: "你打算如何在銘傳把傳播與資訊結合，打造具影響力的資料敘事專題？", hint: "建議包含：議題選擇、資料來源、敘事結構、互動設計、傳播渠道" }
  ],
  "實踐大學": [
    { category: "academic", question: "實踐重視設計與生活創新。請設計一個以使用者研究為核心的數位服務，並說明資料如何支持設計決策。", hint: "建議包含：目標族群、研究方法、指標設計、實驗與追蹤、迭代機制" },
    { category: "career", question: "若與時尚/家設品牌合作，如何以數據驅動的方式優化商品企劃與補貨決策？", hint: "建議包含：銷售資料、供應鏈限制、季節性/流行、預測模型、營運KPI" },
    { category: "personal", question: "描述你一次把資料分析結果轉化為視覺設計的經驗，如何兼顧美感與可讀性？", hint: "建議包含：視覺層級、色彩與對比、標註與圖例、可及性、回饋迭代" },
    { category: "academic", question: "對於校內產學合作專題，你會如何規劃版本管理與交付驗收，確保客戶/指導老師雙方期望一致？", hint: "建議包含：里程碑、需求凍結、變更單、驗收標準、回顧機制" },
    { category: "motivation", question: "為何適合在實踐？請結合設計與管理提出你想落地的生活創新專題。", hint: "建議包含：痛點、解法、資源、產出、衡量指標" }
  ],
  "世新大學": [
    { category: "academic", question: "世新以新聞傳播著稱。針對假資訊與深偽影像，你會如何設計跨資料來源的偵測系統與查核流程？", hint: "建議包含：來源比對、影像/文本模型、可信度評分、人工複核、發布機制" },
    { category: "career", question: "若在媒體/公關產業實習，你會如何用數據支持內容選題與投放決策？", hint: "建議包含：受眾分群、成效指標、A/B 測試、競品追蹤、品牌聲量" },
    { category: "personal", question: "分享你一次處理輿情危機或社群爭議的經驗，如何蒐集證據、定義對策並追蹤成效？", hint: "建議包含：資料蒐集、利害關係人、溝通腳本、節點與時程、後評估" },
    { category: "academic", question: "對於影音內容推薦與版權保護，你會如何在技術與法規間取得平衡？", hint: "建議包含：辨識技術、白名單/黑名單、授權資料、風險評估、法遵" },
    { category: "motivation", question: "你想在世新做哪個媒體資料專題？為何重要？", hint: "建議包含：議題意義、利害人、資料來源、預期產出、影響與傳播" }
  ],
  "文化大學": [
    { category: "academic", question: "文化大學位於陽明山，學科多元。請提出一個『文化×資料』的校園或城市議題專題，並規劃資料流程。", hint: "建議包含：主題聚焦、來源蒐集、清洗標準、資料庫設計、視覺化故事" },
    { category: "personal", question: "描述你如何在跨學院團隊中，平衡人文視角與技術可行性，完成一次高品質交付。", hint: "建議包含：角色分工、需求對齊、設計權衡、驗收與回顧" },
    { category: "career", question: "若從事文創/觀光產業的數據分析，你會建立哪些核心指標來衡量內容與活動成效？", hint: "建議包含：內容互動、來客/回流、轉換與客單、口碑、長期價值" },
    { category: "academic", question: "面對地理與氣候資料，你會如何設計結合地圖的互動儀表板，用於校園安全與公共服務？", hint: "建議包含：GIS/地圖、資料更新、權限、警示、使用者測試" },
    { category: "motivation", question: "為何選擇文化？請結合個人專長提出一個文化創意與資料敘事的企劃。", hint: "建議包含：題材、受眾、素材、產出形式、影響評估" }
  ],
  "逢甲大學": [
    { category: "academic", question: "逢甲靠近中科與產學鏈結強。請提出一個與在地企業合作的智慧製造資料專案構想。", hint: "建議包含：感測與資料蒐集、即時監控、瓶頸分析、預測維護、導入計畫" },
    { category: "career", question: "若擔任IT/資料實習生，你會如何導入專案管理與程式碼規範，提升團隊交付品質？", hint: "建議包含：Git 規範、看板/站會、程式/查核標準、CI/CD、自動化測試" },
    { category: "personal", question: "分享一次你與產業導師合作的學習經驗，帶來哪些實作與職涯啟發？", hint: "建議包含：情境、任務、成果、反思、後續行動" },
    { category: "academic", question: "對於資料平台選型（自建/雲端/混合），你會如何做成本與擴充性的評估？", hint: "建議包含：需求規模、TCO、性能、維運、SLA 與供應商管理" },
    { category: "motivation", question: "你想在逢甲完成哪個創新專題？請說明你將如何串連校內外資源實現。", hint: "建議包含：資源盤點、合作夥伴、里程碑、風險與備援、成功指標" }
  ],
  "靜宜大學": [
    { category: "academic", question: "靜宜具人文社會關懷傳統。若要做社會議題資料觀測站，你會如何設計資料倫理、當事人保護與公開原則？", hint: "建議包含：資料授權、匿名化、偏誤辨識、開放資料分級、影響評估" },
    { category: "personal", question: "請分享一次你服務學習或志工經驗，如何把資料蒐集與回饋機制設計進活動中，持續優化服務？", hint: "建議包含：表單設計、使用者回饋、定量/質化分析、改善循環" },
    { category: "career", question: "若協助非營利組織募款與成效分析，你會如何設計儀表板與溝通報告？", hint: "建議包含：捐款分群、留存/回流、活動成效、故事化呈現、治理" },
    { category: "academic", question: "對於雙語與通識課程，你如何把資料工具融入學習與教學助理工作，提升同學學習成效？", hint: "建議包含：學習資料、形成性評量、同儕互評、學習歷程、隱私" },
    { category: "motivation", question: "說明你在靜宜想完成的一個社會關懷資料專題及其影響。", hint: "建議包含：受益對象、合作單位、資料與方法、產出、影響指標" }
  ],
  // 新增：台大、清大、交大、政大、成大、中央、中山、中興、台科大、北科大
  "台大": [
    { category: "academic", question: "台大跨院資源豐富。請設計一個『醫療/農業/工程 × 資訊管理』的跨域專題，並提出資料治理與倫理規範。", hint: "建議包含：資料授權、去識別、資料湖/倉設計、版本與權限、審計與合規" },
    { category: "career", question: "若進入新創或研究中心，你會如何以資料驅動的方式建立MVP並驗證產品市場適配（PMF）？", hint: "建議包含：問題假設、實驗設計、最小可行產品、北極星指標、迭代節奏" },
    { category: "personal", question: "分享你在大型團隊/競賽中的一次協作經驗，如何在多模組整合下確保品質與交付？", hint: "建議包含：模組邊界、介面合約、CI/CD、測試策略、風險管理" },
    { category: "academic", question: "面對研究數據與開放資料，你會如何建構可重現的分析流水線？", hint: "建議包含：數據版本控制、環境管理、容器化、隱私與授權、再現性驗證" },
    { category: "motivation", question: "你打算如何運用台大的跨域平台，打造具社會影響力的資訊專案？", hint: "建議包含：利害關係人、影響地圖、衡量指標、永續性" }
  ],
  "清大": [
    { category: "academic", question: "清大強調理工基礎。請設計一個資料科學實驗，從資料蒐集到模型評估完整規劃。", hint: "建議包含：資料品質、特徵工程、基準模型、交叉驗證、誤差分析" },
    { category: "career", question: "針對半導體/硬體供應鏈，你會如何做資料驅動的產能與良率分析？", hint: "建議包含：感測資料、流程參數、因果/統計方法、可視化、決策支持" },
    { category: "personal", question: "描述你在高壓時程下完成技術挑戰的經驗，你如何拆解問題與調度資源？", hint: "建議包含：瓶頸定位、工具選擇、時間管理、協作分工、回顧改善" },
    { category: "academic", question: "對於演算法與效能，你會如何評估在產業情境中的取捨？", hint: "建議包含：時間/空間複雜度、可維運性、成本、風險與合規" },
    { category: "motivation", question: "你想在清大完成哪個資料/系統專題？為何重要？", hint: "建議包含：問題價值、技術路線、實驗設計、資源需求、成功標準" }
  ],
  "交大": [
    { category: "academic", question: "交大著重通訊與資電。請設計一個結合 IoT 與雲端的資料平台，支援邊緣到雲的資料處理。", hint: "建議包含：通訊協定、邊緣計算、串流/批次、資料一致性、監控與告警" },
    { category: "career", question: "若在車用/智慧城市場域，你會如何規劃資料收集與安全架構？", hint: "建議包含：資料分類分級、加密與匿名、權限、傳輸安全、法規與資安事件應變" },
    { category: "personal", question: "分享一次你在系統整合專案中的角色，你如何協調跨平台相依與部署？", hint: "建議包含：系統設計圖、環境差異、藍綠/金絲雀、回滾機制、SLA" },
    { category: "academic", question: "針對高頻資料，你會如何設計可擴充的資料管線與儲存？", hint: "建議包含：資料分片、壓縮/快取、熱/冷分層、成本控管、觀測性" },
    { category: "motivation", question: "你想在交大推進哪個智慧交通/物聯資料專題？請說明影響與風險。", hint: "建議包含：場域、利害人、成效指標、風險與緩解" }
  ],
  "政大": [
    { category: "academic", question: "政大強於社科與商管。請提出一個結合政策資料與企業數據的決策支持系統。", hint: "建議包含：資料治理、指標體系、可視化溝通、政策/商業影響評估" },
    { category: "career", question: "若進入金融/公部門資料職位，你會如何處理資料敏感性與合規？", hint: "建議包含：法遵要求、權限與稽核、留痕、模型可解釋性、壓力測試" },
    { category: "personal", question: "分享一次你在專案中與利害關係人談判協調的經驗，如何兼顧效率與公平？", hint: "建議包含：利益地圖、議程設計、決策紀錄、衝突解法、後續追蹤" },
    { category: "academic", question: "面對假訊息/政策溝通，你會如何設計資料驅動的輿情分析與策略建議？", hint: "建議包含：資料來源、主題/情緒模型、政策議題映射、回饋機制" },
    { category: "motivation", question: "你想在政大推動哪個資料治理或公共創新專題？", hint: "建議包含：問題痛點、合作單位、衡量指標、風險/倫理" }
  ],
  "成大": [
    { category: "academic", question: "成大與醫工/製造鏈結強。請提出一個結合醫材或智慧製造的資訊管理專題。", hint: "建議包含：需求訪談、資料流與系統圖、法規/資安、驗證與導入" },
    { category: "career", question: "若進入南部產業鏈企業，你會如何以數據提升營運效率與品質？", hint: "建議包含：瓶頸診斷、KPI、資料平台、改善路線圖、ROI" },
    { category: "personal", question: "描述你在資源有限情境下完成專案的案例，你如何取捨與創新？", hint: "建議包含：最小可行、替代方案、技術債、回饋循環" },
    { category: "academic", question: "對於時序與感測資料，你的特徵工程與模型評估策略是什麼？", hint: "建議包含：前處理、特徵設計、交叉驗證、效能/穩定性、可解釋性" },
    { category: "motivation", question: "你想在成大完成哪個與在地產業共創的資料專題？", hint: "建議包含：合作夥伴、場域、指標、永續性" }
  ],
  "中央": [
    { category: "academic", question: "中央數理基礎紮實。請設計一個以統計/機器學習為核心的方法論專題，並說明驗證設計。", hint: "建議包含：假設檢定、交叉驗證、偏差/變異、敏感度分析、可解釋性" },
    { category: "career", question: "若在資料平台團隊任職，你會如何建立資料品質監控與告警？", hint: "建議包含：品質指標、校驗規則、監控儀表板、告警策略、事故處理" },
    { category: "personal", question: "說明你一次將抽象數理轉化為可用產品的經驗。", hint: "建議包含：建模、工程化、用戶回饋、效益量測" },
    { category: "academic", question: "對於多來源異質資料，你的整併與一致性策略為何？", hint: "建議包含：匹配與去重、結構/半結構/非結構、權威來源、稽核" },
    { category: "motivation", question: "你在中央想完成的學術×實務橋接專題是什麼？", hint: "建議包含：目標、方法、資源、影響" }
  ],
  "中山": [
    { category: "academic", question: "中山海事/環境與商管並重。請規劃一個結合海事或港都資料的管理決策系統。", hint: "建議包含：資料來源、感測網、GIS、視覺化、決策情境" },
    { category: "career", question: "若在港都產業服務，你會如何設計資料專案的資料取得與權限機制？", hint: "建議包含：資料契約、API/批次、權限/稽核、法規遵循" },
    { category: "personal", question: "分享一次你與不同背景同學協作的經驗，如何整合觀點並完成交付？", hint: "建議包含：需求對齊、衝突處理、文件化、回顧" },
    { category: "academic", question: "面對地理/環境/即時資料，你的系統設計與容量規劃如何取捨？", hint: "建議包含：存儲分層、快取、擴充、成本/可用性" },
    { category: "motivation", question: "你想在中山打造哪個結合在地特色的資料服務？", hint: "建議包含：受益者、價值、風險、衡量" }
  ],
  "中興": [
    { category: "academic", question: "中興重視農業與生命科學。請設計一個農業數據平台以支援智慧農業決策。", hint: "建議包含：感測與天氣資料、病蟲害偵測、產量預測、行動建議、成本效益" },
    { category: "career", question: "若與農會/產銷班合作，你會如何規劃資料蒐集與隱私合規？", hint: "建議包含：資料授權、匿名化、共享機制、資料品質" },
    { category: "personal", question: "分享你在戶外/田間場域的資料採集經驗，遇到問題與解法？", hint: "建議包含：設備限制、缺失值、校正、後處理、驗證" },
    { category: "academic", question: "針對時空資料，你的資料庫與分析流程如何設計？", hint: "建議包含：座標系統、索引與查詢、視覺化、模型評估" },
    { category: "motivation", question: "你想在中興推進的智慧農業/食品追溯專題是什麼？", hint: "建議包含：利害人、價值鏈、指標、永續" }
  ],
  "台科大": [
    { category: "academic", question: "台科大工程與實務導向。請提出一個以雲端與API為核心的系統整合專題，說明架構與測試策略。", hint: "建議包含：微服務、認證授權、整合測試、壓力測試、監控" },
    { category: "career", question: "若與中小企業合作導入數位轉型，你會如何落地並衡量成效？", hint: "建議包含：需求盤點、導入路線圖、教育訓練、KPI、財務影響" },
    { category: "personal", question: "描述你一次把理論快速落地為產品的經驗，如何平衡速度與品質？", hint: "建議包含：技術債、代碼規範、驗收、回滾與熱修" },
    { category: "academic", question: "針對資料工程與分析協作，你的資料契約與模式管理如何設計？", hint: "建議包含：Schema 演進、向後相容、資料校驗、契約測試" },
    { category: "motivation", question: "你想在台科大完成哪個產學協作專案？", hint: "建議包含：題目來源、里程碑、資源需求、成功指標" }
  ],
  "北科大": [
    { category: "academic", question: "北科大貼近產業。請設計一個結合智慧製造/智慧建築的資料平台，說明邊緣到雲的資料流。", hint: "建議包含：感測與通訊、資料匯聚、串流/批次、資料存取、視覺化" },
    { category: "career", question: "若協助傳產升級，你會如何以資料治理解決資料孤島與品質問題？", hint: "建議包含：主數據、資料目錄、血緣/影響分析、品質指標、治理流程" },
    { category: "personal", question: "分享一次你在產線/工地場域推動數位工具的經驗，如何克服阻力？", hint: "建議包含：利害人訪談、試點與擴散、教育訓練、回饋改進" },
    { category: "academic", question: "對於高可用系統，你的容錯與備援架構如何設計？", hint: "建議包含：多區域、故障演練、恢復目標、監控與告警" },
    { category: "motivation", question: "你想在北科大做哪個與在地產業鏈結的資料應用？", hint: "建議包含：場域/合作夥伴、價值、風險、衡量" }
  ]
}

async function main() {
  console.log("抓取現有題目…")
  const listRes = await fetch(LIST_URL)
  const listData = await listRes.json()
  if (!listData?.success) {
    console.log("❌ 無法取得題目列表")
    process.exit(1)
  }

  const bySchool = {}
  for (const q of listData.questions) {
    const s = q.school
    if (!s || s === "通用") continue
    if (!bySchool[s]) bySchool[s] = []
    bySchool[s].push(q)
  }

  for (const [school, templates] of Object.entries(SCHOOL_TEMPLATES)) {
    const existing = (bySchool[school] || []).sort((a, b) => a.id - b.id)

    // 先更新前 5 筆（若不足則先更新現有，再補新）
    const toUpdate = Math.min(existing.length, 5)
    for (let i = 0; i < toUpdate; i++) {
      const t = templates[i]
      const q = existing[i]
      try {
        const res = await fetch(MUTATE_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: q.id, question: t.question, hint: t.hint, category: t.category, school, isActive: true })
        })
        const data = await res.json()
        if (data?.success) console.log(`✅ 更新：${school} id=${q.id}`)
        else console.log(`⚠️ 更新失敗：${school} id=${q.id}`)
      } catch (e) {
        console.log(`❌ 更新錯誤：${school} id=${q.id}`, e.message)
      }
      await new Promise(r => setTimeout(r, 80))
    }

    // 若不足 5 題就補齊
    for (let i = toUpdate; i < 5; i++) {
      const t = templates[i]
      try {
        const res = await fetch(MUTATE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: t.question, hint: t.hint, category: t.category, school, isActive: true })
        })
        const data = await res.json()
        if (data?.success) console.log(`➕ 新增：${school}`)
        else console.log(`⚠️ 新增失敗：${school}`)
      } catch (e) {
        console.log(`❌ 新增錯誤：${school}`, e.message)
      }
      await new Promise(r => setTimeout(r, 80))
    }
  }
  console.log("完成每校 5 題獨特題目寫入/更新。")
}

main()
