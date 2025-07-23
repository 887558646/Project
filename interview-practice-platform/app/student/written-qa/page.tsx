"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    question: "請描述一次您克服困難的經歷，以及從中學到了什麼？",
    hint: "建議包含：具體情況、採取的行動、結果和反思",
  },
  {
    id: 2,
    question: "為什麼選擇這個科系？您認為自己具備哪些相關的能力或特質？",
    hint: "建議包含：動機、相關經驗、個人特質",
  },
  {
    id: 3,
    question: "請分享一個您引以為傲的成就，並說明它對您的意義。",
    hint: "建議包含：具體成就、過程、影響和意義",
  },
]

export default function WrittenQA() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""))
  const [analysis, setAnalysis] = useState({
    wordCount: 0,
    exaggerationScore: 0,
    clarityScore: 85,
    issues: [] as string[],
  })

  const analyzeText = (text: string) => {
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length

    // Simple analysis simulation
    const exaggeratedWords = ["非常", "極其", "超級", "絕對", "完全", "百分之百"]
    const vagueWords = ["可能", "也許", "大概", "應該", "或許"]

    let exaggerationCount = 0
    let vagueCount = 0

    exaggeratedWords.forEach((word) => {
      exaggerationCount += (text.match(new RegExp(word, "g")) || []).length
    })

    vagueWords.forEach((word) => {
      vagueCount += (text.match(new RegExp(word, "g")) || []).length
    })

    const issues = []
    if (exaggerationCount > 2) issues.push("過多誇大詞彙")
    if (vagueCount > 3) issues.push("語句過於模糊")
    if (wordCount < 50) issues.push("回答過於簡短")
    if (wordCount > 300) issues.push("回答過於冗長")

    setAnalysis({
      wordCount,
      exaggerationScore: Math.min(100, exaggerationCount * 20),
      clarityScore: Math.max(60, 100 - vagueCount * 10 - exaggerationCount * 5),
      issues,
    })
  }

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    analyzeText(value)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      analyzeText(answers[currentQuestion + 1])
    } else {
      router.push("/student/ai-feedback")
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      analyzeText(answers[currentQuestion - 1])
    }
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
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="w-5 h-5 text-pink-400" />
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">💡 {questions[currentQuestion].hint}</p>
                </div>

                <Textarea
                  value={answers[currentQuestion]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="請在此輸入您的回答..."
                  className="min-h-[300px] text-base leading-relaxed"
                />

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">字數：{analysis.wordCount}</div>
                  <div className="flex gap-2">
                    <Button onClick={prevQuestion} disabled={currentQuestion === 0} variant="outline" className="border-pink-200 text-pink-600">
                      上一題
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
                            : answers[index].trim()
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className={`text-sm ${index === currentQuestion ? "font-medium" : ""}`}>
                        題目 {index + 1}
                      </span>
                      {answers[index].trim() && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
