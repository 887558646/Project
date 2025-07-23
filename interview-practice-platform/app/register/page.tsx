"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 p-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 border-0">
        <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-8 tracking-tight drop-shadow">註冊</h1>
        <form onSubmit={handleRegister} className="space-y-6">
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
          <Input
            type="password"
            placeholder="確認密碼"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl border-green-200 focus:border-green-400 focus:ring-green-200 text-lg"
          />
          <div className="flex gap-4 items-center">
            <label className="text-gray-700">身份：</label>
            <label className="flex items-center gap-1">
              <input type="radio" name="role" value="student" checked={role === "student"} onChange={() => setRole("student")} className="accent-pink-500" />
              <span className="text-pink-600 font-medium">學生</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="role" value="teacher" checked={role === "teacher"} onChange={() => setRole("teacher")} className="accent-blue-500" />
              <span className="text-blue-600 font-medium">教師</span>
            </label>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 text-white text-lg rounded-xl shadow" disabled={loading}>{loading ? "註冊中..." : "註冊"}</Button>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-600">已有帳號？</span>
          <Button variant="link" className="text-pink-600 hover:text-blue-600" onClick={() => router.push("/")}>登錄</Button>
        </div>
      </div>
    </div>
  )
} 