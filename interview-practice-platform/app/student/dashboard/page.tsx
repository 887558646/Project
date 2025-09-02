"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, BarChart3, User, LogOut, Sparkles, TrendingUp, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [recent, setRecent] = useState<{ type: 'video'|'written'|'resume'|'report'; title: string; time: string }[]>([])
  
  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "")
    ;(async () => {
      try {
        const res = await fetch('/api/ai-feedback/summary')
        const data = await res.json()
        if (data.success) {
          const items: { type: 'video'|'written'|'report'; title: string; time: string }[] = []
          const latestVideo = data.video.items?.[0]
          const latestWritten = data.written.items?.[0]
          if (latestVideo) items.push({ type: 'video', title: '完成錄影面試', time: new Date(latestVideo.createdAt).toLocaleString() })
          if (latestWritten) items.push({ type: 'written', title: '提交書面問答', time: new Date(latestWritten.createdAt).toLocaleString() })
          items.push({ type: 'report', title: '獲得AI評分報告', time: new Date().toLocaleString() })
          setRecent(items)
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                面試練習平台
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{username || "用戶"}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    await fetch("/api/logout", { method: "POST" })
                  } finally {
                    window.localStorage.removeItem("username");
                    router.push("/")
                  }
                }} 
                className="border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2 text-pink-500" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Welcome Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-2 mb-6 border border-pink-200/50">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-pink-700">歡迎回來</span>
          </div>
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight">
            準備好開始練習了嗎？
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            選擇下方功能開始你的面試練習，讓AI助手幫助你提升表現
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* 備審資料撰寫建議 */}
          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-purple-700 font-bold mb-3">備審資料撰寫建議</CardTitle>
              <CardDescription className="text-sm text-purple-700">
                上傳自傳與學習歷程，獲得結構、語言與重點之專業建議
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-purple-700 mb-1">邏輯結構</div>
                  <div className="text-xs text-gray-600">分析文章邏輯性</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-purple-700 mb-1">動機明確度</div>
                  <div className="text-xs text-gray-600">評估表達清晰度</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-purple-700 mb-1">語句潤飾</div>
                  <div className="text-xs text-gray-600">提供改進建議</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-purple-700 mb-1">段落重寫</div>
                  <div className="text-xs text-gray-600">智能重構輔助</div>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/student/resume-advisor")}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 py-6"
              >
                開始優化
              </Button>
            </CardContent>
          </Card>

          {/* 自我介紹（置中） */}
          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-orange-700 font-bold mb-3">自我介紹</CardTitle>
              <CardDescription className="text-sm text-orange-700">
                由 3D 教授引導完成 2 分鐘自我介紹，語音即時轉繁體並生成個性化題目
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-orange-700 mb-1">語音輸入</div>
                  <div className="text-xs text-gray-600">自我介紹自動轉繁體</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-orange-700 mb-1">個性化題目</div>
                  <div className="text-xs text-gray-600">一鍵生成 5 題練習</div>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/student/self-intro")}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 py-6"
              >
                進入自我介紹
              </Button>
            </CardContent>
          </Card>

          {/* 綜合練習（移至右側） */}
          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Video className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-blue-700 font-bold mb-3">綜合練習</CardTitle>
              <CardDescription className="text-sm text-blue-700">
                書面與錄影同步練習，提供即時分析與練習報告
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-blue-700 mb-1">常見題目</div>
                  <div className="text-xs text-gray-600">豐富題庫資源</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-blue-700 mb-1">即時分析</div>
                  <div className="text-xs text-gray-600">語音文字同步</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-blue-700 mb-1">語氣偵測</div>
                  <div className="text-xs text-gray-600">誇大語氣提醒</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-sm font-medium text-blue-700 mb-1">邏輯提醒</div>
                  <div className="text-xs text-gray-600">跳接邏輯檢測</div>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/student/combined-practice")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 py-6"
              >
                進入綜合練習
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Report Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white rounded-3xl shadow-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <CardContent className="pt-10 pb-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">AI 分析報告</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 drop-shadow">查看你的進步趨勢</h3>
                  <p className="text-lg text-emerald-100 max-w-md leading-relaxed">
                    檢視你的面試表現分析、進步趨勢和個性化改善建議
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/student/ai-feedback")}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  size="lg"
                >
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                  查看完整報告
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">最近活動</h3>
          </div>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">暫無活動記錄</p>
                <p className="text-sm text-gray-400 mt-1">開始練習後會顯示在這裡</p>
              </div>
            ) : (
              recent.map((r, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between py-4 px-6 rounded-2xl transition-all duration-200 hover:bg-white/50 ${
                    idx < recent.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      r.type === 'video' ? 'bg-red-100' : r.type === 'written' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {r.type === 'video' ? (
                        <Video className="w-5 h-5 text-red-500" />
                      ) : r.type === 'written' ? (
                        <FileText className="w-5 h-5 text-blue-500" />
                      ) : (
                        <BarChart3 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-base font-medium text-gray-800">{r.title}</span>
                      <div className="text-sm text-gray-500 mt-1">{r.time}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {r.type === 'video' ? '錄影' : r.type === 'written' ? '書面' : '報告'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
