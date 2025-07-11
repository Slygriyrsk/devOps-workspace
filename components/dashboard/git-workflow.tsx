"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitBranch, GitCommit, RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useGitData } from "@/hooks/use-git-data"

export function GitWorkflow() {
  const { branches, commits, isLoading } = useGitData()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    setLastUpdated(new Date())
  }, [branches, commits])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Branches */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-400">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>Branches</span>
            </div>
            <Button size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {branches.map((branch, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <GitBranch className={`w-4 h-4 ${branch.current ? "text-green-400" : "text-gray-400"}`} />
                    <div>
                      <div className={`font-medium ${branch.current ? "text-green-400" : "text-white"}`}>
                        {branch.name}
                        {branch.current && <span className="ml-2 text-xs">(current)</span>}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {branch.ahead > 0 && `${branch.ahead} ahead`}
                        {branch.ahead > 0 && branch.behind > 0 && ", "}
                        {branch.behind > 0 && `${branch.behind} behind`}
                      </div>
                    </div>
                  </div>
                  {branch.current && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">active</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Commits */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-400">
            <GitCommit className="w-5 h-5" />
            <span>Recent Commits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {commits.map((commit, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-sm text-blue-400">{commit.hash}</div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      {commit.branch}
                    </Badge>
                  </div>
                  <div className="text-white text-sm mb-1">{commit.message}</div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{commit.author}</span>
                    <span>{new Date(commit.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}