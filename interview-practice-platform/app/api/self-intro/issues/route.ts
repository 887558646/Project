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

    const prompt = `你是一位資深的資管系教授，請針對下方自我介紹內容進行詳細的問題標註。

請回傳一個JSON陣列，每個元素包含：

- text: 有問題的原句（請精確標註）
- suggestion: 具體改進建議（至少50字）
- severity: 嚴重程度（high/medium/low）
- category: 問題類型（vague/empty/exaggerated/generic/logic/grammar/format）
- reason: 問題原因說明
- improved_example: 改進後的句子範例

問題類型說明：
- vague: 模糊不清、缺乏具體性
- empty: 空泛、缺乏實質內容
- exaggerated: 誇大、不真實
- generic: 通用、缺乏個人特色
- logic: 邏輯問題、前後矛盾
- grammar: 語法錯誤、表達不當
- format: 格式問題、結構不當

請務必找出所有問題，包括：
1. 空泛的表達（如"我很努力"、"我有興趣"）
2. 誇大的描述（如"非常優秀"、"極其重要"）
3. 模糊的動機（如"因為喜歡"、"覺得有趣"）
4. 缺乏具體例子
5. 邏輯不清晰
6. 語法錯誤
7. 格式問題

如果沒有發現明顯問題，請回傳空陣列 []。

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
            content: "你是一位資深的資管系教授，專門審查學生自我介紹。請以嚴格的標準進行分析，不要給出過高的分數。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
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
      result: { issuesResult: result },
      message: "分析完成"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("自我介紹問題標註分析失敗:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "分析失敗，請稍後重試"
    }, { status: 500 })
  }
}
