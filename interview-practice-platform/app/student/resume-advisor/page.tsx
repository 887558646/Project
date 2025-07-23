"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, AlertTriangle, Lightbulb, Copy } from "lucide-react"
import { useRouter } from "next/navigation"

const sampleResume = `我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。

在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言。在社團中，我不僅學會了程式設計的基礎知識，還培養了邏輯思維能力。

我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。這個研究讓我更深入了解AI技術，也讓我確定了未來想要朝資訊工程發展的方向。

除了學術方面，我也很重視品格培養。我經常參與志工服務，幫助社區的長者學習使用智慧型手機。這些經驗讓我學會了耐心和同理心。

我相信我具備了進入資訊工程系所需的能力和熱忱。我希望能夠在大學期間繼續深造，將來為科技發展貢獻一份心力。`

const analysisResults = {
  overallScore: 78,
  categories: [
    { name: "邏輯結構", score: 75, feedback: "段落安排合理，但可加強段落間的連接" },
    { name: "動機明確度", score: 82, feedback: "對科系的興趣表達清楚，但可更具體說明選擇理由" },
    { name: "個人化程度", score: 70, feedback: "有具體經驗，但需要更多獨特的個人特色" },
    { name: "語言表達", score: 85, feedback: "用詞恰當，語句通順，表達清晰" },
  ],
  issues: [
    {
      type: "structure",
      text: "從小我就對科學充滿興趣",
      suggestion: "建議具體說明是什麼經驗或事件啟發了您對科學的興趣",
      severity: "medium",
    },
    {
      type: "vague",
      text: "積極參與各種學習活動",
      suggestion: "請具體列舉參與的活動名稱和您的角色",
      severity: "high",
    },
    {
      type: "generic",
      text: "我相信我具備了進入資訊工程系所需的能力和熱忱",
      suggestion: "建議具體說明您具備哪些能力，並提供證據支持",
      severity: "high",
    },
  ],
  suggestions: [
    {
      original: "從小我就對科學充滿興趣，特別是資訊科學領域。",
      improved:
        "國中時期接觸到第一個程式語言Scratch，看著自己設計的角色在螢幕上動起來的那一刻，我深深被程式設計的魅力所吸引。",
      reason: "具體的起始經驗更有說服力",
    },
    {
      original: "我積極參與各種學習活動。",
      improved: "三年來我擔任程式設計社副社長，主辦過兩次校內程式競賽，並帶領團隊參加全國高中生程式設計競賽獲得佳作。",
      reason: "具體的職位、活動和成果更有說服力",
    },
  ],
}

export default function ResumeAdvisor() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalysis(true)
      setActiveTab("analysis")
    }, 3000)
  }

  const loadSample = () => {
    setResumeText(sampleResume)
  }

  const applySuggestion = (improved: string) => {
    // In a real app, this would replace the text in the original content
    alert(`建議已套用：${improved}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
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
            <h1 className="text-xl font-semibold text-pink-600">履歷撰寫建議</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">AI 履歷優化助手</h2>
          <p className="text-blue-500">上傳你的自傳或學習歷程檔案，獲得專業的撰寫建議</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-pink-100 via-blue-100 to-green-100">
            <TabsTrigger value="upload">上傳文件</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!hasAnalysis}>
              分析結果
            </TabsTrigger>
            <TabsTrigger value="suggestions" disabled={!hasAnalysis}>
              改善建議
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Upload className="w-5 h-5 text-pink-400" />
                    上傳或貼上內容
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">拖拽檔案到此處或點擊上傳</p>
                    <Button variant="outline" size="sm">
                      選擇檔案
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">支援 .txt, .docx, .pdf 格式</p>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-gray-500">或</span>
                  </div>

                  <Textarea
                    placeholder="請貼上您的自傳或學習歷程內容..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] text-sm leading-relaxed"
                  />

                  <div className="flex gap-2">
                    <Button onClick={loadSample} variant="outline" size="sm" className="border-pink-200 text-pink-600">載入範例</Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!resumeText.trim() || isAnalyzing}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white"
                    >
                      {isAnalyzing ? "分析中..." : "開始分析"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
                <CardHeader>
                  <CardTitle className="text-blue-700">分析項目說明</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-medium text-blue-900">邏輯結構</h4>
                      <p className="text-sm text-blue-800 mt-1">檢查段落安排、內容組織和邏輯流暢度</p>
                    </div>
                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-medium text-green-900">動機明確度</h4>
                      <p className="text-sm text-green-800 mt-1">評估選擇科系的理由是否清晰具體</p>
                    </div>
                    <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-medium text-purple-900">個人化程度</h4>
                      <p className="text-sm text-purple-800 mt-1">分析內容的獨特性和個人特色</p>
                    </div>
                    <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                      <h4 className="font-medium text-orange-900">語言表達</h4>
                      <p className="text-sm text-orange-800 mt-1">檢查用詞準確性、語句通順度</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-100 to-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">整體評分</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600">{analysisResults.overallScore}</div>
                    <div className="text-gray-600">/ 100</div>
                  </div>
                  <div className="space-y-4">
                    {analysisResults.categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">{category.score}%</span>
                        </div>
                        <Progress value={category.score} className="h-2 mb-1" />
                        <p className="text-xs text-gray-600">{category.feedback}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-100 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-orange-700">問題標記</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResults.issues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">"{issue.text}"</p>
                          </div>
                        </div>
                        <p className="text-xs ml-6">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>原文標註</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm leading-relaxed">
                    {sampleResume.split("。").map((sentence, index) => {
                      const hasIssue = analysisResults.issues.some((issue) => sentence.includes(issue.text))
                      return (
                        <span
                          key={index}
                          className={hasIssue ? "bg-yellow-200 px-1 rounded" : ""}
                          title={hasIssue ? "點擊查看建議" : ""}
                        >
                          {sentence}
                          {index < sampleResume.split("。").length - 1 && "。"}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Lightbulb className="w-5 h-5 text-pink-400" />
                  AI 重寫建議
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysisResults.suggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">原文</h4>
                          <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                            <p className="text-sm text-red-800">{suggestion.original}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">建議改寫</h4>
                          <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                            <p className="text-sm text-green-800">{suggestion.improved}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">
                            <strong>改善理由：</strong>
                            {suggestion.reason}
                          </p>
                          <Button
                            onClick={() => applySuggestion(suggestion.improved)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            套用建議
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="text-blue-700">段落結構建議</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">建議結構</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>開頭：具體的啟發經驗或轉捩點</li>
                      <li>學習歷程：具體的活動、職位、成果</li>
                      <li>能力展現：透過實例證明相關能力</li>
                      <li>未來規劃：明確的學習目標和職涯方向</li>
                      <li>結尾：總結個人特質與科系的契合度</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">加分要素</h4>
                    <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                      <li>具體的數據和成果（如：競賽名次、專案規模）</li>
                      <li>獨特的個人經驗或觀點</li>
                      <li>展現成長和學習能力的例子</li>
                      <li>與科系相關的具體技能或知識</li>
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
