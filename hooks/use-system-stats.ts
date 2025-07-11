"use client"

import { useState, useEffect } from "react"

interface SystemStats {
  cpu: number
  memory: number
  disk: number
  uptime: string
  processes: number
  networkIn: number
  networkOut: number
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: "0h 0m",
    processes: 0,
    networkIn: 0,
    networkOut: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/system/status")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch system stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)

    return () => clearInterval(interval)
  }, [])

  return { stats, isLoading }
}
