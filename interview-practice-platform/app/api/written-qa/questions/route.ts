import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../lib/generated/prisma";

const prisma = new PrismaClient();

// 資管系20題題庫
const imQuestions = [
  {
    id: 1,
    question: "請描述您對資訊管理的理解，以及為什麼選擇資管系？",
    hint: "建議包含：對資管的認知、選擇動機、未來規劃",
    category: "academic"
  },
  {
    id: 2,
    question: "您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。",
    hint: "建議包含：技術能力、管理能力、溝通能力、具體經驗",
    category: "academic"
  },
  {
    id: 3,
    question: "請分享一次您使用資訊科技解決問題的經驗。",
    hint: "建議包含：問題背景、解決方案、使用工具、結果和學習",
    category: "technical"
  },
  {
    id: 4,
    question: "您對大數據分析有什麼了解？請舉例說明其應用。",
    hint: "建議包含：大數據概念、應用領域、個人見解",
    category: "technical"
  },
  {
    id: 5,
    question: "請描述您對企業資源規劃(ERP)系統的理解。",
    hint: "建議包含：ERP概念、功能模組、企業應用價值",
    category: "technical"
  },
  {
    id: 6,
    question: "您如何看待人工智慧在企業管理中的應用？",
    hint: "建議包含：AI應用場景、優缺點分析、未來發展",
    category: "technical"
  },
  {
    id: 7,
    question: "請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。",
    hint: "建議包含：專案背景、團隊分工、個人貢獻、學習收穫",
    category: "personal"
  },
  {
    id: 8,
    question: "您認為資管系畢業生在職場上最大的優勢是什麼？",
    hint: "建議包含：跨領域能力、技術與管理結合、具體優勢",
    category: "career"
  },
  {
    id: 9,
    question: "請描述您對電子商務的理解，以及您認為未來發展趨勢如何？",
    hint: "建議包含：電商概念、發展歷程、未來趨勢、個人見解",
    category: "technical"
  },
  {
    id: 10,
    question: "您如何平衡技術學習與管理知識的學習？",
    hint: "建議包含：學習方法、時間分配、具體策略",
    category: "academic"
  },
  {
    id: 11,
    question: "請分享一次您面臨困難時的解決過程，以及從中學到了什麼？",
    hint: "建議包含：困難背景、解決步驟、反思學習",
    category: "personal"
  },
  {
    id: 12,
    question: "您對資訊安全有什麼了解？請舉例說明其重要性。",
    hint: "建議包含：資安概念、威脅類型、防護措施、重要性",
    category: "technical"
  },
  {
    id: 13,
    question: "請描述您對雲端運算的理解，以及其對企業的影響。",
    hint: "建議包含：雲端概念、服務模式、企業影響、個人見解",
    category: "technical"
  },
  {
    id: 14,
    question: "您認為資管系學生應該如何培養創新思維？",
    hint: "建議包含：創新重要性、培養方法、具體實踐",
    category: "academic"
  },
  {
    id: 15,
    question: "請分享一個您引以為傲的成就，並說明它對您的意義。",
    hint: "建議包含：成就背景、過程、影響、個人成長",
    category: "personal"
  },
  {
    id: 16,
    question: "您對資料庫管理有什麼了解？請舉例說明其應用。",
    hint: "建議包含：資料庫概念、管理系統、應用場景、重要性",
    category: "technical"
  },
  {
    id: 17,
    question: "請描述您對供應鏈管理的理解，以及資訊科技在其中扮演的角色。",
    hint: "建議包含：供應鏈概念、IT應用、管理價值",
    category: "technical"
  },
  {
    id: 18,
    question: "您如何規劃大學四年的學習目標？",
    hint: "建議包含：短期目標、長期規劃、具體行動、檢視調整",
    category: "academic"
  },
  {
    id: 19,
    question: "請分享您對行動商務的看法，以及其未來發展潛力。",
    hint: "建議包含：行動商務概念、發展現況、未來趨勢、個人見解",
    category: "technical"
  },
  {
    id: 20,
    question: "您認為資管系學生在畢業後應該如何持續學習和成長？",
    hint: "建議包含：終身學習重要性、學習方法、具體策略、未來規劃",
    category: "career"
  }
];

