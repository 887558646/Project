"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, AlertTriangle, Lightbulb, Copy, Save, History, Download, RefreshCw, FileText, Target, Sparkles, BarChart3, Edit3, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import mammoth from "mammoth"

// 動態導入PDF.js，避免SSR問題
let pdfjsLib: any = null

const sampleResume = `我是張小明，來自台北市立第一高中。從小我就對科學充滿興趣，特別是資訊科學領域。

在高中三年期間，我積極參與各種學習活動。我參加了程式設計社團，學習了Python和Java程式語言。在社團中，我不僅學會了程式設計的基礎知識，還培養了邏輯思維能力。

我曾經參與學校的科學展覽，研究主題是關於人工智慧在教育上的應用。這個研究讓我更深入了解AI技術，也讓我確定了未來想要朝資訊工程發展的方向。

除了學術方面，我也很重視品格培養。我經常參與志工服務，幫助社區的長者學習使用智慧型手機。這些經驗讓我學會了耐心和同理心。

我相信我具備了進入資訊工程系所需的能力和熱忱。我希望能夠在大學期間繼續深造，將來為科技發展貢獻一份心力。`

export default function ResumeAdvisor() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalysis, setHasAnalysis] = useState(false)
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 四個AI分析結果
  const [scoreResult, setScoreResult] = useState<any>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState("")

  const [issuesResult, setIssuesResult] = useState<any>(null)
  const [issuesLoading, setIssuesLoading] = useState(false)
  const [issuesError, setIssuesError] = useState("")

  const [rewriteResult, setRewriteResult] = useState<string>("")
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteError, setRewriteError] = useState("")

  const [structureResult, setStructureResult] = useState<any>(null)
  const [structureLoading, setStructureLoading] = useState(false)
  const [structureError, setStructureError] = useState("")

  useEffect(() => {
    // 獲取用戶名
    const storedUsername = window.localStorage.getItem("username")
    setUsername(storedUsername || "")
    
    // 獲取歷史記錄
    if (storedUsername) {
      fetchHistory(storedUsername)
    }

    // 動態載入PDF.js
    const loadPDFJS = async () => {
      if (typeof window !== 'undefined') {
        const pdfjs = await import('pdfjs-dist/build/pdf')
        pdfjsLib = pdfjs
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      }
    }
    loadPDFJS()
  }, [])

  const fetchHistory = async (username: string) => {
    try {
      const response = await fetch(`/api/resume-analysis/history?username=${username}`)
      const data = await response.json()
      if (data.success) {
        setHistory(data.data)
      }
    } catch (error) {
      console.error("獲取歷史記錄失敗:", error)
    }
  }

  // 從歷史記錄載入分析結果
  const loadFromHistory = (item: any) => {
    try {
      setActiveTab("analysis")
      setResumeText(item?.originalText || "")
      setScoreResult(item?.scoreResult || null)
      setIssuesResult(item?.issuesResult || null)
      setRewriteResult(item?.rewriteResult || "")
      setStructureResult(item?.structureResult || null)
      setHasAnalysis(true)
    } catch (e) {
      console.error('載入歷史分析失敗:', e)
    }
  }

  // 依據嚴重程度回傳樣式
  const getSeverityColor = (severity?: string) => {
    const s = (severity || '').toLowerCase()
    if (s === 'high' || s === 'severe' || s === 'critical') return 'bg-red-50 border-red-200'
    if (s === 'medium' || s === 'moderate') return 'bg-amber-50 border-amber-200'
    if (s === 'low' || s === 'minor') return 'bg-green-50 border-green-200'
    return 'bg-gray-50 border-gray-200'
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setHasAnalysis(false)
    setScoreResult(null); setScoreLoading(true); setScoreError("")
    setIssuesResult(null); setIssuesLoading(true); setIssuesError("")
    setRewriteResult(""); setRewriteLoading(true); setRewriteError("")
    setStructureResult(null); setStructureLoading(true); setStructureError("")
    setActiveTab("analysis")
    
    try {
      // 分數/面向
      const scorePromise = fetch("/api/resume-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, username })
      }).then(res => res.json())

      // 問題標註
      const issuesPromise = fetch("/api/resume-issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, username })
      }).then(res => res.json())

      // 重寫建議
      const rewritePromise = fetch("/api/resume-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, username })
      }).then(res => res.json())

      // 結構分析
      const structurePromise = fetch("/api/resume-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, username })
      }).then(res => res.json())

      // 並行執行所有分析
      const [scoreData, issuesData, rewriteData, structureData] = await Promise.all([
        scorePromise, issuesPromise, rewritePromise, structurePromise
      ])

      // 處理結果
      if (scoreData.success) {
        setScoreResult(scoreData.data)
      } else {
        setScoreError(scoreData.message || "評分分析失敗")
      }

      if (issuesData.success) {
        setIssuesResult(issuesData.data)
      } else {
        setIssuesError(issuesData.message || "問題標註失敗")
      }

      if (rewriteData.success) {
        setRewriteResult(rewriteData.data)
      } else {
        setRewriteError(rewriteData.message || "重寫建議失敗")
      }

      if (structureData.success) {
        setStructureResult(structureData.data)
      } else {
        setStructureError(structureData.message || "結構分析失敗")
      }

      setHasAnalysis(true)
    } catch (error) {
      console.error("分析失敗:", error)
      setScoreError("分析過程中發生錯誤")
      setIssuesError("分析過程中發生錯誤")
      setRewriteError("分析過程中發生錯誤")
      setStructureError("分析過程中發生錯誤")
    } finally {
      setIsAnalyzing(false)
      setScoreLoading(false)
      setIssuesLoading(false)
      setRewriteLoading(false)
      setStructureLoading(false)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      let text = ""
      
      if (file.type === "text/plain") {
        text = await file.text()
      } else if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          text += textContent.items.map((item: any) => item.str).join(" ") + "\n"
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      }

      setResumeText(text)
    } catch (error) {
      console.error("檔案讀取失敗:", error)
      alert("檔案讀取失敗，請檢查檔案格式")
    }
  }

  const loadSample = () => {
    setResumeText(sampleResume)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const saveAnalysis = async () => {
    if (!username || !resumeText.trim()) return
    setSaving(true)
    try {
      const content = `【原始備審資料內容】\n${resumeText}\n\n【AI分析結果】\n整體評分：${scoreResult?.overallScore || 0}/100\n\n【重寫建議】\n${rewriteResult}\n\n【問題標註】\n${issuesResult?.map((issue: any) => `- ${issue.text}: ${issue.suggestion}`).join('\n') || '無'}`
      
      await fetch("/api/resume-analysis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          content,
          analysis: {
            score: scoreResult?.overallScore || 0,
            issues: issuesResult || [],
            rewrite: rewriteResult,
            structure: structureResult
          }
        })
      })
      
      // 重新獲取歷史記錄
      await fetchHistory(username)
    } catch (error) {
      console.error("保存失敗:", error)
    } finally {
      setSaving(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "content":
        return "bg-blue-100 text-blue-700"
      case "logic":
        return "bg-green-100 text-green-700"
      case "grammar":
        return "bg-yellow-100 text-yellow-700"
      case "format":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "content":
        return "內容問題"
      case "logic":
        return "邏輯問題"
      case "grammar":
        return "語法錯誤"
      case "format":
        return "格式問題"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center h-20">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/student/dashboard")} 
              className="mr-6 text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回儀表板
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                備審資料撰寫建議
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
              <span className="text-sm font-medium text-pink-700">AI 智能助手</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              AI 備審資料優化助手
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              上傳你的自傳或學習歷程檔案，獲得專業的撰寫建議和智能分析
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/30 shadow-lg">
            <TabsTrigger value="upload" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Upload className="w-4 h-4 mr-2" />
              上傳文件
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!hasAnalysis} className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              分析結果
            </TabsTrigger>
            <TabsTrigger value="suggestions" disabled={!hasAnalysis} className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Edit3 className="w-4 h-4 mr-2" />
              改善建議
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              歷史記錄
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 上传区域 */}
              <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100/50">
                  <CardTitle className="flex items-center gap-3 text-purple-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                    上傳或貼上內容
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-300 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">拖拽檔案到此處或點擊上傳</p>
                    <p className="text-sm text-gray-500 mb-4">支援 .txt, .pdf, .docx 格式</p>
                    <Button asChild variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      <label className="cursor-pointer">
                        選擇檔案
                        <input type="file" accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleFileChange} />
                      </label>
                    </Button>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <span className="text-sm">或</span>
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  <Textarea
                    placeholder="請貼上您的自傳或學習歷程內容..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] text-base leading-relaxed border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-xl resize-none"
                  />

                  <div className="flex gap-3">
                    <Button 
                      onClick={loadSample} 
                      variant="outline" 
                      size="lg" 
                      className="border-pink-200 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      載入範例
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!resumeText.trim() || isAnalyzing}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          分析中...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          開始分析
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 分析项目说明 */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/50">
                  <CardTitle className="flex items-center gap-3 text-blue-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    分析項目說明
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50">
                      <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        智能評分
                      </h4>
                      <p className="text-sm text-blue-600 leading-relaxed">
                        從內容深度、邏輯結構、語言表達等多個維度進行綜合評分，幫助您了解備審資料的整體品質。
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        問題標註
                      </h4>
                      <p className="text-sm text-green-600 leading-relaxed">
                        自動識別並標註內容中的問題，包括語法錯誤、邏輯問題、格式問題等，提供具體的改進建議。
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50">
                      <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        重寫建議
                      </h4>
                      <p className="text-sm text-purple-600 leading-relaxed">
                        針對問題段落提供重寫建議，保持原意的同時提升表達效果和邏輯清晰度。
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200/50">
                      <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        結構分析
                      </h4>
                      <p className="text-sm text-orange-600 leading-relaxed">
                        分析文章的整體結構，評估段落安排、邏輯流程和內容組織的合理性。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 其他TabsContent保持不变，但需要美化样式 */}
          <TabsContent value="analysis" className="space-y-6">
            {/* 分析结果内容保持不变，但需要美化样式 */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">分析結果</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={saveAnalysis}
                  disabled={saving || !hasAnalysis}
                  variant="outline"
                  className="border-green-200 text-green-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "保存中..." : "保存結果"}
                </Button>
                <Button 
                  onClick={() => router.push("/student/written-qa")}
                  disabled={!hasAnalysis}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  進入書面問答
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-100 to-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">整體評分</CardTitle>
                </CardHeader>
                <CardContent>
                  {scoreLoading && <div className="text-blue-500">AI分析中...</div>}
                  {scoreError && <div className="text-red-500">{scoreError}</div>}
                  {scoreResult && (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-purple-600">{scoreResult.overallScore}</div>
                        <div className="text-gray-600">/ 100</div>
                      </div>
                      <div className="space-y-4">
                        {scoreResult.categories?.map((category: any, index: number) => (
                          <div key={index} className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-medium text-gray-900">{category.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{category.score}%</span>
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      category.score >= 80 ? 'bg-green-500' :
                                      category.score >= 70 ? 'bg-blue-500' :
                                      category.score >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${category.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{category.feedback}</p>
                            
                            {category.strengths && Array.isArray(category.strengths) && category.strengths.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-green-700 mb-1">優點：</p>
                                <ul className="text-xs text-green-600 space-y-1 ml-4">
                                  {category.strengths.map((strength: string, i: number) => (
                                    <li key={i} className="list-disc">{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {category.weaknesses && Array.isArray(category.weaknesses) && category.weaknesses.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-red-700 mb-1">缺點：</p>
                                <ul className="text-xs text-red-600 space-y-1 ml-4">
                                  {category.weaknesses.map((weakness: string, i: number) => (
                                    <li key={i} className="list-disc">{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {category.suggestions && Array.isArray(category.suggestions) && category.suggestions.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-blue-700 mb-1">改進建議：</p>
                                <ul className="text-xs text-blue-600 space-y-1 ml-4">
                                  {category.suggestions.map((suggestion: string, i: number) => (
                                    <li key={i} className="list-disc">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-100 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-orange-700">AI 智能優化建議</CardTitle>
                </CardHeader>
                <CardContent>
                  {scoreLoading && <div className="text-blue-500">AI建議生成中...</div>}
                  {scoreError && <div className="text-red-500">{scoreError}</div>}
                  {scoreResult && scoreResult.categories && (
                    <>
                      <div className="whitespace-pre-line text-gray-800 text-base leading-relaxed mb-4">
                        {scoreResult.categories.map((cat: any, idx: number) => (
                          <div key={idx}>
                            <strong>{cat.name}：</strong> {cat.feedback}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {!scoreLoading && !scoreResult && !scoreError && (
                    <div className="text-gray-400 text-sm">請先上傳/輸入履歷並點擊「開始分析」</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>原文標註</CardTitle>
              </CardHeader>
              <CardContent>
                {issuesLoading && <div className="text-blue-500">AI標註中...</div>}
                {issuesError && <div className="text-red-500">{issuesError}</div>}
                {issuesResult && issuesResult.length > 0 ? (
                  <div className="space-y-4">
                    {issuesResult.map((issue: any, idx: number) => (
                      <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">"{issue.text}"</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(issue.category)}`}>
                                {getCategoryName(issue.category)}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                                issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {issue.severity === 'high' ? '嚴重' : issue.severity === 'medium' ? '中等' : '輕微'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{issue.suggestion}</p>
                            {issue.reason && (
                              <p className="text-xs text-gray-600 mb-2">
                                <strong>問題原因：</strong>{issue.reason}
                              </p>
                            )}
                            {issue.improved_example && (
                              <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                                <p className="text-xs text-green-700">
                                  <strong>改進範例：</strong>{issue.improved_example}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">AI未檢測到明顯問題句</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Lightbulb className="w-5 h-5 text-pink-400" />
                  AI 重寫建議
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rewriteLoading && <div className="text-blue-500">AI重寫中...</div>}
                {rewriteError && <div className="text-red-500">{rewriteError}</div>}
                {rewriteResult ? (
                  <div className="whitespace-pre-line text-gray-800 text-base leading-relaxed">
                    {rewriteResult}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">AI尚未生成重寫建議</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
              <CardHeader>
                <CardTitle className="text-blue-700">段落結構建議</CardTitle>
              </CardHeader>
              <CardContent>
                {structureLoading && <div className="text-blue-500">AI結構建議生成中...</div>}
                {structureError && <div className="text-red-500">{structureError}</div>}
                {structureResult && Array.isArray(structureResult) ? (
                  <div className="space-y-4">
                    {structureResult.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 mb-2">{item.section}</h4>
                        {item.purpose && (
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>目的：</strong>{item.purpose}
                          </p>
                        )}
                        {item.key_points && Array.isArray(item.key_points) && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">重點內容：</p>
                            <ul className="text-sm text-blue-700 space-y-1 ml-4">
                              {item.key_points.map((point: string, i: number) => (
                                <li key={i} className="list-disc">{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.writing_tips && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">撰寫技巧：</p>
                            <p className="text-sm text-blue-700">{item.writing_tips}</p>
                          </div>
                        )}
                        {item.common_mistakes && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-red-800 mb-1">常見錯誤：</p>
                            <p className="text-sm text-red-700">{item.common_mistakes}</p>
                          </div>
                        )}
                        {item.word_count && (
                          <div className="text-xs text-blue-600">
                            <strong>建議字數：</strong>{item.word_count}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">AI尚未生成段落結構建議</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  分析歷史記錄
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => loadFromHistory(item)}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">分析記錄 #{index + 1}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleString('zh-TW')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{item.overallScore}</div>
                            <div className="text-xs text-gray-500">/ 100</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.originalText.substring(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation()
                            loadFromHistory(item)
                          }}>
                            載入分析
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>暫無分析記錄</p>
                    <p className="text-sm">開始分析履歷後，結果會自動保存到這裡</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
