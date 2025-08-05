"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, AlertTriangle, Lightbulb, Copy, Save, History, Download, RefreshCw, FileText } from "lucide-react"
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
        body: JSON.stringify({ resume: resumeText })
      }).then(res => res.json())
      
      // 原文標註
      const issuesPromise = fetch("/api/resume-issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText })
      }).then(res => res.json())
      
      // AI重寫建議
      const rewritePromise = fetch("/api/resume-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText })
      }).then(res => res.json())
      
      // 段落結構建議
      const structurePromise = fetch("/api/resume-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText })
      }).then(res => res.json())
      
      // 並行請求
      const [score, issues, rewrite, structure] = await Promise.all([scorePromise, issuesPromise, rewritePromise, structurePromise])
      
      if (score.success) setScoreResult(score.result); else setScoreError(score.message || "AI分析失敗")
      if (issues.success) setIssuesResult(issues.result); else setIssuesError(issues.message || "AI標註失敗")
      if (rewrite.success) setRewriteResult(rewrite.result); else setRewriteError(rewrite.message || "AI重寫失敗")
      if (structure.success) setStructureResult(structure.result); else setStructureError(structure.message || "AI結構建議失敗")
    } catch (error) {
      setScoreError("AI分析失敗"); setIssuesError("AI標註失敗"); setRewriteError("AI重寫失敗"); setStructureError("AI結構建議失敗")
    } finally {
      setIsAnalyzing(false)
      setScoreLoading(false)
      setIssuesLoading(false)
      setRewriteLoading(false)
      setStructureLoading(false)
      setHasAnalysis(true)
    }
  }

  const saveAnalysis = async () => {
    if (!username || !hasAnalysis) return

    setSaving(true)
    try {
      const response = await fetch("/api/resume-analysis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          originalText: resumeText,
          analysisResults: {
            scoreResult,
            issuesResult,
            rewriteResult,
            structureResult
          }
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert("✅ 分析結果保存成功！")
        // 刷新歷史記錄
        fetchHistory(username)
      } else {
        alert("❌ 保存失敗：" + data.message)
      }
    } catch (error) {
      console.error("保存失敗:", error)
      alert("❌ 保存失敗，請稍後重試")
    } finally {
      setSaving(false)
    }
  }

  const loadSample = () => {
    setResumeText(sampleResume)
  }

  const loadFromHistory = (historyItem: any) => {
    setResumeText(historyItem.originalText)
    setScoreResult(historyItem.scoreResult)
    setIssuesResult(historyItem.issuesResult)
    setRewriteResult(historyItem.rewriteResult)
    setStructureResult(historyItem.structureResult)
    setHasAnalysis(true)
    setActiveTab("analysis")
  }

  const handleDownloadReport = () => {
    const content = `【原始履歷內容】\n${resumeText}\n\n【AI分析結果】\n整體評分：${scoreResult?.overallScore || 0}/100\n\n【重寫建議】\n${rewriteResult}\n\n【問題標註】\n${issuesResult?.map((issue: any) => `- ${issue.text}: ${issue.suggestion}`).join('\n') || '無'}`
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `resume-analysis-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 處理txt/pdf/docx檔案上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        setResumeText(event.target?.result as string)
      }
      reader.readAsText(file, "utf-8")
    } else if (file.type === "application/pdf") {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (!pdfjsLib) {
          alert("PDF處理器尚未載入，請稍後重試")
          return
        }
        try {
          const typedarray = new Uint8Array(event.target?.result as ArrayBuffer)
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise
          let text = ""
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            text += content.items.map((item: any) => item.str).join(" ") + "\n"
          }
          setResumeText(text)
        } catch (error) {
          console.error("PDF解析失敗:", error)
          alert("PDF檔案解析失敗，請檢查檔案格式")
        }
      }
      reader.readAsArrayBuffer(file)
    } else if (file.name.endsWith(".docx")) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const result = await mammoth.extractRawText({ arrayBuffer })
          setResumeText(result.value)
        } catch (error) {
          console.error("DOCX解析失敗:", error)
          alert("DOCX檔案解析失敗，請檢查檔案格式")
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      alert("僅支援 .txt, .pdf, .docx 檔案上傳")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vague":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "empty":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "exaggerated":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "generic":
        return "text-indigo-600 bg-indigo-50 border-indigo-200"
      case "logic":
        return "text-red-600 bg-red-50 border-red-200"
      case "grammar":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "format":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "vague":
        return "模糊不清"
      case "empty":
        return "空泛內容"
      case "exaggerated":
        return "誇大描述"
      case "generic":
        return "通用表達"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/student/dashboard")} className="mr-4 text-pink-600 hover:bg-pink-100">
              <ArrowLeft className="w-4 h-4 mr-2 text-pink-400" />
              返回
            </Button>
            <h1 className="text-xl font-semibold text-pink-600">履歷撰寫建議</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">AI 履歷優化助手</h2>
          <p className="text-blue-500">上傳你的自傳或學習歷程檔案，獲得專業的撰寫建議</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-pink-100 via-blue-100 to-green-100">
            <TabsTrigger value="upload">上傳文件</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!hasAnalysis}>
              分析結果
            </TabsTrigger>
            <TabsTrigger value="suggestions" disabled={!hasAnalysis}>
              改善建議
            </TabsTrigger>
            <TabsTrigger value="history">歷史記錄</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Upload className="w-5 h-5 text-pink-400" />
                    上傳或貼上內容
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">拖拽檔案到此處或點擊上傳</p>
                    <Button asChild variant="outline" size="sm">
                      <label>
                        選擇檔案
                        <input type="file" accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={handleFileChange} />
                      </label>
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">支援 .txt, .pdf, .docx 格式</p>
                  </div>

                  <div className="text-center">
                    <span className="text-sm text-gray-500">或</span>
                  </div>

                  <Textarea
                    placeholder="請貼上您的自傳或學習歷程內容..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] text-sm leading-relaxed"
                  />

                  <div className="flex gap-2">
                    <Button onClick={loadSample} variant="outline" size="sm" className="border-pink-200 text-pink-600">載入範例</Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!resumeText.trim() || isAnalyzing}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        "開始分析"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-100 to-cyan-100">
                <CardHeader>
                  <CardTitle className="text-blue-700">分析項目說明</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-medium text-blue-900">邏輯結構</h4>
                      <p className="text-sm text-blue-800 mt-1">檢查段落安排、內容組織和邏輯流暢度</p>
                    </div>
                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-medium text-green-900">動機明確度</h4>
                      <p className="text-sm text-green-800 mt-1">評估選擇科系的理由是否清晰具體</p>
                    </div>
                    <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-medium text-purple-900">個人化程度</h4>
                      <p className="text-sm text-purple-800 mt-1">分析內容的獨特性和個人特色</p>
                    </div>
                    <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                      <h4 className="font-medium text-orange-900">語言表達</h4>
                      <p className="text-sm text-orange-800 mt-1">檢查用詞準確性、語句通順度</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
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
                  onClick={handleDownloadReport}
                  disabled={!hasAnalysis}
                  variant="outline"
                  className="border-blue-200 text-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下載報告
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
                                {getCategoryLabel(issue.category)}
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
