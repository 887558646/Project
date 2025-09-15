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
    const { introText, username } = await req.json()
    if (!introText) {
      return NextResponse.json({ success: false, message: "缺少自我介紹內容" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    // 無 Key：回退本地分析，回 200
    if (!apiKey) {
      const result = localFallbackAnalysis(introText)
      return NextResponse.json({ success: true, result, fallback: true })
    }

    const prompt = `你是一位資深的資管系教授，專門審查學生自我介紹。請以嚴格的標準進行評分，不要給出過高的分數。

請回傳一個JSON，格式如下：

{
  "scoreResult": {
    "overallScore": 75,
    "categories": [
      {
        "name": "邏輯結構",
        "score": 80,
        "feedback": "段落安排基本合理，但邏輯連接可以更清晰...",
        "strengths": ["結構基本清楚", "段落分明"],
        "weaknesses": ["邏輯過渡不夠自然", "缺乏總結"],
        "suggestions": ["加強段落間的連接詞", "添加總結段落"]
      }
    ]
  },
  "issuesResult": [
    {
      "text": "有問題的句子",
      "suggestion": "具體改進建議...",
      "severity": "medium",
      "category": "vague",
      "reason": "問題原因說明",
      "improved_example": "改進後的句子範例"
    }
  ],
  "rewriteResult": "重寫後的完整自我介紹內容...",
  "structureResult": [
    {
      "title": "段落標題",
      "points": ["重點1", "重點2"],
      "writing_tips": "寫作建議",
      "common_mistakes": "常見錯誤",
      "word_count": "建議字數"
    }
  ]
}

評分面向包括：
- 邏輯結構（段落安排、內容組織、邏輯流暢度）
- 動機明確度（選擇科系的理由、未來規劃的清晰度）
- 個人化程度（獨特性、個人特色、真實性）
- 語言表達（用詞準確性、語句通順度、專業度）
- 內容深度（分析深度、思考深度、專業知識）
- 具體性（具體例子、數據、成果）

評分標準（請嚴格按照以下標準評分，不要給出過高分數）：
- 95-100分：卓越，內容極其完整、邏輯極其清晰、表達極其專業、有獨特見解
- 90-94分：優秀，內容完整、邏輯清晰、表達專業、有個人特色
- 85-89分：良好，內容較完整、邏輯較清晰、表達較專業
- 80-84分：中等偏上，內容基本完整、邏輯基本清晰、表達基本專業
- 75-79分：中等，內容基本符合要求、邏輯基本清晰
- 70-74分：中等偏下，內容基本符合要求但有所不足
- 65-69分：及格，內容勉強符合要求
- 60-64分：及格邊緣，內容有明顯不足
- 60分以下：不及格，內容不符合基本要求

請注意：
1. 大部分學生應該落在70-85分區間
2. 90分以上應該非常罕見，只有真正優秀的內容才能獲得
3. 如果內容有明顯問題（如邏輯混亂、表達不清、內容空洞），請給出相應的低分
4. 每個面向的評分都要有充分的理由和具體的改進建議

請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字，否則會導致解析失敗。

自我介紹內容：
${introText}`

    // 添加超時控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60秒超時

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

      console.log("OpenAI 原始響應長度:", content.length)
      console.log("OpenAI 原始響應前500字符:", content.substring(0, 500))
      
      const parsed = extractFirstJson(content)
      console.log("解析後的結果類型:", typeof parsed)
      console.log("解析後的結果:", JSON.stringify(parsed, null, 2))
      
      if (!parsed) {
        console.error("JSON 解析失敗，原始內容:", content)
        return NextResponse.json({ success: false, message: "AI 回傳解析失敗" }, { status: 500 })
      }

      // 檢查必要的字段，如果沒有scoreResult則使用fallback
      if (!parsed.scoreResult) {
        console.error("缺少 scoreResult 字段，使用本地fallback分析")
        const fallbackResult = localFallbackAnalysis(introText)
        return NextResponse.json({ success: true, result: fallbackResult, fallback: true })
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
