"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("通用")
  const [availableSchools, setAvailableSchools] = useState<string[]>(["通用", "台大", "清大", "交大", "政大", "成大", "中央", "中山", "中興", "台科大", "北科大"])

  useEffect(() => {
    const storedUsername = window.localStorage.getItem("username")
    setUsername(storedUsername || "")
  }, [])

  const testQuestions = async () => {
    setLoading(true)
    try {
      console.log("測試用戶名:", username, "學校:", selectedSchool)
      const response = await fetch(`/api/written-qa/questions?username=${username}&personalized=true&school=${selectedSchool}`)
      const data = await response.json()
      console.log("測試結果:", data)
      setQuestions(data.questions || [])
      
      // 獲取所有可用的學校列表
      try {
        const schoolsRes = await fetch("/api/written-qa/admin/questions")
        const schoolsData = await schoolsRes.json()
        if (schoolsData.success) {
          const schools = schoolsData.questions
            .map((q: any) => q.school)
            .filter((school: any): school is string => typeof school === 'string' && school !== "通用")
          const uniqueSchools = [...new Set(schools)]
          setAvailableSchools(["通用", ...uniqueSchools])
        }
      } catch (e) {
        // 如果獲取學校列表失敗，使用預設列表
        console.log("獲取學校列表失敗，使用預設列表")
      }
    } catch (error) {
      console.error("測試失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">題目測試頁面</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">選擇學校</label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSchools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school === "通用" ? "通用題目" : `${school}專屬`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={testQuestions} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
              {loading ? "測試中..." : "測試題目"}
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>用戶名: {username}</p>
            <p>選擇學校: {selectedSchool}</p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question: any, index: number) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">題目 {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>題目:</strong> {question.question}</p>
                  <p><strong>提示:</strong> {question.hint}</p>
                  <p><strong>分類:</strong> {question.category}</p>
                  <p><strong>學校:</strong> {question.school || "未指定"}</p>
                  {question.isPersonalized && (
                    <p className="text-green-600"><strong>個性化題目</strong></p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 