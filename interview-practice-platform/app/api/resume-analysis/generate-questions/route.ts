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
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
      
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
              content: "你是一位資深的資管系教授，專門設計高度個性化的面試問題。你的任務是根據學生的履歷內容生成恰好5個非常具體的問題，每個問題都必須直接引用履歷中的具體內容。請仔細分析履歷中的每個段落，找出至少5個可以深入探討的具體內容，並針對每個內容設計一個問題。請務必回傳有效的JSON格式，不要包含任何說明文字。" 
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
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

    // 檢查是否已有保存的個性化問題，並比較履歷內容
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

    // 檢查履歷內容是否發生變化
    let shouldRegenerate = true
    if (user && user.resumeAnalyses?.[0]?.personalizedQuestions?.length > 0) {
      const latestResumeAnalysis = user.resumeAnalyses[0]
      
      // 比較履歷內容是否相同（使用簡單的字符串比較）
      if (latestResumeAnalysis.originalText === resumeText) {
        console.log("履歷內容未變化，使用已保存的個性化問題")
        shouldRegenerate = false
        
        const savedQuestions = latestResumeAnalysis.personalizedQuestions.map(q => ({
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
      } else {
        console.log("履歷內容已變化，需要重新生成個性化問題")
        shouldRegenerate = true
      }
    }

    // 截斷履歷文本，避免token超限
    const truncatedResume = resumeText.length > 2000 ? resumeText.substring(0, 2000) + "..." : resumeText
    
    // 簡化分析結果，只保留關鍵信息
    const simplifiedAnalysis = {
      overallScore: analysisResults.scoreResult?.overallScore || 60,
      mainIssues: Array.isArray(analysisResults.issuesResult) ? analysisResults.issuesResult.slice(0, 3) : [], // 只取前3個問題
      keyStrengths: Array.isArray(analysisResults.scoreResult?.categories) ? analysisResults.scoreResult.categories.slice(0, 3) : [] // 只取前3個類別
    }

                           const prompt = `你是一位資深的資管系教授，專門設計高度個性化的面試問題。請根據學生的履歷內容生成恰好5個非常具體的面試問題。

 重要：必須生成恰好5個問題，不能多也不能少。每個問題都必須基於履歷中的具體內容。

 請回傳一個JSON陣列，每個元素包含：
  - question: 問題內容（必須直接引用履歷中的具體內容）
  - hint: 回答提示
  - category: 問題類型（personal/academic/technical/career）
  - reason: 為什麼問這個問題（必須基於履歷中的具體內容）

 問題設計要求：
 1. 每個問題必須直接引用履歷中的具體句子、經歷、興趣或特點
 2. 針對履歷分析中發現的具體弱點和需要改進的地方
 3. 深入探討履歷中提到的具體經歷、專案、興趣或成就
 4. 測試對資管領域的理解深度和動機的真實性
 5. 驗證履歷內容的邏輯性和一致性

 問題設計原則：
  - 不要問通用問題，必須基於履歷中的具體內容
  - 如果履歷提到特定經歷，要針對該經歷提問
  - 如果履歷提到特定興趣，要針對該興趣提問
  - 如果履歷提到特定成就，要針對該成就提問
  - 如果履歷有邏輯問題，要針對該問題提問
  - 如果履歷提到特定學校、課程、活動，要針對這些提問
  - 如果履歷提到特定技能、證照、比賽，要針對這些提問

 問題範例格式：
  - "您在履歷中提到[具體句子或內容]，請詳細說明這個經歷..."
  - "根據您的[具體經歷描述]，您認為..."
  - "您提到對[具體領域]感興趣，請分享您對這個領域的具體了解..."
  - "您在履歷中寫道[具體內容]，這與資管系的關聯是什麼？"
  - "您提到[具體學校/課程/活動]，請分享這段經歷對您的影響..."
  - "您在[具體比賽/活動]中獲得[具體成就]，請詳細說明..."

 請仔細分析履歷中的每個段落，找出至少5個可以深入探討的具體內容，並針對每個內容設計一個問題。

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
    
    // 確保至少有5個問題
    if (questionsArray.length < 5) {
      console.log(`只生成了 ${questionsArray.length} 個問題，補充到5個`)
      const fallbackQuestions = getFallbackQuestions()
      const neededCount = 5 - questionsArray.length
      const additionalQuestions = fallbackQuestions.slice(0, neededCount)
      questionsArray = [...questionsArray, ...additionalQuestions]
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