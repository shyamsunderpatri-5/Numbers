"use client"

import React, { useEffect, useState } from 'react'

export const StarBackground = () => {
  const [stars, setStars] = useState<{ top: string; left: string; size: string; duration: string; delay: string }[]>([])

  useEffect(() => {
    // Generate stars only on client-side to avoid hydration mismatch
    const generatedStars = [...Array(30)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 5 + 10}s`,
      delay: `${Math.random() * 10}s`
    }))
    setStars(generatedStars)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030014]">
      {/* Nebula Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Star Particles */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white/40 rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: 0.4,
            animation: `twinkle ${star.duration} infinite ease-in-out`,
            animationDelay: star.delay
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  )
}
