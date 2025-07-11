"use client"

import { useEffect, useState } from "react"

interface BinaryStreamProps {
  className?: string
  speed?: number
}

export function BinaryStream({ className = "", speed = 100 }: BinaryStreamProps) {
  const [binaryString, setBinaryString] = useState("")

  useEffect(() => {
    const generateBinary = () => {
      const length = 50
      let binary = ""
      for (let i = 0; i < length; i++) {
        binary += Math.random() > 0.5 ? "1" : "0"
      }
      return binary
    }

    const interval = setInterval(() => {
      setBinaryString(generateBinary())
    }, speed)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <div className={`font-mono text-green-400 text-xs overflow-hidden ${className}`}>
      <div className="animate-pulse">{binaryString}</div>
    </div>
  )
}