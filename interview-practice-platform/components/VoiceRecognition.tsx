"use client"

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface VoiceRecognitionProps {
  onTranscript: (text: string) => void
  isRecording: boolean
  disabled?: boolean
  // 當 active=true 並且 autoStart=true 時自動開始識別；active=false 自動停止
  active?: boolean
  autoStart?: boolean
  // 實時回傳（含臨時與最終）文本，便於右側輸入框即時顯示
  onInterim?: (text: string) => void
  // UI 風格：full 顯示按鈕與面板；minimal 僅提供引擎與微提示
  variant?: 'full' | 'minimal'
  className?: string
}

export default function VoiceRecognition({ 
  onTranscript, 
  isRecording, 
  disabled = false,
  active,
  autoStart,
  onInterim,
  variant = 'full',
  className
}: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true)
      // @ts-ignore
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'zh-TW'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setTranscript("")
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const fullTranscript = finalTranscript + interimTranscript
        setTranscript(fullTranscript)
        
        // 實時回傳（包含臨時）
        if (onInterim) onInterim(fullTranscript)

        // 僅在有最終段落時，追加到輸入框
        if (finalTranscript) onTranscript(finalTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onTranscript])

  // 根據 active/autoStart 自動開關
  useEffect(() => {
    if (!recognitionRef.current) return
    if (disabled) return
    if (active && autoStart) {
      try {
        if (!isListening) recognitionRef.current.start()
      } catch {}
    } else {
      try {
        if (isListening) recognitionRef.current.stop()
      } catch {}
    }
  }, [active, autoStart, disabled])

  const startListening = () => {
    if (recognitionRef.current && !isListening && !disabled) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className || ''}`}>
        您的浏览器不支持语音识别功能
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={className || ''}>
        {isListening && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            正在語音識別...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {/* 语音识别按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleListening}
          disabled={disabled || isRecording}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              停止语音输入
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              开始语音输入
            </>
          )}
        </button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            正在听取语音...
          </div>
        )}
      </div>

      {/* 实时转录显示 */}
      {transcript && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">语音识别结果：</span>
          </div>
          <p className="text-sm text-gray-600">{transcript}</p>
        </div>
      )}
    </div>
  )
}
