"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, User, Lock, Shield, GraduationCap, Users, Sparkles, ArrowLeft, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password !== confirmPassword) {
      setError("兩次密碼不一致")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess("註冊成功，請登錄！")
        setTimeout(() => router.push("/"), 1200)
      } else {
        setError(data.message || "註冊失敗")
      }
    } catch (err) {
      setError("伺服器錯誤")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 注册卡片 */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              創建帳號
            </h1>
            <p className="text-gray-600">加入我們的智能面試練習平台</p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="用戶名"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="pl-10 rounded-xl border-gray-200 focus:border-pink-400 focus:ring-pink-200 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  placeholder="密碼"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-200 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  placeholder="確認密碼"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-200 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
            </div>

            {/* 身份选择 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">選擇身份：</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === "student"
                      ? "border-pink-400 bg-pink-50 shadow-md"
                      : "border-gray-200 bg-white/60 hover:border-pink-200 hover:bg-pink-25"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === "student" ? "bg-pink-500" : "bg-gray-300"
                    }`}>
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${
                        role === "student" ? "text-pink-700" : "text-gray-700"
                      }`}>
                        學生
                      </div>
                      <div className="text-xs text-gray-500">練習面試技巧</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === "teacher"
                      ? "border-blue-400 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white/60 hover:border-blue-200 hover:bg-blue-25"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === "teacher" ? "bg-blue-500" : "bg-gray-300"
                    }`}>
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${
                        role === "teacher" ? "text-blue-700" : "text-gray-700"
                      }`}>
                        教師
                      </div>
                      <div className="text-xs text-gray-500">指導學生練習</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  註冊中...
                </div>
              ) : (
                "創建帳號"
              )}
            </Button>
          </form>

          {/* 登录链接 */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>已有帳號？</span>
            </div>
            <Button 
              variant="link" 
              className="text-pink-600 hover:text-purple-600 font-medium mt-2 transition-colors duration-200" 
              onClick={() => router.push("/")}
            >
              立即登錄
            </Button>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            加入我們，開始您的面試練習之旅
          </p>
        </div>
      </div>
    </div>
  )
} 