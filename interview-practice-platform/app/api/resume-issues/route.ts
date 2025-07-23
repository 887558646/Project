import { NextRequest, NextResponse } from "next/server"

function extractFirstJson(raw: string): any | null {
  const objMatch = raw.match(/{[\s\S]*}/)
  const arrMatch = raw.match(/\[[\s\S]*\]/)
  let jsonStr = ""
  if (arrMatch) {
    jsonStr = arrMatch[0]
  } else if (objMatch) {
    jsonStr = objMatch[0]
  }
  if (jsonStr) {
    try { return JSON.parse(jsonStr) } catch { return null }
  }
  return null
}

export async function POST(req: NextRequest) {
  const { resume } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!resume || !apiKey) return NextResponse.json({ success: false, message: "缺少內容或API Key" }, { status: 400 })
  const prompt = `你是一位嚴格的履歷審查官，請針對下方自傳內容，回傳一個JSON陣列，每個元素包含：text（有問題的原句）、suggestion（具體改進建議）、severity（high/medium/low，請嚴格評分）。請務必找出所有空泛、誇大、模糊或不合邏輯的句子。請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字，否則會導致解析失敗。\n自傳內容：\n${resume}`
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
          { role: "system", content: "你是一位嚴格的履歷審查官。" },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.5,
      }),
    })
    const data = await response.json()
    let result = null
    try { result = JSON.parse(data.choices?.[0]?.message?.content || "") } catch {
      result = extractFirstJson(data.choices?.[0]?.message?.content || "")
    }
    return NextResponse.json({ success: !!result, result, raw: data.choices?.[0]?.message?.content })
  } catch {
    return NextResponse.json({ success: false, message: "OpenAI API 請求失敗" }, { status: 500 })
  }
} 