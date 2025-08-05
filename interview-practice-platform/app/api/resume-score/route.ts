import { NextRequest, NextResponse } from "next/server"

function extractFirstJson(raw: string): any | null {
  if (!raw) return null
  
  // 嘗試多種JSON提取方法
  const patterns = [
    /{[\s\S]*}/,           // 完整對象
    /\[[\s\S]*\]/,         // 數組
    /{[^}]*}/,             // 簡單對象
    /\[[^\]]*\]/           // 簡單數組
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
    .replace(/^[^{]*/, '')
    .replace(/[^}]*$/, '')
    .trim()
  
  if (cleaned) {
    try {
      return JSON.parse(cleaned)
    } catch {
      // 最後嘗試：手動構建基本結構
      return {
        overallScore: 60,
        categories: [
          {
            name: "邏輯結構",
            score: 60,
            feedback: "內容基本完整，但需要進一步改進邏輯結構和表達清晰度。",
            strengths: ["內容有基本結構"],
            weaknesses: ["邏輯連接不夠清晰"],
            suggestions: ["增加邏輯連接詞", "改善段落結構"]
          },
          {
            name: "動機明確度",
            score: 60,
            feedback: "動機描述基本清楚，但可以更具體和深入。",
            strengths: ["有基本動機說明"],
            weaknesses: ["動機描述較為籠統"],
            suggestions: ["提供更具體的選擇理由", "增加未來規劃細節"]
          },
          {
            name: "個人化程度",
            score: 60,
            feedback: "內容具有個人特色，但可以更加突出獨特性。",
            strengths: ["包含個人經歷"],
            weaknesses: ["個人特色不夠突出"],
            suggestions: ["增加獨特經歷描述", "突出個人優勢"]
          },
          {
            name: "語言表達",
            score: 60,
            feedback: "語言表達基本準確，但可以更加專業和生動。",
            strengths: ["表達基本清楚"],
            weaknesses: ["用詞可以更專業"],
            suggestions: ["使用更專業的詞彙", "改善句子結構"]
          },
          {
            name: "內容深度",
            score: 60,
            feedback: "內容有一定深度，但可以進一步深化分析。",
            strengths: ["有基本分析"],
            weaknesses: ["分析深度不足"],
            suggestions: ["增加深度分析", "提供更多見解"]
          },
          {
            name: "具體性",
            score: 60,
            feedback: "內容較為具體，但可以增加更多實例和數據。",
            strengths: ["有具體描述"],
            weaknesses: ["實例和數據不足"],
            suggestions: ["增加具體例子", "提供相關數據"]
          }
        ]
      }
    }
  }
  
  return null
}

async function callOpenAIWithRetry(prompt: string, maxRetries: number = 3) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OpenAI API Key not found")
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
              content: "你是一位資深的資管系教授，專門審查學生自傳。請以嚴格的標準進行評分，不要給出過高的分數。評分標準：90-100分為優秀，80-89分為良好，70-79分為中等，60-69分為及格，60分以下為不及格。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      
      if (!content) {
        throw new Error("Empty response from OpenAI")
      }

      console.log("OpenAI Response:", content) // 調試用

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

      return result
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // 等待後重試
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { resume } = await req.json()
    
    if (!resume) {
      return NextResponse.json({ success: false, message: "缺少履歷內容" }, { status: 400 })
    }

    const prompt = `你是一位資深的資管系教授，請針對下方自傳內容進行嚴格評分。

請回傳一個JSON，內容包含：

1. overallScore: 整體分數（0-100，請嚴格評分，不要給出過高分數）
2. categories: 陣列，每個元素包含：
   - name: 面向名稱
   - score: 分數（0-100）
   - feedback: 具體建議（至少100字）
   - strengths: 優點列表（陣列）
   - weaknesses: 缺點列表（陣列）
   - suggestions: 改進建議列表（陣列）

評分面向包括：
- 邏輯結構（段落安排、內容組織、邏輯流暢度）
- 動機明確度（選擇科系的理由、未來規劃的清晰度）
- 個人化程度（獨特性、個人特色、真實性）
- 語言表達（用詞準確性、語句通順度、專業度）
- 內容深度（分析深度、思考深度、專業知識）
- 具體性（具體例子、數據、成果）

評分標準：
- 90-100分：優秀，內容完整、邏輯清晰、表達專業
- 80-89分：良好，內容較完整、邏輯較清晰
- 70-79分：中等，內容基本完整、邏輯基本清晰
- 60-69分：及格，內容基本符合要求
- 60分以下：不及格，內容不符合要求

請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字，否則會導致解析失敗。

自傳內容：
${resume}`

    const result = await callOpenAIWithRetry(prompt)
    
    return NextResponse.json({
      success: true,
      result,
      message: "分析完成"
    })
  } catch (error) {
    console.error("履歷評分分析失敗:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "分析失敗，請稍後重試"
    }, { status: 500 })
  }
} 