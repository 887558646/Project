import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { resume } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!resume || !apiKey) return NextResponse.json({ success: false, message: "缺少內容或API Key" }, { status: 400 })
  const prompt = `你是一位嚴格的履歷審查官，請根據下方自傳內容，給出一份更優化、更具體、更真實的完整履歷內容，語氣務必嚴謹、專業，避免空泛與誇大。請你只回傳優化後的履歷全文，前後不要有任何說明、標題、註解或多餘文字。\n自傳內容：\n${resume}`
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
        max_tokens: 1000,
        temperature: 0.5,
      }),
    })
    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || ""
    return NextResponse.json({ success: !!result, result, raw: result })
  } catch {
    return NextResponse.json({ success: false, message: "OpenAI API 請求失敗" }, { status: 500 })
  }
} 