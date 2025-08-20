"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Search, Video, FileText, Clock, CheckCircle, Database, Target, Sparkles, BarChart3, Users, Award, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

type StudentCard = {
  id: number
  name: string
  school: string
  videoStatus: "completed" | "pending"
  writtenStatus: "completed" | "pending"
  lastActivity: string
  overallScore: number | null
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [username, setUsername] = useState("")
  const [students, setStudents] = useState<StudentCard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "")
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teacher/review/list`)
        const data = await res.json()
        if (!cancelled && data.success) {
          const mapped: StudentCard[] = (data.students || []).map((s: any) => ({
            id: s.userId,
            name: s.username,
            school: "",
            videoStatus: s.videoCount > 0 ? "completed" : "pending",
            writtenStatus: s.writtenCount > 0 ? "completed" : "pending",
            lastActivity: "—",
            overallScore: null,
          }))
          setStudents(mapped)
        }
      } catch (e) {
        // ignore
      } finally {
        !cancelled && setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

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
        return <Badge className="bg-green-100 text-green-700 border-green-200">已完成</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">待完成</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">未開始</Badge>
    }
  }

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline" className="border-gray-300 text-gray-600">未評分</Badge>
    if (score >= 90) return <Badge className="bg-green-100 text-green-700 border-green-200">{score}分</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{score}分</Badge>
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{score}分</Badge>
    return <Badge className="bg-red-100 text-red-700 border-red-200">{score}分</Badge>
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      window.localStorage.removeItem("username")
      router.push("/")
    } catch (error) {
      console.error("登出失敗:", error)
    }
  }

  const completedCount = students.filter(s => s.videoStatus === "completed" && s.writtenStatus === "completed").length
  const pendingCount = students.filter(s => s.videoStatus === "pending" || s.writtenStatus === "pending").length
  const totalCount = students.length

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
                教師管理平台
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{username || "教師"}</span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </Button>
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
              <span className="text-sm font-medium text-pink-700">學生管理</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              學生練習管理
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              查看學生練習進度，提供專業指導和評分
            </p>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-pink-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => router.push("/teacher/question-bank")}>
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">題庫管理</h3>
                  <p className="text-gray-600 mb-4">管理面試練習題庫，新增、編輯和刪除題目</p>
                  <div className="flex items-center gap-2 text-pink-600 font-medium">
                    <span>進入管理</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => router.push("/teacher/dashboard")}>
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">學生管理</h3>
                  <p className="text-gray-600 mb-4">查看學生練習進度，提供專業指導和評分</p>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <span>查看學生</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 统计概览 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
                  <div className="text-sm text-gray-600">總學生數</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
                  <div className="text-sm text-gray-600">已完成</div>
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
                  <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
                  <div className="text-sm text-gray-600">待完成</div>
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
                  <div className="text-2xl font-bold text-gray-800">
                    {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">完成率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索學生姓名或學校..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}
                >
                  全部
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                  className={filterStatus === "completed" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}
                >
                  已完成
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                  className={filterStatus === "pending" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50"}
                >
                  待完成
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 学生列表 */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Database className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-600">載入學生資料中...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">暫無學生資料</h3>
                <p className="text-gray-500">學生完成練習後將在此顯示</p>
              </CardContent>
            </Card>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.school || "學校未設定"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-500" />
                        {getStatusBadge(student.videoStatus)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        {getStatusBadge(student.writtenStatus)}
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        {getScoreBadge(student.overallScore)}
                      </div>
                      <Button
                        onClick={() => router.push(`/teacher/student/${student.id}`)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        查看詳情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}