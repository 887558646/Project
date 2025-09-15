import { NextRequest, NextResponse } from "next/server"
import { config } from 'dotenv'
import { resolve } from 'path'

// 在API路由中手動加載環境變量
config({ path: resolve(process.cwd(), '.env') })

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

    const prompt = `你是一位資深的資管系教授，請針對下方自我介紹內容提供重寫建議。

請提供一份更優化的自我介紹內容，要求：
1. 保持原文的核心內容和個人特色
2. 改善語言表達和邏輯結構
3. 增加具體性和說服力
4. 使用更專業和準確的詞彙
5. 保持適當的長度（200-400字）
6. 確保內容真實可信，避免誇大

請直接回傳重寫後的自我介紹內容，不要包含任何說明文字。

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
            content: "你是一位資深的資管系教授，專門審查學生自我介紹。請提供專業的重寫建議，確保內容真實可信。請直接回傳重寫內容，不要包含任何說明文字。" 
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
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

    return new NextResponse(JSON.stringify({
      success: true,
      result: { rewriteResult: content.trim() },
      message: "分析完成"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("自我介紹重寫分析失敗:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "分析失敗，請稍後重試"
    }, { status: 500 })
  }
}
