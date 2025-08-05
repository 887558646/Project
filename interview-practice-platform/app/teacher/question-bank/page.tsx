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
import { ArrowLeft, Plus, Database, RefreshCw, CheckCircle, Edit, Trash2, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question: string
  hint: string
  category: string
  isActive: boolean
}

interface QuestionForm {
  question: string
  hint: string
  category: string
  isActive: boolean
}

export default function QuestionBank() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<QuestionForm>({
    question: "",
    hint: "",
    category: "academic",
    isActive: true
  })

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
      isActive: true
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      hint: question.hint,
      category: question.category,
      isActive: question.isActive
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.hint.trim()) {
      alert("請填寫完整的題目內容和提示")
      return
    }

    try {
      const url = editingQuestion 
        ? "/api/written-qa/admin/questions"
        : "/api/written-qa/admin/questions"
      
      const method = editingQuestion ? "PUT" : "POST"
      const body = editingQuestion 
        ? { ...formData, id: editingQuestion.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      if (data.success) {
        alert(`✅ ${data.message}`)
        setIsDialogOpen(false)
        fetchQuestions()
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (error) {
      console.error("操作失敗:", error)
      alert("❌ 操作失敗")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這道題目嗎？此操作不可恢復。")) {
      return
    }

    try {
      const response = await fetch(`/api/written-qa/admin/questions?id=${id}`, {
        method: "DELETE"
      })

      const data = await response.json()
      if (data.success) {
        alert(`✅ ${data.message}`)
        fetchQuestions()
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (error) {
      console.error("刪除失敗:", error)
      alert("❌ 刪除失敗")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "technical":
        return "bg-green-100 text-green-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "career":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "academic":
        return "學術類"
      case "technical":
        return "技術類"
      case "personal":
        return "個人類"
      case "career":
        return "職涯類"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <header className="bg-white/80 shadow-md border-b sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/teacher/dashboard")} className="mr-4 text-pink-600 hover:bg-pink-100">
              <ArrowLeft className="w-4 h-4 mr-2 text-pink-400" />
              返回
            </Button>
            <h1 className="text-xl font-semibold text-pink-600">題庫管理</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">資管系書面問答題庫</h2>
          <p className="text-blue-500">管理面試練習的書面問答題目</p>
        </div>

        <div className="mb-6">
          <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Database className="w-5 h-5 text-blue-500" />
                題庫統計
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-blue-800">總題數</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {questions.filter(q => q.category === "technical").length}
                  </div>
                  <div className="text-sm text-green-800">技術類</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {questions.filter(q => q.category === "academic").length}
                  </div>
                  <div className="text-sm text-purple-800">學術類</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {questions.filter(q => q.category === "personal").length}
                  </div>
                  <div className="text-sm text-orange-800">個人類</div>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {questions.filter(q => q.category === "career").length}
                  </div>
                  <div className="text-sm text-red-800">職涯類</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          <Button 
            onClick={initializeQuestionBank}
            disabled={initializing}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white"
          >
            <Database className="w-4 h-4 mr-2" />
            {initializing ? "初始化中..." : "初始化資管系題庫"}
          </Button>
          <Button 
            onClick={fetchQuestions}
            disabled={loading}
            variant="outline"
            className="border-pink-200 text-pink-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            刷新題庫
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openAddDialog}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增題目
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-pink-600">
                  {editingQuestion ? "編輯題目" : "新增題目"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    題目內容 *
                  </label>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="請輸入題目內容..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提示內容 *
                  </label>
                  <Textarea
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    placeholder="請輸入提示內容..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    題目類別 *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">學術類</SelectItem>
                      <SelectItem value="technical">技術類</SelectItem>
                      <SelectItem value="personal">個人類</SelectItem>
                      <SelectItem value="career">職涯類</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    啟用此題目
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    {editingQuestion ? "更新" : "新增"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入題庫中...</p>
          </div>
        ) : questions.length === 0 ? (
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100">
            <CardContent className="pt-8 pb-6">
              <div className="text-center">
                <Database className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-orange-700 mb-2">題庫為空</h3>
                <p className="text-orange-600 mb-4">目前沒有題目，請點擊上方按鈕初始化資管系題庫</p>
                <Button 
                  onClick={initializeQuestionBank}
                  disabled={initializing}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {initializing ? "初始化中..." : "初始化題庫"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="bg-gradient-to-br from-white via-pink-50 to-blue-50">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getCategoryColor(question.category)}>
                          {getCategoryLabel(question.category)}
                        </Badge>
                        <span className="text-sm text-gray-500">題目 {index + 1}</span>
                        {question.isActive && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {!question.isActive && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">已停用</span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {question.question}
                      </h3>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">💡 提示：</span>
                          {question.hint}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(question)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除</AlertDialogTitle>
                            <AlertDialogDescription>
                              確定要刪除這道題目嗎？此操作不可恢復。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(question.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {questions.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">題庫說明</span>
            </div>
            <div className="mt-2 text-sm text-green-600 space-y-1">
              <p>• 系統會從題庫中隨機抽取5題給學生作答</p>
              <p>• 每次進入書面問答頁面都會重新隨機抽取題目</p>
              <p>• 學生答案會自動保存到數據庫中</p>
              <p>• 教師可以在學生詳情頁面查看學生的書面問答記錄</p>
              <p>• 可以新增、編輯、刪除題目，停用的題目不會出現在學生練習中</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 