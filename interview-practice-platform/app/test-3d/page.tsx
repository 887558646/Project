"use client"

import { useState } from 'react'
import AdvancedVirtualInterviewer from '@/components/3d/AdvancedInterviewer'

export default function Test3D() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [message, setMessage] = useState("测试3D虚拟面试官")

  const handleSpeak = () => {
    setIsSpeaking(true)
    setMessage("正在朗读测试题目...")
    
    // 模拟语音播放
    setTimeout(() => {
      setIsSpeaking(false)
      setMessage("朗读完成，请开始回答")
    }, 3000)
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    setMessage(isMuted ? "已取消静音" : "已静音")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">
          3D虚拟面试官测试
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AdvancedVirtualInterviewer
            isSpeaking={isSpeaking}
            isMuted={isMuted}
            message={message}
            onSpeak={handleSpeak}
            onToggleMute={handleToggleMute}
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            当前状态: {isSpeaking ? "朗读中" : isMuted ? "已静音" : "准备就绪"}
          </p>
        </div>
      </div>
    </div>
  )
}
