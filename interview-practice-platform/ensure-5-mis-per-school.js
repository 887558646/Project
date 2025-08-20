// 為每個已有學校補齊到 5 題（資管系主題）
// 使用方式：node ensure-5-mis-per-school.js

const ADMIN_LIST_URL = "http://localhost:3000/api/written-qa/admin/questions"
const ADMIN_CREATE_URL = "http://localhost:3000/api/written-qa/admin/questions"

function buildMisTemplates(school) {
	const prefix = school ? `在${school}資管系，` : "在資管系，"
	return [
		{
			category: "academic",
			question: `${prefix}若課程需閱讀英文文獻或技術文件，你會如何強化英語閱讀與應用能力？請具體說明方法與驗證成效。`,
			hint: "建議包含：關鍵字檢索、筆記方法、工具（DeepL/Grammarly/ChatGPT/Notion）、輸出（讀書會/部落格/簡報）、成效驗證（測驗/產出）"
		},
		{
			category: "career",
			question: `${prefix}假設你要分析企業客戶資料庫並提出行銷或服務優化方案，你的資料取得、清理、建模與評估流程為何？`,
			hint: "建議包含：資料來源、ETL/清理、指標設計、模型/工具（SQL、Python、Tableau/PowerBI）、A/B 測試、隱私合規"
		},
		{
			category: "personal",
			question: `${prefix}請分享一次跨部門/跨領域專案協作的經驗，你如何定義需求、分工追蹤、風險管理與里程碑驗收？`,
			hint: "建議包含：需求對齊、看板管理、文件規範、溝通節奏、風險清單、驗收標準、回饋改進"
		},
		{
			category: "academic",
			question: `${prefix}若能跨院修課或規劃雙專長（如資工/商管/設計），你會選什麼並如何應用在特定情境（如營運/行銷/產品）？`,
			hint: "建議包含：課程選擇理由、技能互補、應用情境、專題設計、產出與指標、預期影響"
		},
		{
			category: "motivation",
			question: `${prefix}請分享你參與競賽/專題/實習的一次經驗，成功關鍵與不足為何？未來在資管領域想挑戰什麼？`,
			hint: "建議包含：題目背景、貢獻角色、方法工具、成果指標、反思改進、下一步目標（系統分析/資料/PM/顧問）"
		}
	]
}

async function main() {
	console.log("開始為各學校補齊到 5 題（資管系）…")
	const listRes = await fetch(ADMIN_LIST_URL)
	const listData = await listRes.json()
	if (!listData?.success) {
		console.log("❌ 無法取得題目列表")
		process.exit(1)
	}

	// 依學校分組（排除通用與空值）
	const schoolToQuestions = new Map()
	for (const q of listData.questions || []) {
		const school = q.school
		if (!school || school === "通用") continue
		if (!schoolToQuestions.has(school)) schoolToQuestions.set(school, [])
		schoolToQuestions.get(school).push(q)
	}

	for (const [school, items] of schoolToQuestions.entries()) {
		const templates = buildMisTemplates(school)
		// 以題幹字串比對是否已存在，避免重覆
		const existingTexts = new Set(items.map(i => i.question))
		const need = Math.max(0, 5 - items.length)
		if (need <= 0) {
			console.log(`✅ ${school} 已有 ${items.length} 題，無需新增`)
			continue
		}
		let added = 0
		for (const tpl of templates) {
			if (added >= need) break
			if (existingTexts.has(tpl.question)) continue
			try {
				const res = await fetch(ADMIN_CREATE_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						question: tpl.question,
						hint: tpl.hint,
						category: tpl.category,
						school,
						isActive: true
					})
				})
				const data = await res.json()
				if (data?.success) {
					added++
					console.log(`➕ ${school} 新增成功（${tpl.category}）`)
				} else {
					console.log(`⚠️ ${school} 新增失敗：${data?.message || "未知"}`)
				}
			} catch (e) {
				console.log(`❌ ${school} 新增錯誤：`, e.message)
			}
			await new Promise(r => setTimeout(r, 80))
		}
		console.log(`📌 ${school} 目前共有 ${items.length + added} 題`)
	}
	console.log("完成！")
}

main()
