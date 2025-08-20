"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Sparkles,
  Award,
  Users,
  Clock,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SummaryData {
  success: boolean
  user: { id: number; username: string; role: string }
  written: { count: number; avgClarity: number; avgExaggeration: number; items: any[] }
  video: { count: number; avgSpeechRate: number; avgEmotionScore: number; avgDurationSec: number; items: any[] }
  combined: { overallScore: number }
}

const feedbackSections = [
  {
    title: "自我介紹",
    score: 85,
    strengths: ["語調自然，表達流暢", "內容結構清晰", "展現了良好的自信心"],
    improvements: ["可以增加更多具體的例子", "眼神接觸可以更加穩定"],
    suggestions: "建議在介紹個人經歷時，加入更多量化的成果描述，例如「參與了3個專案」而非「參與了很多專案」。",
  },
  {
    title: "動機說明",
    score: 78,
    strengths: ["動機明確", "展現了對科系的了解"],
    improvements: ["可以更深入說明選擇理由", "避免使用過於絕對的詞彙"],
    suggestions: "建議結合個人經驗來說明選擇動機，讓回答更有說服力和個人特色。",
  },
  {
    title: "未來規劃",
    score: 82,
    strengths: ["規劃具體可行", "展現了積極的學習態度"],
    improvements: ["可以增加短期目標的描述", "說明如何達成這些目標"],
    suggestions: "建議將長期目標分解為具體的短期步驟，展現你的執行力和規劃能力。",
  },
]

export default function AIFeedback() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "")
  }, [])

  useEffect(() => {
    if (!username) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/ai-feedback/summary?username=${username}`)
        const data = await res.json()
        if (data.success) setSummary(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [username])

  const overallScore = summary?.combined?.overallScore ?? 0

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = "interview-feedback-report.pdf"
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">載入分析報告中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
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
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AI 分析報告
                </h1>
              </div>
            </div>
            <Button
              onClick={downloadReport}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              下載報告
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2 mb-6 border border-pink-200/50">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-pink-700">智能分析報告</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              面試練習分析報告
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              基於您的練習表現，我們為您提供了詳細的分析和改進建議
            </p>
          </div>
        </div>

        {/* 总体评分卡片 */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">整體評分</h3>
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {overallScore}
                </div>
                <div className="text-lg text-gray-600 mb-6">滿分 100 分</div>
                <Progress 
                  value={overallScore} 
                  className="h-3 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-full overflow-hidden"
                />
                <div className="mt-4 text-sm text-gray-500">
                  {overallScore >= 90 ? "優秀" : overallScore >= 80 ? "良好" : overallScore >= 70 ? "中等" : "需要改進"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 统计概览 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary?.written?.count || 0}</div>
                  <div className="text-sm text-gray-600">書面練習</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary?.video?.count || 0}</div>
                  <div className="text-sm text-gray-600">錄影練習</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {summary?.video?.avgDurationSec ? Math.round(summary.video.avgDurationSec / 60) : 0}
                  </div>
                  <div className="text-sm text-gray-600">平均時長(分鐘)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/30 shadow-lg">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              總覽
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              詳細分析
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Lightbulb className="w-4 h-4 mr-2" />
              改進建議
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                <CardHeader>
                  <CardTitle className="text-pink-600">能力雷達圖</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">清晰度</span>
                        <span className="text-sm text-gray-500">{summary?.written?.avgClarity ?? 0}/100</span>
                      </div>
                      <Progress value={summary?.written?.avgClarity ?? 0} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">誇大度（越低越好）</span>
                        <span className="text-sm text-gray-500">{summary?.written?.avgExaggeration ?? 0}/100</span>
                      </div>
                      <Progress value={100 - (summary?.written?.avgExaggeration ?? 0)} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">語速</span>
                        <span className="text-sm text-gray-500">{summary?.video?.avgSpeechRate ?? 0}/100</span>
                      </div>
                      <Progress value={summary?.video?.avgSpeechRate ?? 0} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">情緒穩定度</span>
                        <span className="text-sm text-gray-500">{summary?.video?.avgEmotionScore ?? 0}/100</span>
                      </div>
                      <Progress value={summary?.video?.avgEmotionScore ?? 0} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-100 to-green-200">
                <CardHeader>
                  <CardTitle className="text-green-600">表現亮點</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">表達流暢自然</p>
                        <p className="text-sm text-gray-600">語速適中，邏輯清晰</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">內容具體充實</p>
                        <p className="text-sm text-gray-600">回答有條理，舉例恰當</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">態度積極正面</p>
                        <p className="text-sm text-gray-600">展現學習熱忱和自信</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-orange-100 to-yellow-100">
              <CardHeader>
                <CardTitle className="text-orange-600">需要改善的地方</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">減少誇大詞彙</p>
                      <p className="text-sm text-gray-600">避免使用「非常」、「極其」等過度修飾詞</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">增加具體例證</p>
                      <p className="text-sm text-gray-600">用數據和具體事例支撐觀點</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {feedbackSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{section.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{section.score}</span>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        表現優秀
                      </h4>
                      <ul className="space-y-2">
                        {section.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        改善空間
                      </h4>
                      <ul className="space-y-2">
                        {section.improvements.map((improvement, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">具體建議</h4>
                    <p className="text-sm text-blue-800">{section.suggestions}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">語音與視覺分析報告</h3>
              <p className="text-red-100">基於您的錄影面試表現分析</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>語音特徵分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">語速控制</span>
                        <span className="text-sm text-gray-500">85/100</span>
                      </div>
                      <Progress value={85} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">語速適中，表達流暢</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">音調變化</span>
                        <span className="text-sm text-gray-500">78/100</span>
                      </div>
                      <Progress value={78} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">音調有適當起伏</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">情緒穩定性</span>
                        <span className="text-sm text-gray-500">92/100</span>
                      </div>
                      <Progress value={92} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">情緒表達自然穩定</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>視覺表現分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">眼神接觸</span>
                        <span className="text-sm text-gray-500">88/100</span>
                      </div>
                      <Progress value={88} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">眼神接觸良好</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">表情自然度</span>
                        <span className="text-sm text-gray-500">82/100</span>
                      </div>
                      <Progress value={82} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">表情自然，有親和力</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">肢體語言</span>
                        <span className="text-sm text-gray-500">75/100</span>
                      </div>
                      <Progress value={75} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">手勢適當，姿態端正</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>改善建議</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      表現優秀
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                        語速控制得當，表達清晰流暢
                      </li>
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                        情緒穩定，展現自信
                      </li>
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                        眼神接觸良好，有親和力
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      改善空間
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                        可以增加更多手勢來輔助表達
                      </li>
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                        音調變化可以更豐富一些
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
