import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { resume } = await req.json()
  if (!resume) {
    return NextResponse.json({ success: false, message: "缺少履歷內容" }, { status: 400 })
  }
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ success: false, message: "OpenAI API Key 未設置" }, { status: 500 })
  }
  const prompt = `你是一位嚴格且專業的履歷審查官，請針對下方自傳內容，回傳一個結構化JSON，內容必須包含：\n\n1. overallScore: 整體評分（0-100，嚴格標準）\n2. categories: 各面向分數與建議，格式為陣列，每個元素包含 name（面向名稱）、score（0-100）、feedback（具體建議）\n   - 面向包括：邏輯結構、動機明確度、個人化程度、語言表達\n3. issues: 原文標註，格式為陣列，每個元素包含 text（有問題的原句）、suggestion（改進建議）、severity（high/medium/low）\n4. rewrite: AI重寫建議，請根據原文給出一份更優化的履歷內容，務必真實、具體、嚴謹\n5. structure: 段落結構建議，條列出建議的履歷段落順序與每段重點\n\n請直接回傳JSON，內容如下：\n自傳內容：\n${resume}`
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
          { role: "system", content: "你是一位嚴格且專業的履歷審查官。" },
          { role: "user", content: prompt },
        ],
        max_tokens: 1200,
        temperature: 0.5,
      }),
    })
    const data = await response.json()
    let aiResult = null
    try {
      aiResult = JSON.parse(data.choices?.[0]?.message?.content || "")
    } catch {
      return NextResponse.json({ success: false, message: "AI 回傳格式錯誤，請重試。", raw: data.choices?.[0]?.message?.content })
    }
    return NextResponse.json({ success: true, aiResult })
  } catch (e) {
    return NextResponse.json({ success: false, message: "OpenAI API 請求失敗" }, { status: 500 })
  }
} 