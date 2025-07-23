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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">登錄</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="text"
            placeholder="用戶名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "登錄中..." : "登錄"}</Button>
        </form>
        <div className="text-center mt-4">
          還沒有帳號？
          <Button variant="link" onClick={() => router.push("/register")}>註冊</Button>
        </div>
      </div>
    </div>
  )
}
