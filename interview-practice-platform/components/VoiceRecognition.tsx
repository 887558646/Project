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

  // 極簡簡轉繁（涵蓋常見面試與輸入場景）
  const convertToTraditional = (input: string): string => {
    if (!input) return input
    const map: Record<string, string> = {
      "会": "會", "为": "為", "这": "這", "听": "聽", "说": "說", "读": "讀", "写": "寫", "录": "錄", "题": "題", "问": "問",
      "术": "術", "体": "體", "发": "發", "应": "應", "后": "後", "动": "動", "学": "學", "电": "電", "台": "臺", "备": "備",
      "优": "優", "启": "啟", "绩": "績", "效": "效", "里": "裡", "联": "聯", "网": "網", "数": "數", "据": "據", "举": "舉",
      "实": "實", "现": "現", "备": "備", "构": "構", "组": "組", "计": "計", "划": "劃", "广": "廣", "杂": "雜", "习": "習",
      "间": "間", "级": "級", "显": "顯", "览": "覽", "备": "備", "简": "簡", "历": "歷", "优": "優", "链": "鏈", "财": "財",
      "务": "務", "产": "產", "务": "務", "资": "資", "构": "構", "务": "務"
    }
    return input.replace(/[会为这听说读写录题问术体发应后动学电台备优启绩效里联网数据举实现构组计划广杂习间级显览简历链财务产资]/g, (m) => map[m] || m)
  }

  useEffect(() => {
    // 檢查瀏覽器是否支援語音識別
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true)
      // @ts-ignore
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      // 優先使用 BCP-47 繁體標籤，部分瀏覽器對 zh-TW 仍可能回傳簡體
      recognitionRef.current.lang = 'cmn-Hant-TW'

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

        // 轉為繁體後再回傳/顯示
        const fullTranscript = convertToTraditional(finalTranscript + interimTranscript)
        const finalTraditional = convertToTraditional(finalTranscript)
        setTranscript(fullTranscript)
        
        // 實時回傳（包含臨時）
        if (onInterim) onInterim(fullTranscript)

        // 僅在有最終段落時，追加到輸入框
        if (finalTraditional) onTranscript(finalTraditional)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('語音識別錯誤:', event.error)
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
        您的瀏覽器不支援語音識別功能
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
      {/* 語音識別按鈕 */}
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
              停止語音輸入
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              開始語音輸入
            </>
          )}
        </button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            正在聽取語音...
          </div>
        )}
      </div>

      {/* 實時轉錄顯示 */}
      {transcript && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">語音識別結果：</span>
          </div>
          <p className="text-sm text-gray-600">{transcript}</p>
        </div>
      )}
    </div>
  )
}
