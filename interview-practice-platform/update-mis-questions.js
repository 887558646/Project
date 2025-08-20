// 將特定學校的題目更新為「資管系」相關
const MIS_SCHOOLS = [
	"暨南大學",
	"東海大學",
	"輔仁大學",
	"淡江大學",
	"銘傳大學",
	"實踐大學",
	"世新大學",
	"文化大學",
	"逢甲大學",
	"靜宜大學"
]

function getUpdatedContent(school, category) {
	const prefix = school ? `在${school}資管系，` : "在資管系，"
	switch (category) {
		case "academic":
			return {
				question: `${prefix}請分享你對資管核心課程（系統分析、資料庫、程式設計、資訊安全或企業資源規劃）的理解，以及你會如何串接理論與專題/實務來提升能力？`,
				hint: "建議包含：課程重點、工具/技術（如SQL、UML、Git、雲端服務）、專題經驗、如何驗證成效（效能/穩定/使用者滿意）、未來精進計畫"
			}
		case "career":
			return {
				question: `${prefix}請談談你的職涯規劃（如系統分析師、產品經理、資料工程/分析、IT顧問），你目前的能力差距是什麼？入學後會如何補齊？`,
				hint: "建議包含：職涯目標、能力盤點（程式/資料/商務溝通/專案管理）、在校資源（課程、實習、產學合作、競賽）、具體時間表"
			}
		case "personal":
			return {
				question: `${prefix}請分享一段你以資管觀點解決問題的經驗（專題/社團/實習/打工），你如何定義需求、設計解法、實作與驗證？遇到風險如何處理？`,
				hint: "建議包含：需求拆解、資料蒐集、雛形驗證、技術選型、溝通協作、績效衡量（例如指標/回饋）"
			}
		case "motivation":
			return {
				question: `${prefix}為什麼選擇資管系？與「資工/資策/企管」相比，你的差異化定位是什麼？請具體說明你將如何結合商務與資訊創造價值。`,
				hint: "建議包含：資管定位（商務×資訊）、實際應用場景（流程優化、數據驅動決策、資訊治理）、個人優勢與計畫"
			}
		default:
			return {
				question: `${prefix}請分享你對資管系的理解、學習重點與實作規劃。`,
				hint: "建議包含：課程、工具、專題、驗證與反思"
			}
	}
}

async function run() {
	console.log("開始更新為資管系相關題目…")
	const listRes = await fetch("http://localhost:3000/api/written-qa/admin/questions")
	const listData = await listRes.json()
	if (!listData?.success) {
		console.log("❌ 無法取得題目列表")
		process.exit(1)
	}

	const targets = listData.questions.filter(q => q.school && MIS_SCHOOLS.includes(q.school))
	console.log(`共找到 ${targets.length} 題需更新（學校：${MIS_SCHOOLS.join("、")}）`)

	for (const q of targets) {
		const { question, hint } = getUpdatedContent(q.school, q.category)
		try {
			const putRes = await fetch(`http://localhost:3000/api/written-qa/admin/questions`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: q.id,
					question,
					hint,
					category: q.category,
					school: q.school,
					isActive: q.isActive ?? true
				})
			})
			const putData = await putRes.json()
			if (putData?.success) {
				console.log(`✅ 已更新（${q.school}｜${q.category}）id=${q.id}`)
			} else {
				console.log(`❌ 更新失敗 id=${q.id}：${putData?.message || "未知原因"}`)
			}
		} catch (e) {
			console.log(`❌ 更新錯誤 id=${q.id}:`, e.message)
		}
		await new Promise(r => setTimeout(r, 80))
	}
	console.log("更新完成！")
}

run()
