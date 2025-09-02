import "@/lib/env"
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// 本地回退分析：根據字數與關鍵詞做啟發式計分，結構與書面一致
function localFallbackAnalysis(introText: string) {
  const len = (introText || '').trim().length
  const hasNumbers = /\d/.test(introText)
  const hasProject = /(專案|project|比賽|競賽|實習|intern)/i.test(introText)
  const hasLogic = /(首先|其次|最後|因此|因為|所以|總結)/.test(introText)

  const score = (base: number) => {
    let s = base
    if (len >= 200 && len <= 350) s += 10
    if (hasNumbers) s += 5
    if (hasProject) s += 5
    if (hasLogic) s += 5
    return Math.max(40, Math.min(95, Math.round(s)))
  }

  const categories = [
    { name: '邏輯結構', score: score(60) },
    { name: '動機明確度', score: score(58) },
    { name: '個人化程度', score: score(57) },
    { name: '語言表達', score: score(59) },
    { name: '內容深度', score: score(56) },
    { name: '具體性', score: score(55) },
  ].map(c => ({
    ...c,
    feedback: '啟發式本地分析：可再補充量化成果與具體情境，並加強段落過渡。',
    strengths: ['結構基本清楚', '動機方向明確', '語氣自然流暢'],
    weaknesses: ['量化成果偏少', '個人特色尚可強化', '少數段落銜接略顯鬆散'],
    suggestions: ['加入1-2個具體數字或成果', '以首先/接著/最後串聯段落', '聚焦1-2個最能代表你的亮點']
  }))

  const overall = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)

  return {
    scoreResult: {
      overallScore: overall,
      categories
    },
    issuesResult: [
      {
        text: '量化具體性不足',
        suggestion: '為關鍵經歷補上可量化數字（如成果、排名、時長）',
        severity: 'medium',
        category: 'specificity',
        reason: '文本中可量化描述較少',
        improved_example: '在社團比賽中獲得全國第3名，負責資料清洗與模型調參'
      }
    ],
    rewriteResult: introText.length > 0 ? introText.slice(0, 300) : '—',
    structureResult: [
      {
        title: '背景與動機',
        points: ['簡述興趣來源與契機', '對資管的理解與選擇理由'],
        writing_tips: '避免空泛套話，直述具體契機',
        common_mistakes: '動機僅停留在興趣層面',
        word_count: '80-100'
      },
      {
        title: '核心經歷與成果',
        points: ['1-2個代表性經歷', '量化成果與個人貢獻', '學習反思'],
        writing_tips: 'STAR 法描述，突出「你」做了什麼',
        common_mistakes: '只列任務未說明成果',
        word_count: '90-120'
      },
      {
        title: '未來規劃與呼應',
        points: ['短中期規劃', '呼應學校/系所資源'],
        writing_tips: '規劃落地而非口號',
        common_mistakes: '規劃過於籠統',
        word_count: '60-80'
      }
    ]
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, message: "未授權" }, { status: 401 })
    }

    const { introText } = await req.json()
    if (!introText) {
      return NextResponse.json({ success: false, message: "缺少自我介紹內容" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    // 無 Key：回退本地分析，回 200
    if (!apiKey) {
      const result = localFallbackAnalysis(introText)
      return NextResponse.json({ success: true, result, fallback: true })
    }

    const prompt = `你是一位嚴謹的頂尖面試官，現在要對「自我介紹」做完整結構化分析。\n\n請嚴格遵守下列規則：\n1) 僅回傳「有效 JSON」，不得包含任何解說、前後綴、額外鍵，鍵名與結構必須「完全一致」。\n2) 分數採 0-100 整數，嚴格評分，避免寬鬆給分；如資訊不足應降低分數並在建議中點出不足。\n3) 文字一律使用繁體中文。\n\nJSON 結構（鍵名不可更動）：\n{\n  "scoreResult": {\n    "overallScore": number,\n    "categories": [\n      { "name": string, "score": number, "feedback": string, "strengths": string[], "weaknesses": string[], "suggestions": string[] }\n    ]\n  },\n  "issuesResult": [\n    { "text": string, "suggestion": string, "severity": "low"|"medium"|"high", "category": string, "reason": string, "improved_example": string }\n  ],\n  "rewriteResult": string,\n  "structureResult": [\n    { "title": string, "points": string[], "writing_tips": string, "common_mistakes": string, "word_count": string }\n  ]\n}\n\n評分標準與權重（總分 100）：\n- 邏輯結構 20\n- 動機明確度 15\n- 個人化程度 15\n- 語言表達 15\n- 內容深度 20\n- 具體性 15\n\n自我介紹內容：\\n${introText}`

    // 添加超時控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超時

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "你是嚴謹的面試官，回傳結構化 JSON，不要任何多餘文字。" },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 2000
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const err = await response.text()
        return NextResponse.json({ 
          success: false, 
          message: `OpenAI 失敗: ${response.status}`, 
          error: err 
        }, { status: 500 })
      }

      const data = await response.json()
      const content: string = data.choices?.[0]?.message?.content || ""

      const extractFirstJson = (text: string) => {
        try { return JSON.parse(text) } catch {
          const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
          if (!m) return null
          try { return JSON.parse(m[0]) } catch { return null }
        }
      }

      const parsed = extractFirstJson(content)
      if (!parsed) {
        return NextResponse.json({ success: false, message: "AI 回傳解析失敗" }, { status: 500 })
      }

      return NextResponse.json({ success: true, result: parsed })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ success: false, message: "OpenAI API 請求超時" }, { status: 500 })
      }
      throw fetchError
    }
  } catch (e: any) {
    console.error("自我介紹 AI 分析失敗:", e)
    return NextResponse.json({ success: false, message: e?.message || "分析失敗" }, { status: 500 })
  }
}
