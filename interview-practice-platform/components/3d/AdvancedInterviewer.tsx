"use client"

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Box, Cylinder, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// 高级3D头部模型组件
function AdvancedHeadModel({ isSpeaking, isMuted, emotion }: { 
  isSpeaking: boolean; 
  isMuted: boolean;
  emotion: 'neutral' | 'happy' | 'serious' | 'thinking'
}) {
  const headRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftEyebrowRef = useRef<THREE.Mesh>(null)
  const rightEyebrowRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const noseRef = useRef<THREE.Mesh>(null)
  const hairRef = useRef<THREE.Mesh>(null)
  const leftEarRef = useRef<THREE.Mesh>(null)
  const rightEarRef = useRef<THREE.Mesh>(null)
  const leftCheekRef = useRef<THREE.Mesh>(null)
  const rightCheekRef = useRef<THREE.Mesh>(null)

  // 头部自然摆动动画
  useFrame((state) => {
    if (headRef.current) {
      // 更自然的头部摆动
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.03
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02
    }
  })

  // 眨眼动画
  useFrame((state) => {
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 1.5) > 0.9 ? 0.05 : 1
      leftEyeRef.current.scale.y = blink
      rightEyeRef.current.scale.y = blink
    }
  })

  // 眉毛表情动画
  useFrame((state) => {
    if (leftEyebrowRef.current && rightEyebrowRef.current) {
      let eyebrowMovement = 0
      
      switch (emotion) {
        case 'happy':
          eyebrowMovement = -0.2
          break
        case 'serious':
          eyebrowMovement = 0.3
          break
        case 'thinking':
          eyebrowMovement = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
          break
        default:
          eyebrowMovement = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      }
      
      leftEyebrowRef.current.rotation.z = eyebrowMovement
      rightEyebrowRef.current.rotation.z = eyebrowMovement
    }
  })

  // 说话时的嘴部动画
  useFrame((state) => {
    if (mouthRef.current && isSpeaking && !isMuted) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.4
      mouthRef.current.scale.set(scale, scale, 1)
    } else if (mouthRef.current) {
      // 根据情绪调整嘴部形状
      let mouthScale = 1
      switch (emotion) {
        case 'happy':
          mouthScale = 1.2
          break
        case 'serious':
          mouthScale = 0.8
          break
        default:
          mouthScale = 1
      }
      mouthRef.current.scale.set(mouthScale, mouthScale, 1)
    }
  })

  // 鼻子轻微动画
  useFrame((state) => {
    if (noseRef.current) {
      noseRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  // 脸颊动画
  useFrame((state) => {
    if (leftCheekRef.current && rightCheekRef.current) {
      const cheekMovement = Math.sin(state.clock.elapsedTime * 0.3) * 0.01
      leftCheekRef.current.rotation.z = cheekMovement
      rightCheekRef.current.rotation.z = -cheekMovement
    }
  })

  return (
    <group>
      {/* 头部主体 */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#f1c27d" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 头发（灰白） */}
      <mesh ref={hairRef} position={[0, 0.9, 0]}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshStandardMaterial 
          color="#95a5a6" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      {/* 侧边鬓角 */}
      <mesh position={[-0.95, 0.3, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.4]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      <mesh position={[0.95, 0.3, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.4]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>

      {/* 眼睛 */}
      <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* 眼白 */}
      <mesh position={[-0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>

      {/* 瞳孔 */}
      <mesh position={[-0.3, 0.2, 0.92]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.92]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* 眉毛（灰） */}
      <mesh ref={leftEyebrowRef} position={[-0.3, 0.5, 0.8]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.3, 0.5, 0.8]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>

      {/* 眼鏡框 */}
      <mesh position={[-0.3, 0.2, 0.88]}>
        <torusGeometry args={[0.18, 0.02, 16, 32]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.88]}>
        <torusGeometry args={[0.18, 0.02, 16, 32]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* 眼鏡橋與鏡腳 */}
      <mesh position={[0, 0.2, 0.88]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[-0.55, 0.2, 0.86]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.55, 0.2, 0.86]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* 鼻子 */}
      <mesh ref={noseRef} position={[0, 0, 0.9]}>
        <cylinderGeometry args={[0.08, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#f4d03f" />
      </mesh>

      {/* 嘴巴 */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* 八字鬍 */}
      <mesh position={[-0.12, -0.18, 0.86]} rotation={[0,0,0.15]}>
        <boxGeometry args={[0.18, 0.04, 0.05]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.12, -0.18, 0.86]} rotation={[0,0,-0.15]}>
        <boxGeometry args={[0.18, 0.04, 0.05]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>

      {/* 山羊鬍/下巴鬍 */}
      <mesh position={[0, -0.55, 0.75]}>
        <coneGeometry args={[0.15, 0.25, 16]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>

      {/* 耳朵 */}
      <mesh ref={leftEarRef} position={[-1.1, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f4d03f" />
      </mesh>
      <mesh ref={rightEarRef} position={[1.1, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f4d03f" />
      </mesh>

      {/* 脸颊 */}
      <mesh ref={leftCheekRef} position={[-0.8, -0.2, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e67e22" opacity={0.3} transparent />
      </mesh>
      <mesh ref={rightCheekRef} position={[0.8, -0.2, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#e67e22" opacity={0.3} transparent />
      </mesh>

      {/* 頸部與襯衫領口、領帶 */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
      {/* 領口 */}
      <mesh position={[-0.25, -1.15, 0.2]} rotation={[0,0,0.45]}>
        <boxGeometry args={[0.35, 0.1, 0.3]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[0.25, -1.15, 0.2]} rotation={[0,0,-0.45]}>
        <boxGeometry args={[0.35, 0.1, 0.3]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      {/* 領帶 */}
      <mesh position={[0, -1.35, 0.2]}>
        <boxGeometry args={[0.14, 0.28, 0.08]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
    </group>
  )
}

// 语音波形可视化组件
function VoiceWaveform({ isSpeaking, isMuted }: { isSpeaking: boolean; isMuted: boolean }) {
  const waveformRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (waveformRef.current && isSpeaking && !isMuted) {
      waveformRef.current.children.forEach((child, index) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10 + index * 0.5) * 0.5
        child.scale.y = scale
      })
    } else if (waveformRef.current) {
      waveformRef.current.children.forEach((child) => {
        child.scale.y = 0.1
      })
    }
  })

  return (
    <group ref={waveformRef} position={[0, -1.5, 0]}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index} position={[index * 0.2 - 0.7, 0, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial 
            color={isSpeaking && !isMuted ? "#9b59b6" : "#bdc3c7"} 
            emissive={isSpeaking && !isMuted ? "#8e44ad" : "#000000"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// 环境粒子效果
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={particlesRef}>
             <bufferGeometry>
         <bufferAttribute
           attach="attributes-position"
           count={particleCount}
           array={positions}
           itemSize={3}
           args={[positions, 3]}
         />
       </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#9b59b6"
        transparent
        opacity={0.6}
      />
    </points>
  )
}

// 主3D场景
function AdvancedScene({ 
  isSpeaking, 
  isMuted, 
  message, 
  emotion 
}: { 
  isSpeaking: boolean; 
  isMuted: boolean; 
  message: string;
  emotion: 'neutral' | 'happy' | 'serious' | 'thinking'
}) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      
      {/* 主方向光 */}
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      
      {/* 补光 */}
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
      <directionalLight position={[0, -5, 5]} intensity={0.3} />
      
      {/* 点光源 */}
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#9b59b6" />
      
      {/* 3D面试官头部 */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <AdvancedHeadModel isSpeaking={isSpeaking} isMuted={isMuted} emotion={emotion} />
      </Float>
      
      {/* 语音波形 */}
      <VoiceWaveform isSpeaking={isSpeaking} isMuted={isMuted} />
      
      {/* 环境粒子 */}
      <ParticleField />
      
      {/* 控制器 */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// 主组件
interface AdvancedVirtualInterviewerProps {
  isSpeaking: boolean
  isMuted: boolean
  message: string
  onSpeak: () => void
  onToggleMute: () => void
}

export default function AdvancedVirtualInterviewer({
  isSpeaking,
  isMuted,
  message,
  onSpeak,
  onToggleMute
}: AdvancedVirtualInterviewerProps) {
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'serious' | 'thinking'>('neutral')

  // 根据消息内容调整情绪
  useEffect(() => {
    if (message.includes('很好') || message.includes('优秀') || message.includes('棒')) {
      setEmotion('happy')
    } else if (message.includes('注意') || message.includes('改进') || message.includes('问题')) {
      setEmotion('serious')
    } else if (message.includes('思考') || message.includes('分析') || message.includes('考虑')) {
      setEmotion('thinking')
    } else {
      setEmotion('neutral')
    }
  }, [message])

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 rounded-2xl overflow-hidden shadow-2xl">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          shadows
        >
          <AdvancedScene 
            isSpeaking={isSpeaking} 
            isMuted={isMuted} 
            message={message} 
            emotion={emotion}
          />
        </Canvas>
      </div>
      
      {/* 状态显示 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-white/30">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            isSpeaking ? 'bg-green-500 animate-pulse' : 
            isMuted ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          <p className="text-sm font-semibold text-gray-800">
            {isSpeaking ? "正在朗读题目" : isMuted ? "已静音" : "准备就绪"}
          </p>
        </div>
        <p className="text-xs text-gray-600 max-w-xs">{message}</p>
      </div>
      
      {/* 情绪指示器 */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/30">
        <p className="text-xs text-gray-600 mb-1">情绪状态</p>
        <p className="text-sm font-medium text-purple-600">
          {emotion === 'happy' ? '😊 开心' :
           emotion === 'serious' ? '😐 严肃' :
           emotion === 'thinking' ? '🤔 思考' : '😐 中性'}
        </p>
      </div>
      
      {/* 控制按钮 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isSpeaking ? "朗读中..." : "朗读题目"}
        </button>
        <button
          onClick={onToggleMute}
          className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isMuted ? "取消静音" : "静音"}
        </button>
      </div>
    </div>
  )
}
