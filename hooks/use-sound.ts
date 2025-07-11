"use client"

import { useCallback, useRef } from "react"

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playBeep = useCallback(
    (frequency = 800, duration = 200, type: OscillatorType = "sine") => {
      const audioContext = initAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)
    },
    [initAudioContext],
  )

  const playAlertSound = useCallback(() => {
    // Red alert style sound
    playBeep(1000, 100, "square")
    setTimeout(() => playBeep(800, 100, "square"), 150)
    setTimeout(() => playBeep(1000, 100, "square"), 300)
  }, [playBeep])

  const playHackerSound = useCallback(() => {
    // Matrix-style digital sound
    playBeep(400, 50, "sawtooth")
    setTimeout(() => playBeep(600, 50, "sawtooth"), 60)
    setTimeout(() => playBeep(800, 50, "sawtooth"), 120)
    setTimeout(() => playBeep(1000, 50, "sawtooth"), 180)
  }, [playBeep])

  const playErrorSound = useCallback(() => {
    // Error beep
    playBeep(200, 300, "square")
  }, [playBeep])

  const playSuccessSound = useCallback(() => {
    // Success chime
    playBeep(523, 100, "sine") // C
    setTimeout(() => playBeep(659, 100, "sine"), 100) // E
    setTimeout(() => playBeep(784, 200, "sine"), 200) // G
  }, [playBeep])

  return {
    playBeep,
    playAlertSound,
    playHackerSound,
    playErrorSound,
    playSuccessSound,
  }
}