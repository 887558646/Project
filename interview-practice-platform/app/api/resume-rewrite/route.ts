import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { resume } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!resume || !apiKey) return NextResponse.json({ success: false, message: "缺少內容或API Key" }, { status: 400 })

  const prompt = `你是一位資深的資管系教授，請針對下方自傳內容提供專業的改進建議。

要求：
1. **保持真實性**：不要誇大或虛構，保持內容的真實可信
2. **增加具體性**：用具體的例子、數據、成果來支持論點
3. **強化邏輯性**：改善段落間的邏輯連接和整體結構
4. **提升專業度**：使用更專業的詞彙和表達方式
5. **突出個人特色**：展現獨特的個人經歷和思考
6. **明確動機**：清楚說明選擇資管系的原因和未來規劃
7. **改善表達**：使用更生動、準確的語言表達

改進重點：
- 將空泛的表達改為具體的描述
- 將模糊的動機改為明確的理由
- 將誇大的描述改為客觀的陳述
- 增加相關的學習經歷和成果
- 強化對資管領域的理解和興趣
- 改善整體的邏輯結構和流暢度

請直接回傳改進後的完整內容，不要添加任何說明或標題。內容應該保持適當的長度（約800-1200字），結構清晰，表達專業。

原始內容：
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
            content: "你是一位資深的資管系教授，專門指導學生撰寫自傳。請提供專業、真實、具體的改進建議。請直接回傳改進後的內容，不要添加任何說明文字。" 
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || ""
    
    if (!result) {
      throw new Error("Empty response from OpenAI")
    }

    console.log("OpenAI Rewrite Response:", result) // 調試用

    return NextResponse.json({ 
      success: true, 
      result,
      message: "重寫建議完成"
    })
  } catch (error) {
    console.error("重寫建議失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "重寫建議失敗，請稍後重試" 
    }, { status: 500 })
  }
} 