"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Container, RefreshCw, Play, Square, RotateCcw, Pause, AlertTriangle } from "lucide-react"

interface DockerContainer {
  id: string
  fullId: string
  name: string
  image: string
  status: "running" | "stopped" | "paused" | "restarting"
  ports: string[]
  uptime: string
  createdAt: string
  fullStatus: string
  cpu?: number
  memoryUsage?: string
  memoryPercent?: number
}

export function DockerManager() {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchContainers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/docker/containers")
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setContainers([])
      } else {
        setContainers(data.containers || [])
        setError(null)
      }
      setLastUpdated(new Date())
    } catch (error: any) {
      setError("Failed to fetch Docker containers: " + error.message)
      setContainers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContainers()
    const interval = setInterval(fetchContainers, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleContainerAction = async (containerId: string, action: string) => {
    try {
      const response = await fetch("/api/docker/containers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ containerId, action }),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh containers after action
        setTimeout(fetchContainers, 1000)
      } else {
        setError(`Failed to ${action} container: ${result.error}`)
      }
    } catch (error: any) {
      setError(`Failed to ${action} container: ${error.message}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "stopped":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "restarting":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="w-4 h-4 text-green-400" />
      case "stopped":
        return <Square className="w-4 h-4 text-red-400" />
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-400" />
      case "restarting":
        return <RotateCcw className="w-4 h-4 text-blue-400 animate-spin" />
      default:
        return <Container className="w-4 h-4 text-gray-400" />
    }
  }

  if (isLoading && containers.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <div className="flex items-center space-x-2">
            <Container className="w-5 h-5" />
            <span>Docker Containers</span>
          </div>
          <Button
            onClick={fetchContainers}
            disabled={isLoading}
            size="sm"
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        ) : containers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Container className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Docker containers found</p>
            <p className="text-sm mt-2">Make sure Docker is running and you have containers</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {containers.map((container) => (
                <div key={container.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(container.status)}
                      <div>
                        <div className="text-white font-medium">{container.name}</div>
                        <div className="text-gray-400 text-sm">{container.image}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(container.status)}>{container.status}</Badge>
                  </div>

                  {container.ports.length > 0 && (
                    <div className="mb-2">
                      <span className="text-gray-400 text-sm">Ports: </span>
                      <span className="text-blue-400 text-sm font-mono">{container.ports.join(", ")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 text-sm">
                    <div>
                      <span className="text-gray-400">Uptime: </span>
                      <span className="text-white">{container.uptime}</span>
                    </div>
                    {container.cpu !== undefined && (
                      <div>
                        <span className="text-gray-400">CPU: </span>
                        <span className="text-green-400">{container.cpu.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  {container.memoryUsage && (
                    <div className="mb-3 text-sm">
                      <span className="text-gray-400">Memory: </span>
                      <span className="text-purple-400 font-mono">{container.memoryUsage}</span>
                      {container.memoryPercent !== undefined && (
                        <span className="text-purple-400 ml-2">({container.memoryPercent.toFixed(1)}%)</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {container.status === "stopped" && (
                      <Button
                        onClick={() => handleContainerAction(container.id, "start")}
                        size="sm"
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {container.status === "running" && (
                      <>
                        <Button
                          onClick={() => handleContainerAction(container.id, "stop")}
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                        <Button
                          onClick={() => handleContainerAction(container.id, "restart")}
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Restart
                        </Button>
                      </>
                    )}
                    <div className="text-xs text-gray-500 ml-auto">ID: {container.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="pt-4 text-xs text-gray-400 text-center border-t border-gray-700 mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()} • {containers.length} containers found
        </div>
      </CardContent>
    </Card>
  )
}