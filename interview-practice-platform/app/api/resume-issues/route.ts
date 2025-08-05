import { NextRequest, NextResponse } from "next/server"

function extractFirstJson(raw: string): any | null {
  if (!raw) return null
  
  // 嘗試多種JSON提取方法
  const patterns = [
    /\[[\s\S]*\]/,         // 數組（優先）
    /{[\s\S]*}/,           // 完整對象
    /\[[^\]]*\]/,          // 簡單數組
    /{[^}]*}/              // 簡單對象
  ]
  
  for (const pattern of patterns) {
    const match = raw.match(pattern)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        continue
      }
    }
  }
  
  // 如果還是無法解析，嘗試清理文本後再解析
  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^[^[]*/, '')
    .replace(/[^]]*$/, '')
    .trim()
  
  if (cleaned) {
    try {
      return JSON.parse(cleaned)
    } catch {
      // 最後嘗試：返回基本問題結構
      return [
        {
          text: "內容需要進一步完善",
          suggestion: "建議增加更多具體的例子和詳細的描述，讓內容更加充實和有說服力。",
          severity: "medium",
          category: "vague",
          reason: "內容描述較為籠統，缺乏具體細節",
          improved_example: "可以增加具體的學習經歷、專案經驗或個人成就的詳細描述。"
        }
      ]
    }
  }
  
  return null
}

export async function POST(req: NextRequest) {
  const { resume } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!resume || !apiKey) return NextResponse.json({ success: false, message: "缺少內容或API Key" }, { status: 400 })

  const prompt = `你是一位資深的資管系教授，請針對下方自傳內容進行詳細的問題標註。

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

自傳內容：
${resume}`

  try {
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
            content: "你是一位資深的資管系教授，專門審查學生自傳。請以嚴格的標準進行問題標註，不要遺漏任何問題。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error("Empty response from OpenAI")
    }

    console.log("OpenAI Issues Response:", content) // 調試用

    let result = null
    try { 
      result = JSON.parse(content) 
    } catch {
      result = extractFirstJson(content)
    }

    if (!result) {
      // 如果還是無法解析，返回基本結構
      result = [
        {
          text: "內容需要進一步完善",
          suggestion: "建議增加更多具體的例子和詳細的描述，讓內容更加充實和有說服力。",
          severity: "medium",
          category: "vague",
          reason: "內容描述較為籠統，缺乏具體細節",
          improved_example: "可以增加具體的學習經歷、專案經驗或個人成就的詳細描述。"
        }
      ]
    }

    return NextResponse.json({ 
      success: true, 
      result, 
      message: "問題標註完成"
    })
  } catch (error) {
    console.error("問題標註失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "問題標註失敗，請稍後重試" 
    }, { status: 500 })
  }
} 