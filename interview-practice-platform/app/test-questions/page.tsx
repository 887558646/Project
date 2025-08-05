"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const storedUsername = window.localStorage.getItem("username")
    setUsername(storedUsername || "")
  }, [])

  const testQuestions = async () => {
    setLoading(true)
    try {
      console.log("測試用戶名:", username)
      const response = await fetch(`/api/written-qa/questions?username=${username}&personalized=true`)
      const data = await response.json()
      console.log("測試結果:", data)
      setQuestions(data.questions || [])
    } catch (error) {
      console.error("測試失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">測試個性化問題功能</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>測試信息</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>當前用戶名:</strong> {username || "未設置"}</p>
            <Button onClick={testQuestions} disabled={loading} className="mt-4">
              {loading ? "測試中..." : "測試個性化問題"}
            </Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>獲取到的題目 ({questions.length} 題)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((q: any, index: number) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">題目 {index + 1}</span>
                      {q.isPersonalized && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          個性化
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 mb-2">{q.question}</p>
                    <p className="text-sm text-gray-600">提示: {q.hint}</p>
                    {q.reason && (
                      <p className="text-xs text-blue-600 mt-1">緣由: {q.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 