"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, Save, BarChart3, XCircle, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  hint: string
  category: string
  isPersonalized?: boolean // 新增屬性
  reason?: string // 新增屬性
}

interface Analysis {
  wordCount: number
  charCount: number
  sentenceCount: number
  paragraphCount: number
  avgSentenceLength: number
  vocabularyDiversity: number
  keywordCounts: {
    positive: number
    negative: number
    technical: number
    academic: number
    personal: number
  }
  clarityScore: number
  exaggerationScore: number
  depthScore: number
  formalityScore: number
  issues: string[]
  suggestions: string[]
  structure: {
    hasIntroduction: boolean
    hasConclusion: boolean
    hasExamples: boolean
    hasNumbers: boolean
    hasQuotes: boolean
  }
  grades: {
    clarity: { grade: string; color: string; bg: string }
    depth: { grade: string; color: string; bg: string }
    overall: { grade: string; color: string; bg: string }
  }
}

export default function WrittenQA() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("正在獲取題目...")

  useEffect(() => {
    // 獲取用戶名
    const storedUsername = window.localStorage.getItem("username")
    setUsername(storedUsername || "")
  }, [])

  // 當username設置後再獲取問題
  useEffect(() => {
    if (username) {
      fetchQuestions()
    }
  }, [username])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadingMessage("正在獲取題目...")
      
      console.log("開始獲取問題，用戶名:", username);
      
      // 嘗試獲取包含個性化問題的題目
      const response = await fetch(`/api/written-qa/questions?username=${username}&personalized=true`)
      const data = await response.json()
      console.log("獲取問題響應:", data);
      
      if (data.success) {
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(""))
        
        // 顯示題目統計信息
        console.log(`獲取到 ${data.totalCount} 題：${data.randomCount} 題隨機題目 + ${data.personalizedCount} 題個性化題目`)
        
        // 如果有個性化題目，顯示提示
        if (data.personalizedCount > 0) {
          setLoadingMessage(`成功獲取 ${data.personalizedCount} 題個性化題目！`)
          setTimeout(() => setLoadingMessage(""), 2000)
        }
      } else {
        throw new Error(data.message || "獲取題目失敗")
      }
    } catch (error) {
      console.error("獲取問題失敗:", error)
      setError("獲取個性化題目失敗，正在使用備用題目...")
      
      // 如果個性化問題獲取失敗，嘗試獲取普通題目
      try {
        setLoadingMessage("正在獲取備用題目...")
        const fallbackResponse = await fetch("/api/written-qa/questions")
        const fallbackData = await fallbackResponse.json()
        if (fallbackData.success) {
          setQuestions(fallbackData.questions)
          setAnswers(new Array(fallbackData.questions.length).fill(""))
          setError(null)
        } else {
          throw new Error("備用題目獲取也失敗")
        }
      } catch (fallbackError) {
        console.error("備用題目獲取失敗:", fallbackError)
        setError("無法獲取題目，請稍後再試")
      }
    } finally {
      setLoading(false)
    }
  }

  const analyzeText = (text: string) => {
    if (!text.trim()) return null

    const words = text.trim().split(/\s+/)
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim().length > 0)
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)
    
    // 字數統計
    const wordCount = words.length
    const charCount = text.replace(/\s/g, '').length
    const sentenceCount = sentences.length
    const paragraphCount = paragraphs.length
    
    // 平均句子長度
    const avgSentenceLength = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0
    
    // 詞彙多樣性分析
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const vocabularyDiversity = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 0
    
    // 關鍵詞分析
    const keywords = {
      positive: ['成功', '成就', '學習', '成長', '經驗', '能力', '技能', '專業', '創新', '團隊', '合作', '解決', '分析', '規劃', '管理'],
      negative: ['困難', '問題', '失敗', '錯誤', '壓力', '挑戰', '複雜', '困難', '挫折'],
      technical: ['技術', '系統', '數據', '分析', '管理', '資訊', '科技', '軟體', '硬體', '網路', '安全', '雲端', '大數據', 'AI', '人工智慧'],
      academic: ['學習', '研究', '課程', '知識', '理論', '實踐', '學術', '專業', '能力', '技能'],
      personal: ['我', '自己', '個人', '經驗', '感受', '想法', '目標', '興趣', '特質', '性格']
    }
    
    const keywordCounts = {
      positive: keywords.positive.filter(word => text.includes(word)).length,
      negative: keywords.negative.filter(word => text.includes(word)).length,
      technical: keywords.technical.filter(word => text.includes(word)).length,
      academic: keywords.academic.filter(word => text.includes(word)).length,
      personal: keywords.personal.filter(word => text.includes(word)).length
    }
    
    // 結構分析
    const hasIntroduction = text.includes('首先') || text.includes('開始') || text.includes('一開始')
    const hasConclusion = text.includes('總之') || text.includes('總結') || text.includes('最後') || text.includes('因此')
    const hasExamples = text.includes('例如') || text.includes('比如') || text.includes('舉例') || text.includes('案例')
    const hasNumbers = /\d+/.test(text)
    const hasQuotes = /["""]/.test(text)
    
    // 語言風格分析
    const formalWords = ['因此', '然而', '此外', '同時', '首先', '其次', '最後', '總之', '總而言之']
    const formalCount = formalWords.filter(word => text.includes(word)).length
    const formalityScore = Math.min(100, Math.round((formalCount / sentenceCount) * 100))
    
    // 內容深度分析
    const depthIndicators = ['因為', '所以', '由於', '基於', '考慮到', '分析', '評估', '比較', '對比', '研究']
    const depthCount = depthIndicators.filter(word => text.includes(word)).length
    const depthScore = Math.min(100, Math.round((depthCount / sentenceCount) * 100))
    
    // 清晰度評分
    let clarityScore = 100
    if (avgSentenceLength > 30) clarityScore -= 20
    if (avgSentenceLength > 40) clarityScore -= 20
    if (sentenceCount < 3) clarityScore -= 15
    if (paragraphCount < 2) clarityScore -= 10
    if (vocabularyDiversity < 30) clarityScore -= 10
    clarityScore = Math.max(0, clarityScore)
    
    // 誇張度評分
    let exaggerationScore = 0
    const exaggerationWords = ['非常', '極其', '絕對', '完全', '最', '超級', '無比', '極度']
    const exaggerationCount = exaggerationWords.filter(word => text.includes(word)).length
    exaggerationScore = Math.min(100, exaggerationCount * 10)
    
    // 問題檢測
    const issues = []
    
    if (wordCount < 50) {
      issues.push('內容過於簡短，建議增加更多細節和例子')
    }
    if (wordCount > 500) {
      issues.push('內容過長，建議精簡重點內容')
    }
    if (avgSentenceLength > 35) {
      issues.push('句子過長，建議拆分成較短的句子')
    }
    if (sentenceCount < 3) {
      issues.push('段落結構不完整，建議增加更多句子')
    }
    if (vocabularyDiversity < 25) {
      issues.push('詞彙多樣性較低，建議使用更多不同的詞彙')
    }
    if (keywordCounts.negative > keywordCounts.positive) {
      issues.push('負面詞彙較多，建議多使用積極正面的表達')
    }
    if (!hasExamples) {
      issues.push('缺少具體例子，建議增加實際案例')
    }
    if (!hasIntroduction && !hasConclusion) {
      issues.push('缺少開頭或結尾，建議增加引言和總結')
    }
    if (exaggerationScore > 30) {
      issues.push('誇張表達過多，建議使用更客觀的語言')
    }
    if (depthScore < 20) {
      issues.push('分析深度不足，建議增加更多分析和思考')
    }
    
    // 建議生成
    const suggestions = []
    
    if (clarityScore < 70) {
      suggestions.push('💡 清晰度提升建議：使用更簡潔的句子，增加段落分隔')
    }
    if (depthScore < 30) {
      suggestions.push('💡 深度提升建議：增加「因為」「所以」等邏輯連接詞，提供更多分析')
    }
    if (keywordCounts.technical < 2) {
      suggestions.push('💡 專業度提升建議：增加更多專業術語和技術相關詞彙')
    }
    if (formalityScore < 30) {
      suggestions.push('💡 正式度提升建議：使用更多正式的表達方式，如「因此」「然而」等')
    }
    if (keywordCounts.personal < 3) {
      suggestions.push('💡 個人化建議：增加更多個人經驗和感受的表達')
    }
    
    // 評分等級
    const getGrade = (score: number) => {
      if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' }
      if (score >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' }
      if (score >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' }
      if (score >= 60) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' }
      if (score >= 50) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      if (score >= 40) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' }
      return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' }
    }
    
    const clarityGrade = getGrade(clarityScore)
    const depthGrade = getGrade(depthScore)
    const overallScore = Math.round((clarityScore + depthScore + (100 - exaggerationScore)) / 3)
    const overallGrade = getGrade(overallScore)
    
    return {
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      vocabularyDiversity,
      keywordCounts,
      clarityScore,
      exaggerationScore,
      depthScore,
      formalityScore,
      issues,
      suggestions,
      structure: {
        hasIntroduction,
        hasConclusion,
        hasExamples,
        hasNumbers,
        hasQuotes
      },
      grades: {
        clarity: clarityGrade,
        depth: depthGrade,
        overall: overallGrade
      }
    }
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    
    const analysisResult = analyzeText(value)
    if (analysisResult) {
      setAnalysis(analysisResult)
    }
  }

  const saveAnswer = async () => {
    if (!username || !answers[currentQuestion].trim() || !analysis) return

    setSaving(true)
    try {
      const response = await fetch("/api/written-qa/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          questionId: questions[currentQuestion].id,
          answer: answers[currentQuestion],
          analysis
        })
      })
      
      if (response.ok) {
        console.log("答案保存成功")
      }
    } catch (error) {
      console.error("保存失敗:", error)
    } finally {
      setSaving(false)
    }
  }

  const nextQuestion = async () => {
    // 保存當前答案
    await saveAnswer()
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      const analysisResult = analyzeText(answers[currentQuestion + 1])
      if (analysisResult) {
        setAnalysis(analysisResult)
      }
    } else {
      router.push("/student/ai-feedback")
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      const analysisResult = analyzeText(answers[currentQuestion - 1])
      if (analysisResult) {
        setAnalysis(analysisResult)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
          {error && (
            <div className="mt-4">
              <p className="text-red-600 mb-2">{error}</p>
              <Button 
                onClick={fetchQuestions} 
                variant="outline" 
                size="sm"
                className="text-sm"
              >
                重試
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/student/dashboard")} className="mr-4 text-pink-600 hover:bg-pink-100">
              <ArrowLeft className="w-4 h-4 mr-2 text-pink-400" />
              返回
            </Button>
            <h1 className="text-xl font-semibold text-pink-600">書面問答</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-pink-600">題目 {currentQuestion + 1} / {questions.length}</h2>
            <div className="text-sm text-blue-500">建議字數：150-250字</div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-4 bg-gradient-to-r from-pink-200 via-blue-200 to-green-200" />
          
          {/* 題目統計信息 */}
          {questions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span>📊 題目構成：</span>
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {questions.filter(q => !q.isPersonalized).length} 題隨機題目
                </span>
                {questions.filter(q => q.isPersonalized).length > 0 && (
                  <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                    {questions.filter(q => q.isPersonalized).length} 題個性化題目
                  </span>
                )}
              </div>
              {questions.filter(q => q.isPersonalized).length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  💡 個性化題目是根據您的履歷分析結果生成的，更有針對性
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="w-5 h-5 text-pink-400" />
                  {questions[currentQuestion]?.question}
                  {questions[currentQuestion]?.isPersonalized && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      個性化
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">💡 {questions[currentQuestion]?.hint}</p>
                  {questions[currentQuestion]?.reason && (
                    <p className="text-xs text-blue-600 mt-2">
                      <strong>問題緣由：</strong>{questions[currentQuestion]?.reason}
                    </p>
                  )}
                </div>

                <Textarea
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="請在此輸入您的回答..."
                  className="min-h-[300px] text-base leading-relaxed"
                />

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">字數：{analysis?.wordCount || 0}</div>
                  <div className="flex gap-2">
                    <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline" className="border-pink-200 text-pink-600">
                      上一題
                    </Button>
                    <Button 
                      onClick={saveAnswer} 
                      disabled={saving || !answers[currentQuestion]?.trim()}
                      variant="outline" 
                      className="border-green-200 text-green-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "保存中..." : "保存"}
                    </Button>
                    <Button onClick={nextQuestion} className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
                      {currentQuestion === questions.length - 1 ? "完成作答" : "下一題"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-100 to-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">即時分析</CardTitle>
              </CardHeader>
                             <CardContent className="space-y-4">
                 {analysis ? (
                   <>
                     <div>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium">清晰度</span>
                         <span className="text-sm text-gray-500">{analysis.clarityScore}%</span>
                       </div>
                       <Progress value={analysis.clarityScore} className="h-2" />
                     </div>

                     <div>
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium">誇大程度</span>
                         <span className="text-sm text-gray-500">{analysis.exaggerationScore}%</span>
                       </div>
                       <Progress value={analysis.exaggerationScore} className="h-2" />
                     </div>

                     {analysis.issues.length > 0 && (
                       <div className="mt-4">
                         <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                           <AlertTriangle className="w-4 h-4 text-orange-500" />
                           建議改善
                         </h4>
                         <ul className="space-y-1">
                           {analysis.issues.map((issue, index) => (
                             <li key={index} className="text-xs text-orange-600 flex items-center gap-2">
                               <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                               {issue}
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}

                     {analysis.issues.length === 0 && analysis.wordCount > 0 && (
                       <div className="mt-4">
                         <div className="flex items-center gap-2 text-green-600">
                           <CheckCircle className="w-4 h-4" />
                           <span className="text-sm font-medium">回答品質良好</span>
                         </div>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="text-center py-4 text-gray-500">
                     <p className="text-sm">開始輸入答案以查看分析結果</p>
                   </div>
                 )}
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-100 to-purple-100">
              <CardHeader>
                <CardTitle className="text-pink-600">作答進度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {questions.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          index === currentQuestion
                            ? "bg-blue-600 text-white"
                            : answers[index]?.trim()
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className={`text-sm ${index === currentQuestion ? "font-medium" : ""}`}>
                        題目 {index + 1}
                      </span>
                      {answers[index]?.trim() && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 分析結果 */}
        {analysis && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <BarChart3 className="w-5 h-5" />
                智能分析結果
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 總體評分 */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`text-center p-4 rounded-lg ${analysis.grades.overall.bg}`}>
                  <div className={`text-2xl font-bold ${analysis.grades.overall.color}`}>
                    {analysis.grades.overall.grade}
                  </div>
                  <div className="text-sm text-gray-600">總體評分</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${analysis.grades.clarity.bg}`}>
                  <div className={`text-2xl font-bold ${analysis.grades.clarity.color}`}>
                    {analysis.grades.clarity.grade}
                  </div>
                  <div className="text-sm text-gray-600">清晰度</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${analysis.grades.depth.bg}`}>
                  <div className={`text-2xl font-bold ${analysis.grades.depth.color}`}>
                    {analysis.grades.depth.grade}
                  </div>
                  <div className="text-sm text-gray-600">分析深度</div>
                </div>
              </div>

              {/* 詳細統計 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-blue-600">{analysis.wordCount}</div>
                  <div className="text-xs text-gray-600">字數</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-green-600">{analysis.sentenceCount}</div>
                  <div className="text-xs text-gray-600">句子數</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-purple-600">{analysis.avgSentenceLength}</div>
                  <div className="text-xs text-gray-600">平均句長</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-orange-600">{analysis.vocabularyDiversity}%</div>
                  <div className="text-xs text-gray-600">詞彙多樣性</div>
                </div>
              </div>

              {/* 關鍵詞分析 */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">關鍵詞分析</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{analysis.keywordCounts.positive}</div>
                    <div className="text-xs text-gray-600">正面詞彙</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{analysis.keywordCounts.negative}</div>
                    <div className="text-xs text-gray-600">負面詞彙</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{analysis.keywordCounts.technical}</div>
                    <div className="text-xs text-gray-600">技術詞彙</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{analysis.keywordCounts.academic}</div>
                    <div className="text-xs text-gray-600">學術詞彙</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{analysis.keywordCounts.personal}</div>
                    <div className="text-xs text-gray-600">個人詞彙</div>
                  </div>
                </div>
              </div>

              {/* 結構分析 */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">結構分析</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="flex items-center gap-2">
                    {analysis.structure.hasIntroduction ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">引言</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.structure.hasConclusion ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">結論</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.structure.hasExamples ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">例子</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.structure.hasNumbers ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">數據</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.structure.hasQuotes ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">引用</span>
                  </div>
                </div>
              </div>

              {/* 問題和建議 */}
              {analysis.issues.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    需要改進的地方
                  </h4>
                  <ul className="space-y-1">
                    {analysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.suggestions.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    改進建議
                  </h4>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-blue-600">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
