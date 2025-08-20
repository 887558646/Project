// 統計各校題目數量
const url = "http://localhost:3000/api/written-qa/admin/questions"

async function run() {
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data?.success) {
      console.log("API 返回失敗")
      process.exit(1)
    }
    const counts = {}
    for (const q of data.questions) {
      const s = q.school || '通用'
      counts[s] = (counts[s] || 0) + 1
    }
    const schools = Object.keys(counts).sort()
    for (const s of schools) {
      console.log(`${s}: ${counts[s]}`)
    }
  } catch (e) {
    console.error("檢查失敗:", e.message)
    process.exit(1)
  }
}

run()
