"use client"

import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitchedText, setGlitchedText] = useState(text)

  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    let glitchInterval: NodeJS.Timeout

    const startGlitch = () => {
      glitchInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          const glitched = text
            .split("")
            .map((char) => {
              if (Math.random() > 0.9) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)]
              }
              return char
            })
            .join("")
          setGlitchedText(glitched)

          setTimeout(() => setGlitchedText(text), 100)
        }
      }, 200)
    }

    startGlitch()

    return () => {
      if (glitchInterval) clearInterval(glitchInterval)
    }
  }, [text])

  return <span className={`${className}`}>{glitchedText}</span>
}