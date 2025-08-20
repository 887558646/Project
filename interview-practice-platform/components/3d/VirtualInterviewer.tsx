"use client"

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

// 3D头部模型组件
function HeadModel({ isSpeaking, isMuted }: { isSpeaking: boolean; isMuted: boolean }) {
  const headRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const [mouthScale, setMouthScale] = useState(1)

  // 头部轻微摆动动画
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  // 眨眼动画
  useFrame((state) => {
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 2) > 0.8 ? 0.1 : 1
      leftEyeRef.current.scale.y = blink
      rightEyeRef.current.scale.y = blink
    }
  })

  // 说话时的嘴部动画
  useFrame((state) => {
    if (mouthRef.current && isSpeaking && !isMuted) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3
      setMouthScale(scale)
      mouthRef.current.scale.set(scale, scale, 1)
    } else if (mouthRef.current) {
      setMouthScale(1)
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
      <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* 眼白 */}
      <mesh position={[-0.3, 0.2, 0.85]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.85]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>

      {/* 嘴巴 */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* 鼻子 */}
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f39c12" />
      </mesh>

      {/* 头发 */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
    </group>
  )
}

// 状态指示器
function StatusIndicator({ isSpeaking, isMuted, message }: { 
  isSpeaking: boolean; 
  isMuted: boolean; 
  message: string 
}) {
  return (
    <group position={[0, -2, 0]}>
      {/* 状态背景 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.5, 0.1]} />
        <meshStandardMaterial color={isSpeaking ? "#27ae60" : "#3498db"} />
      </mesh>
      
      {/* 状态文字 */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isSpeaking ? "正在朗读题目" : isMuted ? "已静音" : "准备就绪"}
      </Text>
      
      {/* 消息文字 */}
      <Text
        position={[0, -0.4, 0.1]}
        fontSize={0.15}
        color="#95a5a6"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {message}
      </Text>
    </group>
  )
}

// 语音波形动画
function VoiceWaveform({ isSpeaking, isMuted }: { isSpeaking: boolean; isMuted: boolean }) {
  const barsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (barsRef.current && isSpeaking && !isMuted) {
      barsRef.current.children.forEach((bar, index) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5 + index * 0.5) * 0.5
        bar.scale.y = scale
      })
    } else if (barsRef.current) {
      barsRef.current.children.forEach((bar) => {
        bar.scale.y = 0.1
      })
    }
  })

  return (
    <group ref={barsRef} position={[0, -1.5, 0]}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index} position={[(index - 3.5) * 0.3, 0, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
      ))}
    </group>
  )
}

// 主3D场景
function Scene({ isSpeaking, isMuted, message }: { 
  isSpeaking: boolean; 
  isMuted: boolean; 
  message: string 
}) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.6} />
      
      {/* 方向光 */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* 3D面试官头部 */}
      <HeadModel isSpeaking={isSpeaking} isMuted={isMuted} />
      
      {/* 状态指示器 */}
      <StatusIndicator isSpeaking={isSpeaking} isMuted={isMuted} message={message} />
      
      {/* 语音波形 */}
      <VoiceWaveform isSpeaking={isSpeaking} isMuted={isMuted} />
      
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
interface VirtualInterviewerProps {
  isSpeaking: boolean
  isMuted: boolean
  message: string
  onSpeak: () => void
  onToggleMute: () => void
}

export default function VirtualInterviewer({
  isSpeaking,
  isMuted,
  message,
  onSpeak,
  onToggleMute
}: VirtualInterviewerProps) {
  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg overflow-hidden">
        <Canvas>
          <Scene isSpeaking={isSpeaking} isMuted={isMuted} message={message} />
        </Canvas>
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
