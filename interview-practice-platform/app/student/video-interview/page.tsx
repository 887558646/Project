"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Video, Square, Play, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const questions = [
  "請簡單介紹一下自己",
  "為什麼想要申請這個科系？",
  "您認為自己最大的優點是什麼？",
  "遇到困難時，您通常如何解決？",
  "對於未來有什麼規劃？",
]

export default function VideoInterview() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [speechRate, setSpeechRate] = useState(85)
  const [emotionScore, setEmotionScore] = useState(78)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        // Simulate real-time analysis
        setSpeechRate(Math.floor(Math.random() * 20) + 75)
        setEmotionScore(Math.floor(Math.random() * 30) + 70)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsRecording(false)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      stopRecording()
    } else {
      // All questions completed
      router.push("/student/ai-feedback")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
            <h1 className="text-xl font-semibold text-pink-600">錄影面試</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-pink-600">題目 {currentQuestion + 1} / {questions.length}</h2>
            <div className="text-sm text-blue-500">預計時間：2-3分鐘</div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-4 bg-gradient-to-r from-pink-200 via-blue-200 to-green-200" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-orange-100 to-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Video className="w-5 h-5 text-orange-400" />
                  錄影區域
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>點擊開始錄影以啟用攝影機</p>
                      </div>
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      REC {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      開始錄影
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      停止錄影
                    </Button>
                  )}

                  <Button
                    onClick={nextQuestion}
                    disabled={!isRecording && recordingTime === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {currentQuestion === questions.length - 1 ? "完成面試" : "下一題"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="text-blue-700">面試題目</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-blue-900">{questions[currentQuestion]}</p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>💡 建議：</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>保持自然的語調</li>
                    <li>適當的眼神接觸</li>
                    <li>回答時間控制在2-3分鐘</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">即時分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">語速分析</span>
                    <span className="text-sm text-gray-500">{speechRate} 字/分</span>
                  </div>
                  <Progress value={speechRate} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {speechRate > 90 ? "語速稍快" : speechRate < 70 ? "語速稍慢" : "語速適中"}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">情緒穩定度</span>
                    <span className="text-sm text-gray-500">{emotionScore}%</span>
                  </div>
                  <Progress value={emotionScore} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {emotionScore > 80 ? "表現自然" : emotionScore < 60 ? "稍顯緊張" : "狀態良好"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
