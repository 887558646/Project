import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "../../../../lib/generated/prisma"

const prisma = new PrismaClient()

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
      // 最後嘗試：返回基本個性化問題結構
      return [
        {
          question: "請詳細說明您選擇資管系的具體原因和動機？",
          hint: "建議包含：個人興趣、未來規劃、對資管領域的理解",
          category: "personal",
          reason: "基於履歷分析，需要更深入了解您的選擇動機"
        },
        {
          question: "您認為自己在資管領域有哪些優勢和需要改進的地方？",
          hint: "建議包含：個人優勢、學習經歷、改進計劃",
          category: "academic",
          reason: "根據履歷分析結果，評估個人能力發展"
        },
        {
          question: "請分享一次您使用資訊科技解決問題的具體經驗？",
          hint: "建議包含：問題背景、解決方案、學習收穫",
          category: "technical",
          reason: "基於履歷內容，深入探討技術應用能力"
        },
        {
          question: "您對企業管理中的資訊系統有什麼了解？",
          hint: "建議包含：系統概念、應用場景、個人見解",
          category: "technical",
          reason: "測試對資管核心領域的理解深度"
        },
        {
          question: "您如何規劃大學四年的學習目標和未來發展？",
          hint: "建議包含：短期目標、長期規劃、具體行動",
          category: "career",
          reason: "基於履歷分析，評估規劃能力和目標明確度"
        }
      ]
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
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
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
              content: "你是一位資深的資管系教授，專門設計面試問題。請根據學生的履歷分析結果，生成5個個性化的面試問題。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log("OpenAI Generate Questions Response:", data.choices[0].message.content)
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        const result = extractFirstJson(content)
        
        if (result) {
          return result
        }
      }
      
      throw new Error("無法解析OpenAI回應")
      
    } catch (error) {
      console.error(`嘗試 ${attempt}/${maxRetries} 失敗:`, error)
      
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
    const { resumeText, analysisResults, username } = await req.json()
    
    if (!resumeText || !analysisResults || !username) {
      return NextResponse.json({ success: false, message: "缺少履歷內容、分析結果或用戶名" }, { status: 400 })
    }

    // 檢查是否已有保存的個性化問題
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        resumeAnalyses: {
          include: {
            personalizedQuestions: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    // 如果已有個性化問題，直接返回
    if (user && user.resumeAnalyses?.[0]?.personalizedQuestions?.length > 0) {
      console.log("找到已保存的個性化問題，直接返回")
      const resumeAnalysis = user.resumeAnalyses[0]
      if (resumeAnalysis) {
        const savedQuestions = resumeAnalysis.personalizedQuestions.map(q => ({
          question: q.question,
          hint: q.hint,
          category: q.category,
          reason: q.reason
        }))
        
        return NextResponse.json({ 
          success: true, 
          result: savedQuestions,
          message: "使用已保存的個性化問題"
        })
      }
    }

    // 截斷履歷文本，避免token超限
    const truncatedResume = resumeText.length > 2000 ? resumeText.substring(0, 2000) + "..." : resumeText
    
    // 簡化分析結果，只保留關鍵信息
    const simplifiedAnalysis = {
      overallScore: analysisResults.scoreResult?.overallScore || 60,
      mainIssues: analysisResults.issuesResult?.slice(0, 3) || [], // 只取前3個問題
      keyStrengths: analysisResults.scoreResult?.categories?.slice(0, 3) || [] // 只取前3個類別
    }

    const prompt = `你是一位資深的資管系教授，請根據學生的履歷內容生成5個個性化的面試問題。

請回傳一個JSON陣列，每個元素包含：
- question: 問題內容
- hint: 回答提示
- category: 問題類型（personal/academic/technical/career）
- reason: 為什麼問這個問題

問題設計原則：
1. 針對履歷中的弱點和需要改進的地方
2. 深入探討履歷中提到的經歷和興趣
3. 測試對資管領域的理解和動機
4. 評估邏輯思維和表達能力
5. 驗證履歷內容的真實性和深度

請你只回傳純JSON，前後不要有任何說明、標題、註解或多餘文字。

履歷內容：
${truncatedResume}

分析結果：
${JSON.stringify(simplifiedAnalysis, null, 2)}`

    const result = await callOpenAIWithRetry(prompt)
    
    // 確保返回的是數組格式
    let questionsArray = result
    if (!Array.isArray(result)) {
      // 如果是單個問題對象，轉換為數組
      if (result && typeof result === 'object' && result.question) {
        questionsArray = [result]
      } else {
        // 如果解析失敗，使用備用問題
        questionsArray = getFallbackQuestions()
      }
    }

    // 保存個性化問題到數據庫
    if (user?.resumeAnalyses?.[0]) {
      const resumeAnalysisId = user.resumeAnalyses[0].id
      
      // 刪除舊的個性化問題（如果存在）
      await prisma.personalizedQuestion.deleteMany({
        where: { resumeAnalysisId }
      })
      
      // 保存新的個性化問題
      for (const question of questionsArray) {
        await prisma.personalizedQuestion.create({
          data: {
            resumeAnalysisId,
            question: question.question,
            hint: question.hint,
            category: question.category,
            reason: question.reason
          }
        })
      }
      
      console.log(`成功保存 ${questionsArray.length} 個個性化問題到數據庫`)
    }
    
    return NextResponse.json({ 
      success: true, 
      result: questionsArray,
      message: "個性化問題生成完成並已保存"
    })
  } catch (error) {
    console.error("生成個性化問題失敗:", error)
    
    return NextResponse.json({ 
      success: true, 
      result: getFallbackQuestions(),
      message: "使用備用個性化問題"
    })
  }
}

// 提取備用問題為獨立函數
function getFallbackQuestions() {
  return [
    {
      question: "請詳細說明您選擇資管系的具體原因和動機？",
      hint: "建議包含：個人興趣、未來規劃、對資管領域的理解",
      category: "personal",
      reason: "基於履歷分析，需要更深入了解您的選擇動機"
    },
    {
      question: "您認為自己在資管領域有哪些優勢和需要改進的地方？",
      hint: "建議包含：個人優勢、學習經歷、改進計劃",
      category: "academic",
      reason: "根據履歷分析結果，評估個人能力發展"
    },
    {
      question: "請分享一次您使用資訊科技解決問題的具體經驗？",
      hint: "建議包含：問題背景、解決方案、學習收穫",
      category: "technical",
      reason: "基於履歷內容，深入探討技術應用能力"
    },
    {
      question: "您對企業管理中的資訊系統有什麼了解？",
      hint: "建議包含：系統概念、應用場景、個人見解",
      category: "technical",
      reason: "測試對資管核心領域的理解深度"
    },
    {
      question: "您如何規劃大學四年的學習目標和未來發展？",
      hint: "建議包含：短期目標、長期規劃、具體行動",
      category: "career",
      reason: "基於履歷分析，評估規劃能力和目標明確度"
    }
  ]
} 