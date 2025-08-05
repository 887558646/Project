import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// 資管系20題題庫
const imQuestions = [
  {
    question: "請描述您對資訊管理的理解，以及為什麼選擇資管系？",
    hint: "建議包含：對資管的認知、選擇動機、未來規劃",
    category: "academic"
  },
  {
    question: "您認為資管系學生應該具備哪些核心能力？請舉例說明您具備哪些能力。",
    hint: "建議包含：技術能力、管理能力、溝通能力、具體經驗",
    category: "academic"
  },
  {
    question: "請分享一次您使用資訊科技解決問題的經驗。",
    hint: "建議包含：問題背景、解決方案、使用工具、結果和學習",
    category: "technical"
  },
  {
    question: "您對大數據分析有什麼了解？請舉例說明其應用。",
    hint: "建議包含：大數據概念、應用領域、個人見解",
    category: "technical"
  },
  {
    question: "請描述您對企業資源規劃(ERP)系統的理解。",
    hint: "建議包含：ERP概念、功能模組、企業應用價值",
    category: "technical"
  },
  {
    question: "您如何看待人工智慧在企業管理中的應用？",
    hint: "建議包含：AI應用場景、優缺點分析、未來發展",
    category: "technical"
  },
  {
    question: "請分享一次您參與團隊專案的經驗，以及您的角色和貢獻。",
    hint: "建議包含：專案背景、團隊分工、個人貢獻、學習收穫",
    category: "personal"
  },
  {
    question: "您認為資管系畢業生在職場上最大的優勢是什麼？",
    hint: "建議包含：跨領域能力、技術與管理結合、具體優勢",
    category: "career"
  },
  {
    question: "請描述您對電子商務的理解，以及您認為未來發展趨勢如何？",
    hint: "建議包含：電商概念、發展歷程、未來趨勢、個人見解",
    category: "technical"
  },
  {
    question: "您如何平衡技術學習與管理知識的學習？",
    hint: "建議包含：學習方法、時間分配、具體策略",
    category: "academic"
  },
  {
    question: "請分享一次您面臨困難時的解決過程，以及從中學到了什麼？",
    hint: "建議包含：困難背景、解決步驟、反思學習",
    category: "personal"
  },
  {
    question: "您對資訊安全有什麼了解？請舉例說明其重要性。",
    hint: "建議包含：資安概念、威脅類型、防護措施、重要性",
    category: "technical"
  },
  {
    question: "請描述您對雲端運算的理解，以及其對企業的影響。",
    hint: "建議包含：雲端概念、服務模式、企業影響、個人見解",
    category: "technical"
  },
  {
    question: "您認為資管系學生應該如何培養創新思維？",
    hint: "建議包含：創新重要性、培養方法、具體實踐",
    category: "academic"
  },
  {
    question: "請分享一個您引以為傲的成就，並說明它對您的意義。",
    hint: "建議包含：成就背景、過程、影響、個人成長",
    category: "personal"
  },
  {
    question: "您對資料庫管理有什麼了解？請舉例說明其應用。",
    hint: "建議包含：資料庫概念、管理系統、應用場景、重要性",
    category: "technical"
  },
  {
    question: "請描述您對供應鏈管理的理解，以及資訊科技在其中扮演的角色。",
    hint: "建議包含：供應鏈概念、IT應用、管理價值",
    category: "technical"
  },
  {
    question: "您如何規劃大學四年的學習目標？",
    hint: "建議包含：短期目標、長期規劃、具體行動、檢視調整",
    category: "academic"
  },
  {
    question: "請分享您對行動商務的看法，以及其未來發展潛力。",
    hint: "建議包含：行動商務概念、發展現況、未來趨勢、個人見解",
    category: "technical"
  },
  {
    question: "您認為資管系學生在畢業後應該如何持續學習和成長？",
    hint: "建議包含：終身學習重要性、學習方法、具體策略、未來規劃",
    category: "career"
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
        isActive: true
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