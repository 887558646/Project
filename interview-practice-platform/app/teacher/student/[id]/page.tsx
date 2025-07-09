"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, User, MessageSquare, Save, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

const studentData = {
  id: 1,
  name: "張小明",
  school: "台北市立第一高中",
  email: "zhang.xiaoming@example.com",
  videoUrl: "/placeholder.svg?height=400&width=600",
  writtenAnswers: [
    {
      question: "請描述一次您克服困難的經歷，以及從中學到了什麼？",
      answer:
        "在高二時，我參加了學校的科學展覽競賽。當時我選擇了一個關於環保材料的研究主題，但在實驗過程中遇到了很多困難。首先是材料取得不易，其次是實驗結果與預期不符。我沒有放棄，而是重新檢視實驗設計，向老師請教，並且查閱了大量相關文獻。最終，我調整了實驗方法，成功完成了研究，並在競賽中獲得了第二名。這次經歷讓我學會了面對困難時要保持耐心和毅力，同時也要懂得尋求幫助和不斷學習。",
    },
    {
      question: "為什麼選擇這個科系？您認為自己具備哪些相關的能力或特質？",
      answer:
        "我選擇資訊工程系是因為對程式設計和科技創新有濃厚的興趣。從高一開始，我就自學了Python和Java程式語言，並且參與了學校的程式設計社團。我認為自己具備邏輯思維能力強、學習能力佳、以及團隊合作精神等特質。在社團活動中，我曾經帶領團隊開發了一個校園活動管理系統，這個經驗讓我更加確定自己適合這個領域。",
    },
  ],
  aiAnalysis: {
    overallScore: 85,
    categories: [
      { name: "真實性", score: 88 },
      { name: "具體性", score: 82 },
      { name: "一致性", score: 90 },
      { name: "誇大度", score: 15 },
    ],
    strengths: ["回答內容具體，有明確的例子支撐", "邏輯結構清晰，表達流暢", "展現了良好的學習態度和解決問題的能力"],
    improvements: ["可以增加更多量化的成果描述", "在描述個人特質時可以更加具體", "建議加入更多反思和學習心得"],
  },
}

export default function StudentDetail() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("video")
  const [teacherComment, setTeacherComment] = useState("")
  const [annotations, setAnnotations] = useState<{ [key: string]: string }>({})
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSaveComment = () => {
    // Save teacher comment logic
    console.log("Saving comment:", teacherComment)
    alert("評語已儲存！")
  }

  const handleAnnotation = (questionIndex: number, annotation: string) => {
    setAnnotations((prev) => ({
      ...prev,
      [questionIndex]: annotation,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/teacher/dashboard")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回學生列表
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{studentData.name}</h1>
                <p className="text-sm text-gray-600">{studentData.school}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="video">錄影面試</TabsTrigger>
            <TabsTrigger value="written">書面問答</TabsTrigger>
            <TabsTrigger value="resume">履歷檔案</TabsTrigger>
            <TabsTrigger value="analysis">AI 分析</TabsTrigger>
            <TabsTrigger value="feedback">教師評語</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>面試錄影</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                  <img
                    src={studentData.videoUrl || "/placeholder.svg"}
                    alt="Student interview video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      size="lg"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>總時長: 8:32</span>
                  <span>上傳時間: 2024-01-15 14:30</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>錄影表現摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-blue-800">語速適中</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">78%</div>
                    <div className="text-sm text-green-800">情緒穩定</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-purple-800">眼神接觸</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="written" className="space-y-6">
            {studentData.writtenAnswers.map((qa, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">題目 {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">{qa.question}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{qa.answer}</p>
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">教師註解</label>
                      <Textarea
                        placeholder="針對這個回答添加您的註解或建議..."
                        value={annotations[index] || ""}
                        onChange={(e) => handleAnnotation(index, e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>學生履歷檔案</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">自傳內容</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。
                        在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言...
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">學習歷程檔案</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">程式設計專題</h5>
                        <p className="text-xs text-gray-600 mt-1">開發校園活動管理系統</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">已上傳</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">科學展覽作品</h5>
                        <p className="text-xs text-gray-600 mt-1">AI在教育上的應用研究</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">已上傳</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">AI 履歷分析摘要</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">82</div>
                        <div className="text-xs text-blue-800">動機明確度</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">75</div>
                        <div className="text-xs text-green-800">邏輯結構</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">70</div>
                        <div className="text-xs text-purple-800">個人化程度</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">85</div>
                        <div className="text-xs text-orange-800">語言表達</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">履歷評語</label>
                    <Textarea placeholder="針對學生的履歷內容添加您的評語和建議..." className="min-h-[100px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    AI 評分分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-600">{studentData.aiAnalysis.overallScore}</div>
                    <div className="text-gray-600">總體評分</div>
                  </div>
                  <div className="space-y-4">
                    {studentData.aiAnalysis.categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">{category.score}%</span>
                        </div>
                        <Progress value={category.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI 系統建議</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3">表現優秀</h4>
                      <ul className="space-y-2">
                        {studentData.aiAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 mb-3">改善建議</h4>
                      <ul className="space-y-2">
                        {studentData.aiAnalysis.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  整體評語
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="請輸入您對這位學生的整體評語和建議..."
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed"
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveComment} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    儲存評語
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>評分建議</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">評分參考</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>90-100分</span>
                        <Badge className="bg-green-100 text-green-800">優秀</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>80-89分</span>
                        <Badge className="bg-blue-100 text-blue-800">良好</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>70-79分</span>
                        <Badge className="bg-orange-100 text-orange-800">普通</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>60-69分</span>
                        <Badge className="bg-red-100 text-red-800">需改善</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">AI 建議評分</h4>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{studentData.aiAnalysis.overallScore}</div>
                      <div className="text-blue-800 mt-2">基於綜合表現分析</div>
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
