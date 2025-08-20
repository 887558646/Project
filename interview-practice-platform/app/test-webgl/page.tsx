"use client"

import { Canvas } from '@react-three/fiber'

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function TestWebGL() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          WebGL 基础测试
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Box />
            </Canvas>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            如果看到一个橙色的立方体，说明WebGL和Three.js工作正常
          </p>
        </div>
      </div>
    </div>
  )
}
