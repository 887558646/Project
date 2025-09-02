"use client"

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// 简单的3D头部模型
function SimpleHeadModel({ isSpeaking }: { isSpeaking: boolean }) {
  const headRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)

  // 头部摆动动画
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // 说话时的嘴部动画
  useFrame((state) => {
    if (mouthRef.current && isSpeaking) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3
      mouthRef.current.scale.set(scale, scale, 1)
    } else if (mouthRef.current) {
      mouthRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <group>
      {/* 头部 */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f4d03f" />
      </mesh>

      {/* 眼睛 */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* 嘴巴 */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* 头发 */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
    </group>
  )
}

// 主3D场景
function SimpleScene({ isSpeaking, isMuted, message }: { 
  isSpeaking: boolean; 
  isMuted: boolean; 
  message: string 
}) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.6} />
      
      {/* 方向光 */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* 3D面试官头部 */}
      <SimpleHeadModel isSpeaking={isSpeaking} />
      
      {/* 控制器 */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
    </>
  )
}

// 主组件
interface SimpleVirtualInterviewerProps {
  isSpeaking: boolean
  isMuted: boolean
  message: string
  onSpeak: () => void
  onToggleMute: () => void
}

export default function SimpleVirtualInterviewer({
  isSpeaking,
  isMuted,
  message,
  onSpeak,
  onToggleMute
}: SimpleVirtualInterviewerProps) {
  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg overflow-hidden">
        <Canvas>
          <SimpleScene isSpeaking={isSpeaking} isMuted={isMuted} message={message} />
        </Canvas>
      </div>
      
      {/* 状态显示 */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg">
        <p className="text-sm font-medium text-purple-700">
          {isSpeaking ? "正在朗读题目" : isMuted ? "已静音" : "准备就绪"}
        </p>
        <p className="text-xs text-gray-600">{message}</p>
      </div>
      
      {/* 控制按钮 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSpeaking ? "朗读中..." : "朗读题目"}
        </button>
        <button
          onClick={onToggleMute}
          className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all duration-200"
        >
          {isMuted ? "取消静音" : "静音"}
        </button>
      </div>
    </div>
  )
}
