"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Video, FileText, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null)
  const router = useRouter()

  const handleLogin = () => {
    if (selectedRole === "student") {
      router.push("/student/dashboard")
    } else if (selectedRole === "teacher") {
      router.push("/teacher/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">面試練習平台</h1>
          <p className="text-lg text-gray-600">選擇您的角色開始使用</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "student" ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setSelectedRole("student")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">學生</CardTitle>
              <CardDescription>練習面試技巧，獲得AI回饋</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Video className="w-4 h-4" />
                  <span>錄影面試練習</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>書面問答練習</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>AI評分與建議</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === "teacher" ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => setSelectedRole("teacher")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">教師</CardTitle>
              <CardDescription>管理學生，提供指導建議</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>檢視學生列表</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>評閱學生作品</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>AI分析輔助</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={handleLogin} disabled={!selectedRole} size="lg" className="px-8 py-3 text-lg">
            {selectedRole === "student" ? "進入學生端" : selectedRole === "teacher" ? "進入教師端" : "請選擇角色"}
          </Button>
        </div>
      </div>
    </div>
  )
}
