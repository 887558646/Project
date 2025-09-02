import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// 與書面審查一致：解析JSON
function extractFirstJson(text: string): any {
  try { return JSON.parse(text) } catch {
    const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (!m) return null
    try { return JSON.parse(m[0]) } catch { return null }
  }
}

// 啟發式本地回退：產生5題（question/hint/category/reason）
function localFallbackQuestions(introText: string) {
  const topics = [] as string[]
  if (/(專案|project|比賽|競賽|實習|intern)/i.test(introText)) topics.push('專案與成果')
  if (/(志工|社團|服務|service)/i.test(introText)) topics.push('社團與服務')
  if (/(AI|人工智慧|資料|data|分析|分析)/i.test(introText)) topics.push('技術興趣')
  if (/(規劃|目標|計畫|plan)/.test(introText)) topics.push('未來規劃')
  if (/(學校|課程|老師|系)/.test(introText)) topics.push('學習經驗')

  const base = [
    {
      question: '你在自我介紹中提到的代表性經歷是什麼？請具體說明你的角色、做法與成果。',
      hint: 'STAR 法描述；強調你的貢獻與可量化成果',
      category: 'personal',
      reason: '聚焦關鍵經歷以評估行動力與影響力'
    },
    {
      question: '請挑一個你最滿意的作品/專案，說明遇到的最大挑戰與你如何解決。',
      hint: '描述問題→分析→方案→結果',
      category: 'technical',
      reason: '檢視問題分析與解決能力'
    },
    {
      question: '你為何對資訊管理/相關領域感興趣？請連結自我介紹中的具體契機。',
      hint: '從經歷中找動機來源，避免空話',
      category: 'personal',
      reason: '驗證動機真實性與一致性'
    },
    {
      question: '在團隊合作的經驗中，你擔任什麼角色？如何與他人協作與溝通？',
      hint: '舉例說明協作方式與衝突處理',
      category: 'career',
      reason: '評估協作與溝通能力'
    },
    {
      question: '未來 1-2 年你最想精進的能力是什麼？你的具體計畫為何？',
      hint: '短期可執行的路徑與衡量指標',
      category: 'academic',
      reason: '觀察規劃能力與落地性'
    }
  ]

  // 若偵測到主題則優先替換前幾題
  const mapped = [...base]
  if (topics.includes('專案與成果')) mapped[0].question = '你提到的專案/比賽中，哪一項最具代表性？請量化說明你的具體貢獻與結果。'
  if (topics.includes('技術興趣')) mapped[2].question = '你為何對 AI/資料分析特別有興趣？請結合你文中提到的經歷說明。'
  if (topics.includes('社團與服務')) mapped[3].question = '在社團/志工經驗中，你如何定義自己的角色與價值？舉一例說明。'

  return mapped
}

// 與書面審查一致：OpenAI重試與超時
async function callOpenAIWithRetry(prompt: string, maxRetries = 3) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OpenAI API Key not found")

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "你是一位資深的資管系教授，專門設計高度個性化的面試問題。你的任務是根據學生的自我介紹內容生成恰好5個非常具體的問題，每個問題都必須直接引用自我介紹中的具體內容。請務必回傳有效的JSON格式，不要包含任何說明文字。" },
            { role: "user", content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 1000
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      const result = content ? extractFirstJson(content) : null
      if (result) return result
      throw new Error("無法解析OpenAI回應")
    } catch (e) {
      if (attempt === maxRetries) throw e
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授权访问" }, { status: 401 })
    }

    const { introText, analysisResults } = await req.json()

    if (!introText || !introText.trim()) {
      return NextResponse.json({ success: false, message: "缺少自我介绍内容" }, { status: 400 })
    }

    const prompt = `請根據以下自我介紹內容生成「恰好5題」個性化面試問題：\n\n要求：\n- 僅回傳 JSON 陣列（5 個物件），每個物件包含 question、hint、category、reason。\n- question 必須直接引用或緊密關聯自我介紹中的具體內容。\n- category 取 personal/academic/technical/career 之一。\n\n自我介紹內容：\n${introText}`

    let questionsArray: any[] = []
    try {
      const result = await callOpenAIWithRetry(prompt)
      questionsArray = Array.isArray(result) ? result : (result?.question ? [result] : [])
    } catch (e) {
      // 無 KEY 或 OpenAI 失敗 → 使用本地回退
      questionsArray = localFallbackQuestions(introText)
    }

    // 正規化為 5 題
    questionsArray = questionsArray.map((x: any) => ({
      question: String(x?.question || ''),
      hint: String(x?.hint || ''),
      category: String(x?.category || 'personal'),
      reason: String(x?.reason || '')
    })).filter((q: any) => q.question)

    if (questionsArray.length > 5) questionsArray = questionsArray.slice(0, 5)
    while (questionsArray.length < 5) {
      questionsArray.push({
        question: `請補充一段與「${introText.slice(0, 12)}…」相關的具體經歷與成果。`,
        hint: 'STAR 法描述；量化成果',
        category: 'personal',
        reason: '補足題目數量'
      })
    }

    // 保存
    try {
      const saveResponse = await fetch(`${req.nextUrl.origin}/api/self-intro/save-with-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': req.headers.get('cookie') || '' },
        body: JSON.stringify({ introText, analysisResults, questions: questionsArray })
      })
      const saveResult = await saveResponse.json()
      if (saveResult.success) {
        return NextResponse.json({ success: true, questions: questionsArray, message: "个性化问题生成并保存成功", analysisId: saveResult.analysisId, questionsCount: saveResult.questionsCount })
      }
      return NextResponse.json({ success: true, questions: questionsArray, message: "生成成功，保存失敗" })
    } catch {
      return NextResponse.json({ success: true, questions: questionsArray, message: "生成成功，保存失敗" })
    }
  } catch (error: any) {
    console.error("生成个性化问题失败:", error)
    return NextResponse.json({ success: false, message: error?.message || "生成失败，请稍后重试" }, { status: 500 })
  }
}
