import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// 資管系20題題庫
const imQuestions = [
  {
    question: "請描述您對資訊管理的理解，以及為什麼選擇資管系？",
    hint: "建議包含：對資管的認知、選擇動機、未來規劃",
    category: "academic",
    school: "通用"
  },
  {
    question: "您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。",
    hint: "建議包含：技術能力、管理能力、溝通能力、具體經驗",
    category: "academic",
    school: "通用"
  },
  {
    question: "請分享一次您使用資訊科技解決問題的經驗。",
    hint: "建議包含：問題背景、解決方案、使用工具、結果和學習",
    category: "technical",
    school: "通用"
  },
  {
    question: "您對大數據分析有什麼了解？請舉例說明其應用。",
    hint: "建議包含：大數據概念、應用領域、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    question: "請描述您對企業資源規劃(ERP)系統的理解。",
    hint: "建議包含：ERP概念、功能模組、企業應用價值",
    category: "technical",
    school: "通用"
  },
  {
    question: "您如何看待人工智慧在企業管理中的應用？",
    hint: "建議包含：AI應用場景、優缺點分析、未來發展",
    category: "technical",
    school: "通用"
  },
  {
    question: "請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。",
    hint: "建議包含：專案背景、團隊分工、個人貢獻、學習收穫",
    category: "personal",
    school: "通用"
  },
  {
    question: "您認為資管系畢業生在職場上最大的優勢是什麼？",
    hint: "建議包含：跨領域能力、技術與管理結合、具體優勢",
    category: "career",
    school: "通用"
  },
  {
    question: "請描述您對電子商務的理解，以及您認為未來發展趨勢如何？",
    hint: "建議包含：電商概念、發展歷程、未來趨勢、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    question: "您對自己的學習規劃和未來發展有什麼想法？",
    hint: "建議包含：短期目標、長期規劃、具體行動、檢視調整",
    category: "academic",
    school: "通用"
  },
  {
    question: "請分享您對行動商務的看法，以及其未來發展潛力。",
    hint: "建議包含：行動商務概念、發展現況、未來趨勢、個人見解",
    category: "technical",
    school: "通用"
  },
  {
    question: "您認為資管系學生在畢業後應該如何持續學習和成長？",
    hint: "建議包含：終身學習重要性、學習方法、具體策略、未來規劃",
    category: "career",
    school: "通用"
  },
  {
    question: "請分享您對理論與實務結合的看法，以及如何在學習中實踐這種理念？",
    hint: "建議包含：理論重要性、實務應用、個人學習方式、未來規劃",
    category: "academic",
    school: "通用"
  },
  {
    question: "您希望參與哪些類型的產學合作專案？請說明您的興趣和期望。",
    hint: "建議包含：興趣領域、專案類型、期望收穫、具體規劃",
    category: "career",
    school: "通用"
  },
  {
    question: "請分享您對創新思維的理解和經驗，以及如何在學習中培養創新能力？",
    hint: "建議包含：創新定義、個人經驗、創新思維、未來應用",
    category: "personal",
    school: "通用"
  },
  {
    question: "您希望結合哪些領域進行跨領域學習？請說明您的想法和規劃。",
    hint: "建議包含：興趣領域、跨領域優勢、學習規劃、未來發展",
    category: "academic",
    school: "通用"
  },
  {
    question: "請分享您對新興科技的了解，以及您最感興趣的科技領域。",
    hint: "建議包含：科技趨勢、個人興趣、應用場景、學習規劃",
    category: "technical",
    school: "通用"
  },
  {
    question: "您對國際化學習有什麼想法？請分享您的語言能力和文化適應經驗。",
    hint: "建議包含：國際化重要性、語言能力、文化適應、未來規劃",
    category: "career",
    school: "通用"
  },
  {
    question: "請分享您對管理的理解，以及您認為管理思維在資訊管理中的重要性。",
    hint: "建議包含：管理概念、管理經驗、管理思維、未來應用",
    category: "academic",
    school: "通用"
  },
  {
    question: "您希望在哪類企業實習？請說明您的實習目標和期望。",
    hint: "建議包含：企業類型、實習目標、學習期望、未來發展",
    category: "career",
    school: "通用"
  }
];

export async function POST(req: NextRequest) {
  try {
    // 清空現有問題
    await prisma.question.deleteMany({});
    
    // 插入資管系題庫
    const createdQuestions = await prisma.question.createMany({
      data: imQuestions.map(q => ({
        question: q.question,
        hint: q.hint,
        category: q.category,
        isActive: true,
        school: q.school
      }))
    });

    return NextResponse.json({ 
      success: true, 
      message: `成功初始化 ${createdQuestions.count} 題資管系題庫`,
      count: createdQuestions.count
    });
  } catch (error) {
    console.error("初始化題庫失敗:", error);
    return NextResponse.json({ success: false, message: "初始化題庫失敗" }, { status: 500 });
  }
} 