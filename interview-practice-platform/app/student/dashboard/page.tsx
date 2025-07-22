"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, BarChart3, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">學生面試練習平台</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">張同學</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">歡迎回來！</h2>
          <p className="text-gray-600">選擇下方功能開始您的面試練習</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/student/resume-advisor")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">履歷撰寫建議</CardTitle>
              <CardDescription>上傳自傳與學習歷程，獲得AI優化建議</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 邏輯結構分析</div>
                <div>• 動機明確度評估</div>
                <div>• 語句潤飾建議</div>
                <div>• 段落重寫輔助</div>
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">開始優化</Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/student/written-qa")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">書面問答練習</CardTitle>
              <CardDescription>回答面試問題，系統將即時分析回答品質</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 常見面試題目</div>
                <div>• 即時語言分析</div>
                <div>• 誇大語氣偵測</div>
                <div>• 邏輯跳接提醒</div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">開始作答</Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/student/video-interview")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">錄影面試練習</CardTitle>
              <CardDescription>進行模擬面試錄影，系統將同步分析語音、表情與眼神</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 題目提示與引導</div>
                <div>• 語音與表情同步記錄</div>
                <div>• 眼神接觸分析</div>
                <div>• 自動上傳與AI分析</div>
              </div>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">開始錄影</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">查看您的 AI 分析報告</h3>
                  <p className="text-green-100">檢視您的面試表現分析、進步趨勢和改善建議</p>
                </div>
                <Button
                  onClick={() => router.push("/student/ai-feedback")}
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3"
                  size="lg"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  查看完整報告
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活動</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-red-500" />
                <span className="text-sm">完成錄影面試 - 自我介紹</span>
              </div>
              <span className="text-xs text-gray-500">2小時前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm">提交書面問答 - 職涯規劃</span>
              </div>
              <span className="text-xs text-gray-500">1天前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="text-sm">上傳履歷 - 自傳優化</span>
              </div>
              <span className="text-xs text-gray-500">1天前</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span className="text-sm">獲得AI評分報告</span>
              </div>
              <span className="text-xs text-gray-500">2天前</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
