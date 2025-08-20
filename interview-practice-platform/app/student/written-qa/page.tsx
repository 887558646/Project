"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, Save, BarChart3, XCircle, Lightbulb, Target, Sparkles, ArrowRight, ArrowLeft as ArrowLeftIcon } from "lucide-react"
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
  const [username, setUsername] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("通用") // 新增學校選擇狀態
  const [availableSchools, setAvailableSchools] = useState<string[]>(["通用", "台大", "清大", "交大", "政大", "成大", "中央", "中山", "中興", "台科大", "北科大"])

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
  }, [username, selectedSchool]) // 添加selectedSchool依賴

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadingMessage("正在獲取題目...")
      
      console.log("開始獲取問題，用戶名:", username);
      
      // 嘗試獲取包含個性化問題的題目，並添加學校篩選
      const response = await fetch(`/api/written-qa/questions?username=${username}&personalized=true&school=${selectedSchool}`)
      const data = await response.json()
      console.log("獲取問題響應:", data);
      
      if (data.success) {
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(""))
        setCurrentQuestion(0) // 重置到第一題
        
        // 顯示題目統計信息
        console.log(`獲取到 ${data.totalCount} 題：${data.randomCount} 題隨機題目 + ${data.personalizedCount} 題個性化題目`)
        
        // 獲取所有可用的學校列表
        try {
          const schoolsRes = await fetch("/api/written-qa/admin/questions")
          const schoolsData = await schoolsRes.json()
          if (schoolsData.success) {
            const schools = schoolsData.questions
              .map((q: any) => q.school)
              .filter((school: any): school is string => typeof school === 'string' && school !== "通用")
            const uniqueSchools = [...new Set(schools)]
            setAvailableSchools(["通用", ...uniqueSchools])
          }
        } catch (e) {
          // 如果獲取學校列表失敗，使用預設列表
          console.log("獲取學校列表失敗，使用預設列表")
        }
        
        // 如果有個性化題目，顯示提示
        if (data.personalizedCount > 0) {
          console.log("發現個性化題目，基於備審資料分析生成")
        }
      } else {
        throw new Error(data.message || "獲取題目失敗")
      }
    } catch (err) {
      console.error("獲取題目錯誤:", err)
      setError("獲取題目失敗，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    
    // 即時分析
    if (value.trim()) {
      analyzeAnswer(value)
    } else {
      setAnalysis(null)
    }
  }

  const analyzeAnswer = (text: string) => {
    // 簡化的即時分析邏輯
    const words = text.trim().split(/\s+/).filter(Boolean)
    const sentences = text.split(/[。！？!?\.]/).filter(Boolean)
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean)
    
    const wordCount = words.length
    const charCount = text.length
    const sentenceCount = sentences.length
    const paragraphCount = paragraphs.length
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0
    
    // 計算清晰度分數
    let clarityScore = 80
    if (avgSentenceLength > 25) clarityScore -= 10
    if (avgSentenceLength > 35) clarityScore -= 10
    if (wordCount < 50) clarityScore -= 20
    if (wordCount > 300) clarityScore -= 10
    clarityScore = Math.max(0, Math.min(100, clarityScore))
    
    // 計算深度分數
    let depthScore = 70
    if (paragraphCount >= 3) depthScore += 10
    if (wordCount >= 150) depthScore += 10
    if (text.includes('因為') || text.includes('所以') || text.includes('因此')) depthScore += 10
    depthScore = Math.min(100, depthScore)
    
    // 生成建議
    const suggestions: string[] = []
    if (wordCount < 100) suggestions.push("建議增加更多細節和例子")
    if (avgSentenceLength > 30) suggestions.push("句子較長，建議拆分為多個短句")
    if (paragraphCount < 2) suggestions.push("建議分段，提高可讀性")
    if (depthScore < 70) suggestions.push("可以加入更多分析和反思")
    
    const newAnalysis: Analysis = {
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      vocabularyDiversity: 0.8,
      keywordCounts: {
        positive: (text.match(/積極|正面|成功|優秀|進步/g) || []).length,
        negative: (text.match(/困難|挑戰|失敗|不足/g) || []).length,
        technical: (text.match(/技術|專業|技能|能力/g) || []).length,
        academic: (text.match(/學習|研究|知識|理論/g) || []).length,
        personal: (text.match(/我|自己|個人|經歷/g) || []).length
      },
      clarityScore,
      exaggerationScore: 75,
      depthScore,
      formalityScore: 80,
      issues: [],
      suggestions,
      structure: {
        hasIntroduction: text.includes('首先') || text.includes('開始'),
        hasConclusion: text.includes('總之') || text.includes('結論'),
        hasExamples: text.includes('例如') || text.includes('比如'),
        hasNumbers: /\d+/.test(text),
        hasQuotes: text.includes('"') || text.includes('"')
      },
      grades: {
        clarity: { 
          grade: clarityScore >= 80 ? 'A' : clarityScore >= 60 ? 'B' : 'C',
          color: clarityScore >= 80 ? 'text-green-600' : clarityScore >= 60 ? 'text-yellow-600' : 'text-red-600',
          bg: clarityScore >= 80 ? 'bg-green-100' : clarityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        },
        depth: { 
          grade: depthScore >= 80 ? 'A' : depthScore >= 60 ? 'B' : 'C',
          color: depthScore >= 80 ? 'text-green-600' : depthScore >= 60 ? 'text-yellow-600' : 'text-red-600',
          bg: depthScore >= 80 ? 'bg-green-100' : depthScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        },
        overall: { 
          grade: ((clarityScore + depthScore) / 2) >= 80 ? 'A' : ((clarityScore + depthScore) / 2) >= 60 ? 'B' : 'C',
          color: ((clarityScore + depthScore) / 2) >= 80 ? 'text-green-600' : ((clarityScore + depthScore) / 2) >= 60 ? 'text-yellow-600' : 'text-red-600',
          bg: ((clarityScore + depthScore) / 2) >= 80 ? 'bg-green-100' : ((clarityScore + depthScore) / 2) >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }
      }
    }
    
    setAnalysis(newAnalysis)
  }

  const saveAnswer = async () => {
    if (!username || !answers[currentQuestion]?.trim()) return
    setSaving(true)
    try {
      await fetch("/api/written-qa/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          questionId: questions[currentQuestion].id,
          answer: answers[currentQuestion],
          analysis: {
            wordCount: analysis?.wordCount || 0,
            clarityScore: analysis?.clarityScore || 0,
            exaggerationScore: analysis?.exaggerationScore || 0,
            issues: analysis?.issues || []
          }
        })
      })
    } catch (e) {
      console.error("保存失敗:", e)
    } finally {
      setSaving(false)
    }
  }

  const nextQuestion = async () => {
    await saveAnswer()
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setAnalysis(null)
    } else {
      router.push("/student/ai-feedback")
    }
  }

  const prevQuestion = async () => {
    await saveAnswer()
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      // 重新分析上一題的答案
      if (answers[currentQuestion - 1]) {
        analyzeAnswer(answers[currentQuestion - 1])
      } else {
        setAnalysis(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-medium text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchQuestions} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            重新嘗試
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center h-20">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/student/dashboard")} 
              className="mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回儀表板
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                書面問答練習
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 border border-pink-200/50">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-pink-700">題目 {currentQuestion + 1} / {questions.length}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">書面問答進行中</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                建議字數：150-250字
              </div>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSchools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school === "通用" ? "通用題目" : `${school}專屬`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <Progress 
              value={((currentQuestion + 1) / questions.length) * 100} 
              className="h-3 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-full overflow-hidden"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span>進度</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
          </div>
          
          {/* 題目統計信息 */}
          {questions.length > 0 && (
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">題目構成</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {questions.filter(q => !q.isPersonalized).length} 題隨機題目
                </div>
                {questions.filter(q => q.isPersonalized).length > 0 && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {questions.filter(q => q.isPersonalized).length} 題個性化題目
                  </div>
                )}
              </div>
              {questions.filter(q => q.isPersonalized).length > 0 && (
                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  個性化題目是根據您的備審資料分析結果生成的，更有針對性
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要答题区域 */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50">
                <CardTitle className="flex items-center gap-3 text-blue-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold leading-relaxed">
                      {questions[currentQuestion]?.question}
                    </div>
                    {questions[currentQuestion]?.isPersonalized && (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        個性化題目
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50 mb-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {questions[currentQuestion]?.hint}
                      </p>
                      {questions[currentQuestion]?.reason && (
                        <p className="text-xs text-blue-600 mt-2">
                          <strong>問題緣由：</strong>{questions[currentQuestion]?.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Textarea
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="請在此輸入您的回答..."
                  className="min-h-[300px] text-base leading-relaxed border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-xl resize-none"
                />

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    字數：{analysis?.wordCount || 0}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={prevQuestion} 
                      disabled={currentQuestion === 0} 
                      variant="outline" 
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      上一題
                    </Button>
                    <Button 
                      onClick={saveAnswer} 
                      disabled={saving || !answers[currentQuestion]?.trim()}
                      variant="outline" 
                      className="border-green-200 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "保存中..." : "保存"}
                    </Button>
                    <Button 
                      onClick={nextQuestion} 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {currentQuestion === questions.length - 1 ? "完成作答" : "下一題"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 分析面板 */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100/50">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  即時分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {analysis ? (
                  <div className="space-y-6">
                    {/* 评分 */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`text-center p-3 rounded-xl ${analysis.grades.clarity.bg}`}>
                        <div className={`text-lg font-bold ${analysis.grades.clarity.color}`}>
                          {analysis.grades.clarity.grade}
                        </div>
                        <div className="text-xs text-gray-600">清晰度</div>
                      </div>
                      <div className={`text-center p-3 rounded-xl ${analysis.grades.depth.bg}`}>
                        <div className={`text-lg font-bold ${analysis.grades.depth.color}`}>
                          {analysis.grades.depth.grade}
                        </div>
                        <div className="text-xs text-gray-600">深度</div>
                      </div>
                      <div className={`text-center p-3 rounded-xl ${analysis.grades.overall.bg}`}>
                        <div className={`text-lg font-bold ${analysis.grades.overall.color}`}>
                          {analysis.grades.overall.grade}
                        </div>
                        <div className="text-xs text-gray-600">整體</div>
                      </div>
                    </div>

                    {/* 详细指标 */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">清晰度</span>
                          <span className="text-sm text-gray-500">{analysis.clarityScore}%</span>
                        </div>
                        <Progress value={analysis.clarityScore} className="h-2 bg-gray-200" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">深度</span>
                          <span className="text-sm text-gray-500">{analysis.depthScore}%</span>
                        </div>
                        <Progress value={analysis.depthScore} className="h-2 bg-gray-200" />
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">字數</div>
                        <div className="font-semibold text-gray-800">{analysis.wordCount}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">句子</div>
                        <div className="font-semibold text-gray-800">{analysis.sentenceCount}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">段落</div>
                        <div className="font-semibold text-gray-800">{analysis.paragraphCount}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">平均句長</div>
                        <div className="font-semibold text-gray-800">{analysis.avgSentenceLength.toFixed(1)}</div>
                      </div>
                    </div>

                    {/* 建议 */}
                    {analysis.suggestions.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-blue-700">改進建議</span>
                        </div>
                        <ul className="space-y-2 text-sm text-blue-800">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">開始輸入答案後會顯示分析結果</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
