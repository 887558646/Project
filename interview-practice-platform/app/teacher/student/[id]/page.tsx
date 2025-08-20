"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, User, MessageSquare, Save, BarChart3, Target, Sparkles, Video, FileText, Clock, Award } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

type WrittenAnswer = { id: number; questionId: number; answer: string; createdAt: string }
type VideoAnswer = { id: number; videoPath: string; durationSec: number; speechRate: number | null; emotionScore: number | null; createdAt: string }

export default function StudentDetail() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const userId = useMemo(() => parseInt(String(params?.id || "0"), 10), [params])
  const [activeTab, setActiveTab] = useState("video")
  const [teacherComment, setTeacherComment] = useState("")
  const [annotations, setAnnotations] = useState<{ [key: string]: string }>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ id: number; username: string } | null>(null)
  const [writtenAnswers, setWrittenAnswers] = useState<WrittenAnswer[]>([])
  const [videoAnswers, setVideoAnswers] = useState<VideoAnswer[]>([])
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teacher/review/student?userId=${userId}`)
        const data = await res.json()
        if (!cancelled && data.success) {
          setUser(data.user)
          setWrittenAnswers(data.writtenAnswers || [])
          setVideoAnswers(data.videoAnswers || [])
          setComments(data.comments || [])
        }
      } catch (e) {
        // ignore
      } finally {
        !cancelled && setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [userId])

  const handleSaveComment = async () => {
    if (!userId || !teacherComment.trim()) return
    await fetch('/api/teacher/review/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUserId: userId,
        targetType: 'written',
        comment: teacherComment,
      })
    })
    setTeacherComment("")
  }

  const handleAnnotation = (questionIndex: number, annotation: string) => {
    setAnnotations((prev) => ({
      ...prev,
      [questionIndex]: annotation,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-600">載入學生資料中...</p>
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
              onClick={() => router.push("/teacher/dashboard")} 
              className="mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回學生列表
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  {user?.username || '學生'}
                </h1>
                <p className="text-sm text-gray-600">學生 ID: {user?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2 mb-6 border border-pink-200/50">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-pink-700">學生詳情</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              學生練習評審
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              查看學生的練習表現，提供專業指導和評分
            </p>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{videoAnswers.length}</div>
                  <div className="text-sm text-gray-600">錄影練習</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{writtenAnswers.length}</div>
                  <div className="text-sm text-gray-600">書面練習</div>
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
                    {videoAnswers.reduce((sum, v) => sum + (v.durationSec || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">總練習時長(秒)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{comments.length}</div>
                  <div className="text-sm text-gray-600">教師評語</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/30 shadow-lg">
            <TabsTrigger value="video" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <Video className="w-4 h-4 mr-2" />
              錄影面試
            </TabsTrigger>
            <TabsTrigger value="written" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              書面問答
            </TabsTrigger>
            <TabsTrigger value="resume" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              備審資料
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              評語記錄
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              總覽
            </TabsTrigger>
          </TabsList>

          {/* 其他TabsContent保持不变，但需要美化样式 */}
          <TabsContent value="video" className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-100 to-red-100">
              <CardHeader>
                <CardTitle className="text-red-700">面試錄影</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {videoAnswers.length === 0 && (
                    <div className="text-sm text-gray-600">無錄影資料</div>
                  )}
                  {videoAnswers.map((v) => (
                    <div key={v.id}>
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-2">
                        <video src={v.videoPath} controls className="w-full h-full object-contain" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>總時長: {Math.max(0, v.durationSec || 0)} 秒</span>
                        <span>上傳時間: {new Date(v.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="text-blue-700">錄影表現摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{Math.round((videoAnswers.reduce((s, v) => s + (v.speechRate || 0), 0) / Math.max(1, videoAnswers.length)) || 0)}%</div>
                    <div className="text-sm text-blue-800">語速適中</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Math.round((videoAnswers.reduce((s, v) => s + (v.emotionScore || 0), 0) / Math.max(1, videoAnswers.length)) || 0)}%</div>
                    <div className="text-sm text-green-800">情緒穩定</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{videoAnswers.length}</div>
                    <div className="text-sm text-purple-800">錄影次數</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="written" className="space-y-6">
            {writtenAnswers.map((qa, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-100 to-cyan-100">
                <CardHeader>
                  <CardTitle className="text-blue-700 text-lg">題目 {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">問題ID: {qa.questionId}</p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-lg">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-pink-600 mb-2">教師註解</label>
                      <Textarea
                        placeholder="針對這個回答添加您的註解或建議..."
                        value={annotations[index] || ""}
                        onChange={(e) => handleAnnotation(index, e.target.value)}
                        className="min-h-[100px] border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" onClick={async () => {
                          if (!annotations[index]?.trim()) return
                          await fetch('/api/teacher/review/student', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ studentUserId: userId, targetType: 'written', questionId: qa.questionId, comment: annotations[index] })
                          })
                        }} className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">提交此條評語</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">學生履歷檔案</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3 text-pink-600">自傳內容</h4>
                    <div className="bg-white/80 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。
                        在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言...
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">學習歷程檔案</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <h5 className="font-medium text-sm">程式設計專題</h5>
                        <p className="text-xs text-gray-600 mt-1">開發校園活動管理系統</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">已上傳</Badge>
                      </div>
                      <div className="p-3 border rounded-lg bg-green-50">
                        <h5 className="font-medium text-sm">科學展覽作品</h5>
                        <p className="text-xs text-gray-600 mt-1">AI在教育上的應用研究</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">已上傳</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-purple-600">AI 履歷分析摘要</h4>
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
                    <label className="block text-sm font-medium text-pink-600 mb-2">履歷評語</label>
                    <Textarea placeholder="針對學生的履歷內容添加您的評語和建議..." className="min-h-[100px] border-pink-200 focus:border-pink-400 focus:ring-pink-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-100 to-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <BarChart3 className="w-5 h-5 text-pink-400" />
                    AI 評分分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-pink-600">{studentData.aiAnalysis.overallScore}</div>
                    <div className="text-blue-500">總體評分</div>
                  </div>
                  <div className="space-y-4">
                    {studentData.aiAnalysis.categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">{category.score}%</span>
                        </div>
                        <Progress value={category.score} className="h-2 bg-gradient-to-r from-pink-200 via-blue-200 to-green-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-100 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-orange-600">AI 系統建議</CardTitle>
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
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  整體評語
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="請輸入您對這位學生的整體評語和建議..."
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveComment} className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    儲存評語
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="text-blue-700">評分建議</CardTitle>
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
                      <div className="text-3xl font-bold text-pink-600">{studentData.aiAnalysis.overallScore}</div>
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
