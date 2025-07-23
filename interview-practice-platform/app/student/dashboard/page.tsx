"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, BarChart3, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <header className="bg-white/80 shadow-md border-b sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-pink-600 tracking-tight drop-shadow">
              學生面試練習平台
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-700 font-medium">{username || "用戶"}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                window.localStorage.removeItem("username");
                router.push("/")
              }} className="border-pink-200">
                <LogOut className="w-4 h-4 mr-2 text-pink-400" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-pink-600 mb-2 tracking-tight">歡迎回來！</h2>
          <p className="text-lg text-blue-500">選擇下方功能開始你的面試練習</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            className="hover:shadow-2xl transition-all duration-200 cursor-pointer rounded-2xl border-0 bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-pink-200"
            onClick={() => router.push("/student/resume-advisor")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-purple-700" />
              </div>
              <CardTitle className="text-2xl text-purple-700 font-bold">履歷撰寫建議</CardTitle>
              <CardDescription className="text-purple-500">上傳自傳與學習歷程，獲得AI優化建議</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-base text-gray-600">
                <div>• 邏輯結構分析</div>
                <div>• 動機明確度評估</div>
                <div>• 語句潤飾建議</div>
                <div>• 段落重寫輔助</div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white text-lg rounded-xl shadow">
                開始優化
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-2xl transition-all duration-200 cursor-pointer rounded-2xl border-0 bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200"
            onClick={() => router.push("/student/written-qa")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-blue-700" />
              </div>
              <CardTitle className="text-2xl text-blue-700 font-bold">書面問答練習</CardTitle>
              <CardDescription className="text-cyan-600">回答面試問題，系統即時分析回答品質</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-base text-gray-600">
                <div>• 常見面試題目</div>
                <div>• 即時語言分析</div>
                <div>• 誇大語氣偵測</div>
                <div>• 邏輯跳接提醒</div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white text-lg rounded-xl shadow">
                開始作答
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-2xl transition-all duration-200 cursor-pointer rounded-2xl border-0 bg-gradient-to-br from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200"
            onClick={() => router.push("/student/video-interview")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Video className="w-8 h-8 text-red-700" />
              </div>
              <CardTitle className="text-2xl text-red-700 font-bold">錄影面試練習</CardTitle>
              <CardDescription className="text-orange-500">進行模擬面試錄影，系統同步分析語音、表情與眼神</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-base text-gray-600">
                <div>• 題目提示與引導</div>
                <div>• 語音與表情同步記錄</div>
                <div>• 眼神接觸分析</div>
                <div>• 自動上傳與AI分析</div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white text-lg rounded-xl shadow">
                開始錄影
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 mb-10">
          <Card className="bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 text-white rounded-2xl shadow-xl border-0">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 drop-shadow">查看你的 AI 分析報告</h3>
                  <p className="text-green-100">檢視你的面試表現分析、進步趨勢和改善建議</p>
                </div>
                <Button
                  onClick={() => router.push("/student/ai-feedback")}
                  className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8 py-3 text-lg rounded-xl shadow"
                  size="lg"
                >
                  <BarChart3 className="w-5 h-5 mr-2 text-pink-400" />
                  查看完整報告
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white/90 rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-pink-600 mb-6">最近活動</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-red-500" />
                <span className="text-base">完成錄影面試 - 自我介紹</span>
              </div>
              <span className="text-xs text-gray-500">2小時前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-base">提交書面問答 - 職涯規劃</span>
              </div>
              <span className="text-xs text-gray-500">1天前</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="text-base">上傳履歷 - 自傳優化</span>
              </div>
              <span className="text-xs text-gray-500">1天前</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span className="text-base">獲得AI評分報告</span>
              </div>
              <span className="text-xs text-gray-500">2天前</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
