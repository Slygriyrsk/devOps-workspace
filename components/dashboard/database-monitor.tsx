"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, RefreshCw, Activity, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface DatabaseStats {
  status: string
  database: string | null
  collections: number
  collectionStats: Array<{
    name: string
    documentCount: number
    sampleFields?: string[]
    error?: string
  }>
  totalDocuments: number
  storageSize: number
  dataSize: number
  indexSize: number
  version?: string
  connectionInfo?: {
    connected: boolean
    lastPing: string
    responseTime: number
  }
  permissions?: {
    canReadCollections: boolean
    canGetStats: boolean
    canGetServerInfo: boolean
    adminAccess: boolean
  }
  error?: string
  troubleshooting?: {
    mongodbUri: string
    suggestion: string
    commonSolutions: string[]
  }
}

export function DatabaseMonitor() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchDatabaseStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/database/status")
      const data = await response.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch database stats:", error)
      setStats({
        status: "error",
        database: null,
        collections: 0,
        collectionStats: [],
        totalDocuments: 0,
        storageSize: 0,
        dataSize: 0,
        indexSize: 0,
        error: "Network error: Failed to connect to API",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabaseStats()
    const interval = setInterval(fetchDatabaseStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  if (isLoading && !stats) {
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
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-400">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>MongoDB Atlas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  stats?.status === "connected"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {stats?.status || "unknown"}
              </Badge>
              <Button
                onClick={fetchDatabaseStats}
                disabled={isLoading}
                size="sm"
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats?.error ? (
            <div className="space-y-4">
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{stats.error}</AlertDescription>
              </Alert>

              {stats.troubleshooting && (
                <div className="space-y-3">
                  <div className="text-yellow-400 font-medium">Troubleshooting:</div>
                  <div className="text-gray-300 text-sm">{stats.troubleshooting.suggestion}</div>

                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm font-medium">Common Solutions:</div>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {stats.troubleshooting.commonSolutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-400">•</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Connection Info */}
              {stats?.connectionInfo && (
                <Alert className="border-green-500/30 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Connected successfully • Response time: {stats.connectionInfo.responseTime}ms
                  </AlertDescription>
                </Alert>
              )}

              {/* Permissions Info */}
              {stats?.permissions && !stats.permissions.adminAccess && (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <Info className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    Limited permissions: Some advanced features may not be available
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Database</span>
                    <span className="text-white font-mono text-sm">{stats?.database || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Collections</span>
                    <span className="text-white font-mono text-sm">{stats?.collections || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Documents</span>
                    <span className="text-white font-mono text-sm">{stats?.totalDocuments?.toLocaleString() || 0}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Data Size</span>
                    <span className="text-white font-mono text-sm">{formatBytes(stats?.dataSize || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Storage</span>
                    <span className="text-white font-mono text-sm">{formatBytes(stats?.storageSize || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Index Size</span>
                    <span className="text-white font-mono text-sm">{formatBytes(stats?.indexSize || 0)}</span>
                  </div>
                </div>
              </div>

              {stats?.version && (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">MongoDB Version:</span>
                    <span className="text-white font-mono">{stats.version}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-gray-400 text-center">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Collections Details */}
      {stats?.collectionStats && stats.collectionStats.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-400">
              <Activity className="w-5 h-5" />
              <span>Collections</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {stats.collectionStats.map((collection, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{collection.name}</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {collection.documentCount.toLocaleString()} docs
                      </Badge>
                    </div>
                    {collection.sampleFields && collection.sampleFields.length > 0 && (
                      <div className="text-gray-400 text-xs">Fields: {collection.sampleFields.join(", ")}</div>
                    )}
                    {collection.error && <div className="text-red-400 text-xs">{collection.error}</div>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}