// 隨機抽取函數
function getRandomQuestions(questions: any[], count: number) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const includePersonalized = searchParams.get('personalized') === 'true';

    console.log("獲取題目請求:", { username, includePersonalized }); // 調試用

    let questions: any[] = [];

    // 獲取隨機題目（5題）
    const dbQuestions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' }
    });

    if (dbQuestions.length > 0) {
      questions = getRandomQuestions(dbQuestions, 5);
      console.log("從數據庫獲取隨機題目:", questions.length, "題");
    } else {
      questions = getRandomQuestions(imQuestions, 5);
      console.log("從預設題庫獲取隨機題目:", questions.length, "題");
    }

    // 如果需要個性化題目，嘗試獲取用戶的履歷分析結果
    if (includePersonalized && username) {
      try {
        console.log("嘗試獲取個性化題目...");
        
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
          console.log("用戶不存在:", username);
        } else {
          const latestResumeAnalysis = await prisma.resumeAnalysis.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
          });

          if (!latestResumeAnalysis) {
            console.log("用戶沒有履歷分析記錄");
          } else {
            console.log("找到履歷分析記錄，開始生成個性化問題...");
            
            // 調用個性化問題生成API
            const personalizedResponse = await fetch(`${req.nextUrl.origin}/api/resume-analysis/generate-questions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resumeText: latestResumeAnalysis.originalText,
                analysisResults: {
                  scoreResult: JSON.parse(latestResumeAnalysis.scoreResult || '{}'),
                  issuesResult: JSON.parse(latestResumeAnalysis.issuesResult || '[]'),
                  rewriteResult: latestResumeAnalysis.rewriteResult,
                  structureResult: JSON.parse(latestResumeAnalysis.structureResult || '[]')
                },
                username: username
              })
            });

            console.log("個性化問題API響應狀態:", personalizedResponse.status);

            if (personalizedResponse.ok) {
              const personalizedData = await personalizedResponse.json();
              console.log("個性化問題API響應:", personalizedData);
              
              if (personalizedData.success && personalizedData.result) {
                // 確保result是數組格式
                let questionsArray = personalizedData.result;
                if (!Array.isArray(questionsArray)) {
                  // 如果是單個問題對象，轉換為數組
                  if (questionsArray && typeof questionsArray === 'object' && questionsArray.question) {
                    questionsArray = [questionsArray];
                  } else {
                    console.log("個性化問題格式不正確，使用備用問題");
                    addFallbackPersonalizedQuestions();
                    return;
                  }
                }
                
                // 將個性化問題添加到題目列表中
                const personalizedQuestions = questionsArray.map((q: any, index: number) => ({
                  id: `personalized_${index + 1}`,
                  question: q.question,
                  hint: q.hint,
                  category: q.category,
                  isPersonalized: true,
                  reason: q.reason
                }));

                questions = [...questions, ...personalizedQuestions];
                console.log("成功添加個性化題目:", personalizedQuestions.length, "題");
              } else {
                console.log("個性化問題API返回失敗:", personalizedData.message);
                // 使用備用個性化問題
                addFallbackPersonalizedQuestions();
              }
            } else {
              console.log("個性化問題API請求失敗:", personalizedResponse.status);
              // 使用備用個性化問題
              addFallbackPersonalizedQuestions();
            }
          }
        }
      } catch (error) {
        console.error("獲取個性化問題失敗:", error);
        // 使用備用個性化問題
        addFallbackPersonalizedQuestions();
      }
    }

    // 備用個性化問題函數
    function addFallbackPersonalizedQuestions() {
      const fallbackQuestions = [
        {
          id: "personalized_1",
          question: "請詳細說明您選擇資管系的具體原因和動機？",
          hint: "建議包含：個人興趣、未來規劃、對資管領域的理解",
          category: "personal",
          isPersonalized: true,
          reason: "基於履歷分析，需要更深入了解您的選擇動機"
        },
        {
          id: "personalized_2",
          question: "您認為自己在資管領域有哪些優勢和需要改進的地方？",
          hint: "建議包含：個人優勢、學習經歷、改進計劃",
          category: "academic",
          isPersonalized: true,
          reason: "根據履歷分析結果，評估個人能力發展"
        },
        {
          id: "personalized_3",
          question: "請分享一次您使用資訊科技解決問題的具體經驗？",
          hint: "建議包含：問題背景、解決方案、學習收穫",
          category: "technical",
          isPersonalized: true,
          reason: "基於履歷內容，深入探討技術應用能力"
        },
        {
          id: "personalized_4",
          question: "您對企業管理中的資訊系統有什麼了解？",
          hint: "建議包含：系統概念、應用場景、個人見解",
          category: "technical",
          isPersonalized: true,
          reason: "測試對資管核心領域的理解深度"
        },
        {
          id: "personalized_5",
          question: "您如何規劃大學四年的學習目標和未來發展？",
          hint: "建議包含：短期目標、長期規劃、具體行動",
          category: "career",
          isPersonalized: true,
          reason: "基於履歷分析，評估規劃能力和目標明確度"
        }
      ];
      
      questions = [...questions, ...fallbackQuestions];
      console.log("使用備用個性化題目:", fallbackQuestions.length, "題");
    }

    console.log("最終題目數量:", questions.length);
    console.log("隨機題目數量:", questions.filter(q => !q.isPersonalized).length);
    console.log("個性化題目數量:", questions.filter(q => q.isPersonalized).length);

    return NextResponse.json({ 
      success: true, 
      questions: questions,
      totalCount: questions.length,
      randomCount: questions.filter(q => !q.isPersonalized).length,
      personalizedCount: questions.filter(q => q.isPersonalized).length
    });
  } catch (error) {
    console.error("獲取問題失敗:", error);
    return NextResponse.json({ success: false, message: "獲取問題失敗" }, { status: 500 });
  }
} 