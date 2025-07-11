"use client"

import { useState, useEffect } from "react"

interface DockerContainer {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "paused" | "restarting"
  ports: string[]
  uptime: string
  cpu: number
  memory: number
}

export function useDockerData() {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await fetch("/api/docker/containers")
        if (response.ok) {
          const data = await response.json()
          setContainers(data)
        }
      } catch (error) {
        console.error("Failed to fetch docker data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContainers()
    const interval = setInterval(fetchContainers, 5000)

    return () => clearInterval(interval)
  }, [])

  const startContainer = async (id: string) => {
    try {
      await fetch(`/api/docker/containers/${id}/start`, { method: "POST" })
    } catch (error) {
      console.error("Failed to start container:", error)
    }
  }

  const stopContainer = async (id: string) => {
    try {
      await fetch(`/api/docker/containers/${id}/stop`, { method: "POST" })
    } catch (error) {
      console.error("Failed to stop container:", error)
    }
  }

  return { containers, isLoading, startContainer, stopContainer }
}
