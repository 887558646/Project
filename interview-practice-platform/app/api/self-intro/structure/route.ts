import { NextRequest, NextResponse } from "next/server"
import { config } from 'dotenv'
import { resolve } from 'path'

// 在API路由中手動加載環境變量
config({ path: resolve(process.cwd(), '.env') })

function extractFirstJson(raw: string): any | null {
  try {
    return JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { introText, username } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!introText || !apiKey) {
      return NextResponse.json({ 
        success: false, 
        message: "缺少內容或API Key" 
      }, { status: 400 })
    }

    const prompt = `你是一位資深的資管系教授，請針對下方自我介紹內容提供結構建議。

請回傳一個JSON陣列，每個元素包含：
- title: 段落標題（繁體中文）
- points: 重點列表（陣列，繁體中文）
- writing_tips: 寫作建議（繁體中文）
- common_mistakes: 常見錯誤（繁體中文）
- word_count: 建議字數（如"80-100字"）

建議的段落結構：
1. 背景與動機：簡述興趣來源與選擇科系的理由
2. 核心經歷與成果：1-2個代表性經歷，包含量化成果
3. 未來規劃與呼應：短中期規劃，呼應學校/系所資源

請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字，否則會導致解析失敗。

自我介紹內容：
${introText}`

    // 添加超時控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60秒超時

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "你是一位資深的資管系教授，專門審查學生自我介紹。請以嚴格的標準進行分析，提供專業的結構建議。重要：所有內容都必須使用繁體中文，不要使用英文。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.1,
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error("Empty response from OpenAI")
    }

    console.log("OpenAI Response:", content)

    // 嘗試解析JSON
    let result = null
    try {
      result = JSON.parse(content)
    } catch {
      result = extractFirstJson(content)
    }

    if (!result) {
      throw new Error("Failed to parse JSON response")
    }

    return new NextResponse(JSON.stringify({
      success: true,
      result: { structureResult: result },
      message: "分析完成"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("自我介紹結構分析失敗:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "分析失敗，請稍後重試"
    }, { status: 500 })
  }
}
