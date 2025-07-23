"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (data.success) {
        // 存儲用戶名
        window.localStorage.setItem("username", username)
        if (data.role === "student") {
          router.push("/student/dashboard")
        } else if (data.role === "teacher") {
          router.push("/teacher/dashboard")
        } else {
          setError("未知身份，請聯繫管理員")
        }
      } else {
        setError(data.message || "登錄失敗")
      }
    } catch (err) {
      setError("伺服器錯誤")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 border-0">
        <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-8 tracking-tight drop-shadow">登錄</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder="用戶名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200 text-lg"
          />
          <Input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="rounded-xl border-blue-200 focus:border-blue-400 focus:ring-blue-200 text-lg"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white text-lg rounded-xl shadow" disabled={loading}>{loading ? "登錄中..." : "登錄"}</Button>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-600">還沒有帳號？</span>
          <Button variant="link" className="text-pink-600 hover:text-blue-600" onClick={() => router.push("/register")}>註冊</Button>
        </div>
      </div>
    </div>
  )
}
