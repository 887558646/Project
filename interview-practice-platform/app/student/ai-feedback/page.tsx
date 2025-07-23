"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useRouter } from "next/navigation"

const radarData = [
  { category: "真實性", score: 85, maxScore: 100 },
  { category: "具體性", score: 78, maxScore: 100 },
  { category: "一致性", score: 92, maxScore: 100 },
  { category: "誇大度", score: 25, maxScore: 100, reverse: true }, // Lower is better
]

const progressData = [
  { date: "2024-01-15", score: 72 },
  { date: "2024-01-22", score: 76 },
  { date: "2024-01-29", score: 81 },
  { date: "2024-02-05", score: 85 },
]

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

  const overallScore = Math.round(
    radarData.reduce((sum, item) => sum + (item.reverse ? 100 - item.score : item.score), 0) / radarData.length,
  )

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = "interview-feedback-report.pdf"
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/student/dashboard")} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <h1 className="text-xl font-semibold text-pink-600">AI 評分報告</h1>
            </div>
            <Button onClick={downloadReport} className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
              <Download className="w-4 h-4 mr-2 text-pink-200" />
              下載報告
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-pink-100">整體評分</h2>
                <p className="text-blue-100">基於您的面試表現綜合分析</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-pink-200">{overallScore}</div>
                <div className="text-blue-100">/ 100</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-pink-100 via-blue-100 to-green-100">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="detailed">詳細分析</TabsTrigger>
            <TabsTrigger value="video">語音視覺</TabsTrigger>
            <TabsTrigger value="written">文字分析</TabsTrigger>
            <TabsTrigger value="progress">進步追蹤</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                <CardHeader>
                  <CardTitle className="text-pink-600">能力雷達圖</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {radarData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm text-gray-500">
                            {item.reverse ? 100 - item.score : item.score}/100
                          </span>
                        </div>
                        <Progress value={item.reverse ? 100 - item.score : item.score} className="h-3" />
                      </div>
                    ))}
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

          <TabsContent value="detailed" className="space-y-6">
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

          <TabsContent value="video" className="space-y-6">
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

          <TabsContent value="written" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">文字回答分析報告</h3>
              <p className="text-blue-100">基於您的書面問答表現分析</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>內容品質評估</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">誇大度控制</span>
                        <span className="text-sm text-gray-500">75/100</span>
                      </div>
                      <Progress value={75} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">適度使用修飾詞</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">具體性</span>
                        <span className="text-sm text-gray-500">82/100</span>
                      </div>
                      <Progress value={82} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">回答具體，有例證支撐</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">一致性</span>
                        <span className="text-sm text-gray-500">90/100</span>
                      </div>
                      <Progress value={90} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">前後邏輯一致</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">語意結構</span>
                        <span className="text-sm text-gray-500">78/100</span>
                      </div>
                      <Progress value={78} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">結構清晰，層次分明</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>逐句分析標註</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">優秀句子</span>
                      </div>
                      <p className="text-sm text-green-700">"通過參與三個程式設計專案，我學會了團隊協作的重要性"</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">需要改善</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        "我非常熱愛程式設計" → 建議改為 "我對程式設計有濃厚興趣"
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">建議補充</span>
                      </div>
                      <p className="text-sm text-blue-700">可以增加具體的學習成果或獲得的技能</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  分數趨勢
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-500">{data.date}</div>
                      <div className="flex-1">
                        <Progress value={data.score} className="h-3" />
                      </div>
                      <div className="w-12 text-sm font-medium">{data.score}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">進步幅度：+13分</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">相較於首次測試，您的整體表現有顯著提升！</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>練習建議</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">短期改善目標</h4>
                    <div className="space-y-3">
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                        <h5 className="font-medium text-blue-900">語言表達</h5>
                        <p className="text-sm text-blue-800 mt-1">練習使用更精確的詞彙，避免模糊和誇大的表達方式</p>
                      </div>
                      <div className="p-3 border-l-4 border-green-500 bg-green-50">
                        <h5 className="font-medium text-green-900">具體化描述</h5>
                        <p className="text-sm text-green-800 mt-1">在回答中加入具體的數據、時間和成果，增強說服力</p>
                      </div>
                      <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                        <h5 className="font-medium text-purple-900">結構化思考</h5>
                        <p className="text-sm text-purple-800 mt-1">使用STAR法則（情況、任務、行動、結果）組織回答</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">練習方法</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          1
                        </div>
                        <div>
                          <p className="font-medium">每日練習</p>
                          <p className="text-sm text-gray-600">每天練習一個面試問題，錄音自我檢視</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          2
                        </div>
                        <div>
                          <p className="font-medium">模擬面試</p>
                          <p className="text-sm text-gray-600">與朋友或家人進行模擬面試，獲得即時反饋</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          3
                        </div>
                        <div>
                          <p className="font-medium">案例準備</p>
                          <p className="text-sm text-gray-600">準備3-5個具體的個人經歷案例，適用不同問題</p>
                        </div>
                      </div>
                    </div>
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
