"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Calendar, Target, Award } from "lucide-react"

interface ProgressData {
  id: number
  date: string
  structureScore: number
  speechScore: number
  confidenceScore: number
  overallScore: number
  duration: number
}

export default function ProgressPage() {
  const router = useRouter()
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      const response = await fetch('/api/self-intro/progress-history')
      const data = await response.json()
      if (data.success) {
        setProgressData(data.data)
      }
    } catch (error) {
      console.error("获取进步数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  // 模拟数据（实际应该从API获取）
  const mockData: ProgressData[] = [
    {
      id: 1,
      date: "2024-01-15",
      structureScore: 75,
      speechScore: 68,
      confidenceScore: 72,
      overallScore: 72,
      duration: 95
    },
    {
      id: 2,
      date: "2024-01-18",
      structureScore: 82,
      speechScore: 75,
      confidenceScore: 78,
      overallScore: 78,
      duration: 108
    },
    {
      id: 3,
      date: "2024-01-22",
      structureScore: 88,
      speechScore: 82,
      confidenceScore: 85,
      overallScore: 85,
      duration: 115
    }
  ]

  const displayData = progressData.length > 0 ? progressData : mockData

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 sm:h-20">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/student/dashboard")} 
              className="mr-4 sm:mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">返回儀表板</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                進步曲線
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">載入進步數據中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 總體統計 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {displayData.length}
                  </div>
                  <div className="text-sm text-gray-600">練習次數</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {displayData.length > 1 ? 
                      `+${Math.round(displayData[displayData.length - 1].overallScore - displayData[0].overallScore)}` : 
                      "0"
                    }
                  </div>
                  <div className="text-sm text-gray-600">總體進步</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {displayData.length > 0 ? 
                      Math.round(displayData[displayData.length - 1].overallScore) : 
                      "0"
                    }
                  </div>
                  <div className="text-sm text-gray-600">最新分數</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-xl rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {displayData.length > 0 ? 
                      Math.round(displayData.reduce((sum, item) => sum + item.duration, 0) / displayData.length) : 
                      "0"
                    }
                  </div>
                  <div className="text-sm text-gray-600">平均時長(秒)</div>
                </CardContent>
              </Card>
            </div>

            {/* 進步曲線圖表 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  分數趨勢圖
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4 bg-gray-50 rounded-lg">
                  {displayData.map((item, index) => (
                    <div key={item.id} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative">
                        <div 
                          className={`w-8 rounded-t-lg transition-all duration-500 ${getScoreBgColor(item.overallScore)}`}
                          style={{ height: `${(item.overallScore / 100) * 200}px` }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                          {item.overallScore}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {new Date(item.date).toLocaleDateString('zh-TW', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 詳細記錄 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-green-500" />
                  練習記錄
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {new Date(item.date).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            時長: {item.duration}秒
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">結構</div>
                          <div className={`font-bold ${getScoreColor(item.structureScore)}`}>
                            {item.structureScore}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">語音</div>
                          <div className={`font-bold ${getScoreColor(item.speechScore)}`}>
                            {item.speechScore}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">自信</div>
                          <div className={`font-bold ${getScoreColor(item.confidenceScore)}`}>
                            {item.confidenceScore}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">總分</div>
                          <div className={`font-bold text-lg ${getScoreColor(item.overallScore)}`}>
                            {item.overallScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 行動建議 */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Target className="w-5 h-5" />
                  下一步建議
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => router.push("/student/self-intro")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white"
                  >
                    🔄 繼續練習
                  </Button>
                  <Button 
                    onClick={() => router.push("/student/combined-practice")}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    📚 綜合練習
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
