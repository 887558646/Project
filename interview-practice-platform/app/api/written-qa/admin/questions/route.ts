import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../lib/generated/prisma";

const prisma = new PrismaClient();

// 獲取所有題目
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { id: 'asc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      questions 
    });
  } catch (error) {
    console.error("獲取題目失敗:", error);
    return NextResponse.json({ success: false, message: "獲取題目失敗" }, { status: 500 });
  }
}

// 新增題目
export async function POST(req: NextRequest) {
  try {
    const { question, hint, category, school } = await req.json();
    
    if (!question || !hint || !category) {
      return NextResponse.json({ success: false, message: "缺少必要參數" }, { status: 400 });
    }
    
    const newQuestion = await prisma.question.create({
      data: {
        question,
        hint,
        category,
        school: school || null,
        isActive: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "題目新增成功",
      question: newQuestion
    });
  } catch (error) {
    console.error("新增題目失敗:", error);
    return NextResponse.json({ success: false, message: "新增題目失敗" }, { status: 500 });
  }
}

// 更新題目
export async function PUT(req: NextRequest) {
  try {
    const { id, question, hint, category, school, isActive } = await req.json();
    
    if (!id || !question || !hint || !category) {
      return NextResponse.json({ success: false, message: "缺少必要參數" }, { status: 400 });
    }
    
    const updatedQuestion = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        question,
        hint,
        category,
        school: school || null,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "題目更新成功",
      question: updatedQuestion
    });
  } catch (error) {
    console.error("更新題目失敗:", error);
    return NextResponse.json({ success: false, message: "更新題目失敗" }, { status: 500 });
  }
}

// 刪除題目
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: "缺少題目ID" }, { status: 400 });
    }
    
    await prisma.question.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "題目刪除成功"
    });
  } catch (error) {
    console.error("刪除題目失敗:", error);
    return NextResponse.json({ success: false, message: "刪除題目失敗" }, { status: 500 });
  }
} 