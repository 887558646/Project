"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Database, RefreshCw, CheckCircle, Edit, Trash2, Save, X, Target, Sparkles, BookOpen, Settings, Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  hint: string
  category: string
  school?: string
  isActive: boolean
}

interface QuestionForm {
  question: string
  hint: string
  category: string
  school: string
  isActive: boolean
}

export default function QuestionBank() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterSchool, setFilterSchool] = useState("all")
  const [formData, setFormData] = useState<QuestionForm>({
    question: "",
    hint: "",
    category: "academic",
    school: "通用",
    isActive: true
  })
  const [customSchool, setCustomSchool] = useState("")
  const [showCustomSchool, setShowCustomSchool] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/written-qa/admin/questions")
      const data = await response.json()
      if (data.success) {
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error("獲取題庫失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  const initializeQuestionBank = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/written-qa/admin/seed", {
        method: "POST"
      })
      const data = await response.json()
      if (data.success) {
        alert(`✅ ${data.message}`)
        fetchQuestions()
      } else {
        alert("❌ 初始化失敗")
      }
    } catch (error) {
      console.error("初始化失敗:", error)
      alert("❌ 初始化失敗")
    } finally {
      setInitializing(false)
    }
  }

  const openAddDialog = () => {
    setEditingQuestion(null)
    setFormData({
      question: "",
      hint: "",
      category: "academic",
      school: "通用",
      isActive: true
    })
    setCustomSchool("")
    setShowCustomSchool(false)
    setIsDialogOpen(true)
  }

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      hint: question.hint,
      category: question.category,
      school: question.school || "通用",
      isActive: question.isActive
    })
    // 檢查是否為自定義學校
    const predefinedSchools = ["通用", "台大", "清大", "交大", "政大", "成大", "中央", "中山", "中興", "台科大", "北科大"]
    if (question.school && !predefinedSchools.includes(question.school)) {
      setCustomSchool(question.school)
      setShowCustomSchool(true)
    } else {
      setCustomSchool("")
      setShowCustomSchool(false)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.hint.trim()) {
      alert("請填寫完整資訊")
      return
    }

    // 處理自定義學校
    let finalSchool = formData.school
    if (showCustomSchool && customSchool.trim()) {
      finalSchool = customSchool.trim()
    } else if (showCustomSchool && !customSchool.trim()) {
      alert("請輸入學校名稱")
      return
    }

    try {
      const url = editingQuestion 
        ? `/api/written-qa/admin/questions/${editingQuestion.id}`
        : "/api/written-qa/admin/questions"
      
      const method = editingQuestion ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          school: finalSchool
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert(editingQuestion ? "✅ 更新成功" : "✅ 新增成功")
        setIsDialogOpen(false)
        fetchQuestions()
      } else {
        alert("❌ 操作失敗")
      }
    } catch (error) {
      console.error("操作失敗:", error)
      alert("❌ 操作失敗")
    }
  }

  const handleDelete = async (questionId: number) => {
    try {
      const response = await fetch(`/api/written-qa/admin/questions/${questionId}`, {
        method: "DELETE"
      })
      const data = await response.json()
      if (data.success) {
        alert("✅ 刪除成功")
        fetchQuestions()
      } else {
        alert("❌ 刪除失敗")
      }
    } catch (error) {
      console.error("刪除失敗:", error)
      alert("❌ 刪除失敗")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "personal":
        return "bg-green-100 text-green-700 border-green-200"
      case "career":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "motivation":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "academic":
        return "學術"
      case "personal":
        return "個人"
      case "career":
        return "職涯"
      case "motivation":
        return "動機"
      default:
        return category
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.hint.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || question.category === filterCategory
    const matchesSchool = filterSchool === "all" || question.school === filterSchool
    return matchesSearch && matchesCategory && matchesSchool
  })

  const activeCount = questions.filter(q => q.isActive).length
  const inactiveCount = questions.filter(q => !q.isActive).length
  const totalCount = questions.length

  // 去重後的自定義學校清單（避免下拉重複）
  const predefinedSchools = ["通用", "台大", "清大", "交大", "政大", "成大", "中央", "中山", "中興", "台科大", "北科大"]
  const customSchools = Array.from(new Set(
    questions
      .map(q => q.school)
      .filter((s): s is string => !!s && !predefinedSchools.includes(s))
  )).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center h-20">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/teacher/dashboard")} 
              className="mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回儀表板
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                題庫管理
              </h1>
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
              <span className="text-sm font-medium text-pink-700">題庫管理</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              面試題庫管理
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              管理面試練習題庫，新增、編輯和刪除題目
            </p>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
                  <div className="text-sm text-gray-600">總題目數</div>
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
                  <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
                  <div className="text-sm text-gray-600">啟用中</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{inactiveCount}</div>
                  <div className="text-sm text-gray-600">已停用</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">啟用率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作栏 */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索題目內容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分類</SelectItem>
                    <SelectItem value="academic">學術</SelectItem>
                    <SelectItem value="personal">個人</SelectItem>
                    <SelectItem value="career">職涯</SelectItem>
                    <SelectItem value="motivation">動機</SelectItem>
                  </SelectContent>
                </Select>
                                 <Select value={filterSchool} onValueChange={setFilterSchool}>
                   <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl">
                     <SelectValue placeholder="選擇學校" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">全部學校</SelectItem>
                     <SelectItem value="通用">通用</SelectItem>
                     <SelectItem value="台大">台大</SelectItem>
                     <SelectItem value="清大">清大</SelectItem>
                     <SelectItem value="交大">交大</SelectItem>
                     <SelectItem value="政大">政大</SelectItem>
                     <SelectItem value="成大">成大</SelectItem>
                     <SelectItem value="中央">中央</SelectItem>
                     <SelectItem value="中山">中山</SelectItem>
                     <SelectItem value="中興">中興</SelectItem>
                     <SelectItem value="台科大">台科大</SelectItem>
                     <SelectItem value="北科大">北科大</SelectItem>
                     {/* 動態添加自定義學校選項（唯一） */}
                     {customSchools.map((name) => (
                       <SelectItem key={`custom-${name}`} value={name}>
                         {name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={initializeQuestionBank}
                  disabled={initializing}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all duration-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${initializing ? 'animate-spin' : ''}`} />
                  {initializing ? "初始化中..." : "初始化題庫"}
                </Button>
                <Button
                  onClick={openAddDialog}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增題目
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 题目列表 */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Database className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-600">載入題庫中...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">暫無題目</h3>
                <p className="text-gray-500">點擊「新增題目」開始建立題庫</p>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`${getCategoryColor(question.category)}`}>
                          {getCategoryName(question.category)}
                        </Badge>
                        {question.school && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {question.school}
                          </Badge>
                        )}
                        <Badge className={question.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                          {question.isActive ? "啟用" : "停用"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-relaxed">
                        {question.question}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {question.hint}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => openEditDialog(question)}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除</AlertDialogTitle>
                            <AlertDialogDescription>
                              確定要刪除這個題目嗎？此操作無法復原。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl">
                              取消
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(question.id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                              確認刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 新增/编辑对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {editingQuestion ? "編輯題目" : "新增題目"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">題目內容</label>
                <Textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="請輸入題目內容..."
                  className="min-h-[100px] border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">提示說明</label>
                <Textarea
                  value={formData.hint}
                  onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                  placeholder="請輸入提示說明..."
                  className="min-h-[80px] border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分類</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">學術</SelectItem>
                      <SelectItem value="personal">個人</SelectItem>
                      <SelectItem value="career">職涯</SelectItem>
                      <SelectItem value="motivation">動機</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">學校</label>
                   {showCustomSchool ? (
                     <div className="space-y-2">
                       <Input
                         value={customSchool}
                         onChange={(e) => setCustomSchool(e.target.value)}
                         placeholder="請輸入學校名稱..."
                         className="border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
                       />
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           setShowCustomSchool(false)
                           setFormData({ ...formData, school: "通用" })
                         }}
                         className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg"
                       >
                         選擇預設學校
                       </Button>
                     </div>
                   ) : (
                     <div className="space-y-2">
                       <Select 
                         value={formData.school} 
                         onValueChange={(value) => {
                           if (value === "custom") {
                             setShowCustomSchool(true)
                             setFormData({ ...formData, school: "" })
                           } else {
                             setFormData({ ...formData, school: value })
                           }
                         }}
                       >
                         <SelectTrigger className="border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="通用">通用</SelectItem>
                           <SelectItem value="台大">台大</SelectItem>
                           <SelectItem value="清大">清大</SelectItem>
                           <SelectItem value="交大">交大</SelectItem>
                           <SelectItem value="政大">政大</SelectItem>
                           <SelectItem value="成大">成大</SelectItem>
                           <SelectItem value="中央">中央</SelectItem>
                           <SelectItem value="中山">中山</SelectItem>
                           <SelectItem value="中興">中興</SelectItem>
                           <SelectItem value="台科大">台科大</SelectItem>
                           <SelectItem value="北科大">北科大</SelectItem>
                           <SelectItem value="custom">其他學校（自定義）</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   )}
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                  <Select value={formData.isActive ? "active" : "inactive"} onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}>
                    <SelectTrigger className="border-gray-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">啟用</SelectItem>
                      <SelectItem value="inactive">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingQuestion ? "更新" : "新增"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 