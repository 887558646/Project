import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../lib/generated/prisma";

const prisma = new PrismaClient();

// 資管系20題題庫
const imQuestions = [
  {
    id: 1,
    question: "請描述您對資訊管理的理解，以及為什麼選擇資管系？",
    hint: "建議包含：對資管的認知、選擇動機、未來規劃",
    category: "academic",
    school: "通用"
  },
  {
    id: 2,
    question: "您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。",
    hint: "建議包含：技術能力、管理能力、溝通能力、具體經驗",
    category: "academic",
    school: "通用"
  },
  {
    id: 3,
    question: "請分享一次您使用資訊科技解決問題的經驗。",
    hint: "建議包含：問題背景、解決方案、使用工具、結果和學習",
    category: "technical",
    school: "通用"
  },
  {
    id: 4,
    question: "您對大數據分析有什麼了解？請舉例說明其應用。",
    hint: "建議包含：大數據概念、應用領域、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    id: 5,
    question: "請描述您對企業資源規劃(ERP)系統的理解。",
    hint: "建議包含：ERP概念、功能模組、企業應用價值",
    category: "technical",
    school: "通用"
  },
  {
    id: 6,
    question: "您如何看待人工智慧在企業管理中的應用？",
    hint: "建議包含：AI應用場景、優缺點分析、未來發展",
    category: "technical",
    school: "通用"
  },
  {
    id: 7,
    question: "請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。",
    hint: "建議包含：專案背景、團隊分工、個人貢獻、學習收穫",
    category: "personal",
    school: "通用"
  },
  {
    id: 8,
    question: "您認為資管系畢業生在職場上最大的優勢是什麼？",
    hint: "建議包含：跨領域能力、技術與管理結合、具體優勢",
    category: "career",
    school: "通用"
  },
  {
    id: 9,
    question: "請描述您對電子商務的理解，以及您認為未來發展趨勢如何？",
    hint: "建議包含：電商概念、發展歷程、未來趨勢、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    id: 10,
    question: "您對自己的學習規劃和未來發展有什麼想法？",
    hint: "建議包含：短期目標、長期規劃、具體行動、檢視調整",
    category: "academic",
    school: "通用"
  },
  {
    id: 11,
    question: "請分享您對行動商務的看法，以及其未來發展潛力。",
    hint: "建議包含：行動商務概念、發展現況、未來趨勢、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    id: 12,
    question: "您認為資管系學生在畢業後應該如何持續學習和成長？",
    hint: "建議包含：終身學習重要性、學習方法、具體策略、未來規劃",
    category: "career",
    school: "通用"
  },
  {
    id: 13,
    question: "請分享您對理論與實務結合的看法，以及如何在學習中實踐這種理念？",
    hint: "建議包含：理論重要性、實務應用、個人學習方式、未來規劃",
    category: "academic",
    school: "通用"
  },
  {
    id: 14,
    question: "您希望參與哪些類型的產學合作專案？請說明您的興趣和期望。",
    hint: "建議包含：興趣領域、專案類型、期望收穫、具體規劃",
    category: "career",
    school: "通用"
  },
  {
    id: 15,
    question: "請分享您對創新思維的理解和經驗，以及如何在學習中培養創新能力？",
    hint: "建議包含：創新定義、個人經驗、創新思維、未來應用",
    category: "personal",
    school: "通用"
  },
  {
    id: 16,
    question: "您希望結合哪些領域進行跨領域學習？請說明您的想法和規劃。",
    hint: "建議包含：興趣領域、跨領域優勢、學習規劃、未來發展",
    category: "academic",
    school: "通用"
  },
  {
    id: 17,
    question: "請分享您對新興科技的了解，以及您最感興趣的科技領域。",
    hint: "建議包含：科技趨勢、個人興趣、應用場景、學習規劃",
    category: "technical",
    school: "通用"
  },
  {
    id: 18,
    question: "您對國際化學習有什麼想法？請分享您的語言能力和文化適應經驗。",
    hint: "建議包含：國際化重要性、語言能力、文化適應、未來規劃",
    category: "career",
    school: "通用"
  },
  {
    id: 19,
    question: "請分享您對管理的理解，以及您認為管理思維在資訊管理中的重要性。",
    hint: "建議包含：管理概念、管理經驗、管理思維、未來應用",
    category: "academic",
    school: "通用"
  },
  {
    id: 20,
    question: "您希望在哪類企業實習？請說明您的實習目標和期望。",
    hint: "建議包含：企業類型、實習目標、學習期望、未來發展",
    category: "career",
    school: "通用"
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
    const school = searchParams.get('school'); // 新增學校篩選參數

    console.log("獲取題目請求:", { username, includePersonalized, school }); // 調試用

    let questions: any[] = [];

    // 獲取隨機題目（5題）
    const dbQuestions = await prisma.question.findMany({
      where: { 
        isActive: true,
        ...(school && school !== 'all' && { school: school })
      },
      orderBy: { id: 'asc' }
    });

    if (dbQuestions.length > 0) {
      questions = getRandomQuestions(dbQuestions, 5);
      console.log("從數據庫獲取隨機題目:", questions.length, "題");
    } else {
      // 從預設題庫篩選
      let filteredQuestions = imQuestions;
      if (school && school !== 'all') {
        filteredQuestions = imQuestions.filter(q => q.school === school);
      }
      questions = getRandomQuestions(filteredQuestions, 5);
      console.log("從預設題庫獲取隨機題目:", questions.length, "題");
    }

    // 如果需要個性化題目，嘗試合併：履歷 + 自我介紹
    if (includePersonalized && username) {
      try {
        console.log("嘗試獲取個性化題目...");
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
          // 1) 履歷個性化（沿用既有生成流程）
          const latestResumeAnalysis = await prisma.resumeAnalysis.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
          });

          if (latestResumeAnalysis) {
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

            if (personalizedResponse.ok) {
              const personalizedData = await personalizedResponse.json();
              if (personalizedData.success && personalizedData.result) {
                let questionsArray = personalizedData.result;
                if (!Array.isArray(questionsArray)) {
                  if (questionsArray && typeof questionsArray === 'object' && questionsArray.question) {
                    questionsArray = [questionsArray];
                  } else {
                    questionsArray = [];
                  }
                }
                const resumePersonalized = questionsArray.slice(0, 5).map((q: any, index: number) => ({
                  id: `resume_personalized_${index + 1}`,
                  question: q.question,
                  hint: q.hint,
                  category: q.category,
                  isPersonalized: true,
                  reason: q.reason
                }));
                questions = [...questions, ...resumePersonalized];
              }
            }
          }

          // 2) 自我介紹個性化：讀取最新 SelfIntroAnalysis 關聯的題目
          const latestSelfIntro = await prisma.selfIntroAnalysis.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: { personalizedQuestions: true }
          });

          if (latestSelfIntro?.personalizedQuestions?.length) {
            const introPersonalized = latestSelfIntro.personalizedQuestions
              .slice()
              .sort((a: any, b: any) => (b.createdAt as any) - (a.createdAt as any))
              .slice(0, 5)
              .map((q: any, index: number) => ({
                id: `intro_personalized_${index + 1}`,
                question: q.question,
                hint: q.hint,
                category: q.category,
                isPersonalized: true,
                reason: q.reason
              }));
            questions = [...questions, ...introPersonalized];
          }
        }
      } catch (error) {
        console.error("合併個性化題目失敗:", error);
      }
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