import { NextRequest, NextResponse } from "next/server"
import { config } from 'dotenv'
import { resolve } from 'path'

// 在API路由中手動加載環境變量
config({ path: resolve(process.cwd(), '.env') })

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
      // 最後嘗試：返回基本結構建議
      return [
        {
          section: "引言段落",
          purpose: "介紹個人背景和選擇資管系的契機",
          key_points: ["個人背景", "選擇動機", "對資管的理解"],
          writing_tips: "開頭要吸引人，簡潔明瞭地說明選擇資管系的原因",
          common_mistakes: "開頭過於冗長或缺乏重點",
          word_count: "150-200字"
        },
        {
          section: "學習經歷段落",
          purpose: "展示相關的學習經驗和專業能力",
          key_points: ["相關課程", "專案經驗", "競賽成果"],
          writing_tips: "重點突出與資管相關的學習經歷",
          common_mistakes: "列舉過多無關課程",
          word_count: "200-250字"
        },
        {
          section: "個人特質段落",
          purpose: "展現個人能力和特色",
          key_points: ["個人能力", "興趣愛好", "價值觀"],
          writing_tips: "結合具體例子說明個人特質",
          common_mistakes: "空泛描述，缺乏實例",
          word_count: "150-200字"
        },
        {
          section: "未來規劃段落",
          purpose: "說明短期和長期目標",
          key_points: ["短期目標", "長期規劃", "具體行動"],
          writing_tips: "目標要具體可行，展現規劃能力",
          common_mistakes: "目標過於宏大或不切實際",
          word_count: "150-200字"
        },
        {
          section: "結語段落",
          purpose: "總結並表達對資管系的期待",
          key_points: ["總結重點", "表達期待", "展現決心"],
          writing_tips: "簡潔有力，留下深刻印象",
          common_mistakes: "結尾過於冗長或缺乏重點",
          word_count: "100-150字"
        }
      ]
    }
  }
  
  return null
}

export async function POST(req: NextRequest) {
  const { resume, resumeText } = await req.json()
  const content = resume || resumeText
  const apiKey = process.env.OPENAI_API_KEY
  if (!content || !apiKey) return NextResponse.json({ success: false, message: "缺少內容或API Key" }, { status: 400 })

  const prompt = `你是一位資深的資管系教授，請針對下方自傳內容提供專業的段落結構建議。

請回傳一個JSON陣列，每個元素包含：

- section: 段落名稱（中文）
- purpose: 該段落的目的和作用（中文）
- key_points: 該段落應包含的重點內容（陣列，中文）
- writing_tips: 撰寫該段落的技巧和注意事項（中文）
- common_mistakes: 該段落常見的錯誤（中文）
- word_count: 建議字數範圍（中文，例如"100-150字"）

建議的段落結構：
1. 引言段落：個人背景、選擇資管系的契機
2. 學習經歷段落：相關課程、專案、競賽經驗
3. 個人特質段落：能力、興趣、價值觀
4. 未來規劃段落：短期目標、長期規劃
5. 結語段落：總結、對資管系的期待

重要：所有內容都必須使用繁體中文，不要使用英文。請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字，否則會導致解析失敗。

自傳內容：
${content}`

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
            content: "你是一位資深的資管系教授，專門指導學生撰寫自傳。請提供專業、實用的段落結構建議。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1200,
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

    console.log("OpenAI Structure Response:", content) // 調試用

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
          section: "引言段落",
          purpose: "介紹個人背景和選擇資管系的契機",
          key_points: ["個人背景", "選擇動機", "對資管的理解"],
          writing_tips: "開頭要吸引人，簡潔明瞭地說明選擇資管系的原因",
          common_mistakes: "開頭過於冗長或缺乏重點",
          word_count: "150-200字"
        },
        {
          section: "學習經歷段落",
          purpose: "展示相關的學習經驗和專業能力",
          key_points: ["相關課程", "專案經驗", "競賽成果"],
          writing_tips: "重點突出與資管相關的學習經歷",
          common_mistakes: "列舉過多無關課程",
          word_count: "200-250字"
        },
        {
          section: "個人特質段落",
          purpose: "展現個人能力和特色",
          key_points: ["個人能力", "興趣愛好", "價值觀"],
          writing_tips: "結合具體例子說明個人特質",
          common_mistakes: "空泛描述，缺乏實例",
          word_count: "150-200字"
        },
        {
          section: "未來規劃段落",
          purpose: "說明短期和長期目標",
          key_points: ["短期目標", "長期規劃", "具體行動"],
          writing_tips: "目標要具體可行，展現規劃能力",
          common_mistakes: "目標過於宏大或不切實際",
          word_count: "150-200字"
        },
        {
          section: "結語段落",
          purpose: "總結並表達對資管系的期待",
          key_points: ["總結重點", "表達期待", "展現決心"],
          writing_tips: "簡潔有力，留下深刻印象",
          common_mistakes: "結尾過於冗長或缺乏重點",
          word_count: "100-150字"
        }
      ]
    }

    return new NextResponse(JSON.stringify({ 
      success: true, 
      result, 
      message: "結構建議完成"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("結構建議失敗:", error)
    return NextResponse.json({ 
      success: false, 
      message: "結構建議失敗，請稍後重試" 
    }, { status: 500 })
  }
} 