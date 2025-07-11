"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Cpu, HardDrive, MemoryStick, Network } from "lucide-react"
import { useSystemStats } from "@/hooks/use-system-stats"

export function SystemMonitor() {
  const { stats, isLoading } = useSystemStats()

  if (isLoading) {
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

  const getUsageColor = (usage: number) => {
    if (usage > 80) return "bg-red-400"
    if (usage > 60) return "bg-yellow-400"
    return "bg-green-400"
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-400">
          <Activity className="w-5 h-5" />
          <span>System Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">CPU Usage</span>
            </div>
            <span className="text-white font-mono">{stats.cpu.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(stats.cpu)}`}
              style={{ width: `${stats.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Memory</span>
            </div>
            <span className="text-white font-mono">{stats.memory.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(stats.memory)}`}
              style={{ width: `${stats.memory}%` }}
            />
          </div>
        </div>

        {/* Disk Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">Disk Space</span>
            </div>
            <span className="text-white font-mono">{stats.disk.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(stats.disk)}`}
              style={{ width: `${stats.disk}%` }}
            />
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300">Network</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">↓ In:</span>
              <span className="text-green-400 ml-2 font-mono">{formatBytes(stats.networkIn)}/s</span>
            </div>
            <div>
              <span className="text-gray-400">↑ Out:</span>
              <span className="text-blue-400 ml-2 font-mono">{formatBytes(stats.networkOut)}/s</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="pt-4 border-t border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Uptime:</span>
            <span className="text-white font-mono">{stats.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Processes:</span>
            <span className="text-white font-mono">{stats.processes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
