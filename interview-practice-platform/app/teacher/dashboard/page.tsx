"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Search, Video, FileText, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const students = [
  {
    id: 1,
    name: "張小明",
    school: "台北市立第一高中",
    videoStatus: "completed",
    writtenStatus: "completed",
    lastActivity: "2小時前",
    overallScore: 85,
  },
  {
    id: 2,
    name: "李小華",
    school: "新北市立中山高中",
    videoStatus: "completed",
    writtenStatus: "pending",
    lastActivity: "1天前",
    overallScore: 78,
  },
  {
    id: 3,
    name: "王小美",
    school: "桃園市立桃園高中",
    videoStatus: "pending",
    writtenStatus: "completed",
    lastActivity: "3天前",
    overallScore: null,
  },
  {
    id: 4,
    name: "陳小強",
    school: "台中市立台中一中",
    videoStatus: "completed",
    writtenStatus: "completed",
    lastActivity: "5小時前",
    overallScore: 92,
  },
  {
    id: 5,
    name: "林小雅",
    school: "高雄市立高雄女中",
    videoStatus: "completed",
    writtenStatus: "completed",
    lastActivity: "1天前",
    overallScore: 88,
  },
]

export default function TeacherDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    if (filterStatus === "completed")
      return matchesSearch && student.videoStatus === "completed" && student.writtenStatus === "completed"
    if (filterStatus === "pending")
      return matchesSearch && (student.videoStatus === "pending" || student.writtenStatus === "pending")

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">待完成</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">未開始</Badge>
    }
  }

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline">未評分</Badge>
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">{score}分</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">{score}分</Badge>
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-800">{score}分</Badge>
    return <Badge className="bg-red-100 text-red-800">{score}分</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">教師管理平台</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">王老師</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">學生管理</h2>
          <p className="text-gray-600">檢視和管理學生的面試練習進度</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">總學生數</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">已完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.videoStatus === "completed" && s.writtenStatus === "completed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">進行中</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {students.filter((s) => s.videoStatus === "pending" || s.writtenStatus === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">平均分數</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  students.filter((s) => s.overallScore).reduce((sum, s) => sum + (s.overallScore || 0), 0) /
                    students.filter((s) => s.overallScore).length,
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜尋學生姓名或學校..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  全部
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                  size="sm"
                >
                  已完成
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                  size="sm"
                >
                  待完成
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-gray-600 text-sm">{student.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">錄影面試</span>
                      </div>
                      {getStatusBadge(student.videoStatus)}
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">書面問答</span>
                      </div>
                      {getStatusBadge(student.writtenStatus)}
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">總分</span>
                      </div>
                      {getScoreBadge(student.overallScore)}
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">最後活動</span>
                      </div>
                      <span className="text-xs text-gray-500">{student.lastActivity}</span>
                    </div>

                    <Button
                      onClick={() => router.push(`/teacher/student/${student.id}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      查看詳情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到學生</h3>
                <p className="text-gray-600">請調整搜尋條件或篩選設定</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
