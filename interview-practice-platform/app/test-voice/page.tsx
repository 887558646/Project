"use client"

import { useState } from 'react'
import VoiceRecognition from '@/components/VoiceRecognition'

export default function TestVoice() {
  const [transcript, setTranscript] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const handleTranscript = (text: string) => {
    setTranscript(prev => prev + text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          语音识别功能测试
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* 语音识别组件 */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">语音识别</h2>
            <VoiceRecognition
              onTranscript={handleTranscript}
              isRecording={isRecording}
              disabled={false}
            />
          </div>

          {/* 识别结果显示 */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">识别结果</h2>
            <div className="bg-gray-50 p-4 rounded-lg border min-h-[200px]">
              {transcript ? (
                <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-gray-500">开始语音识别后，识别结果将显示在这里...</p>
              )}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">使用说明：</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 点击"开始语音输入"按钮开始语音识别</li>
              <li>• 说话时请使用中文，系统会自动识别并转换为文字</li>
              <li>• 识别结果会自动添加到输入框中</li>
              <li>• 点击"停止语音输入"按钮结束识别</li>
              <li>• 需要浏览器支持语音识别功能（Chrome、Edge等）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
