"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Play, CheckCircle, XCircle, Clock, GitBranch } from "lucide-react"
import { GlitchText } from "@/components/ui/glitch-text"
import { BinaryStream } from "@/components/ui/binary-stream"

interface PipelineStage {
  id: string
  name: string
  status: "pending" | "running" | "success" | "failed" | "skipped"
  duration: number
  startTime?: string
  logs: string[]
}

interface Pipeline {
  id: string
  name: string
  branch: string
  commit: string
  status: "pending" | "running" | "success" | "failed"
  stages: PipelineStage[]
  startTime: string
  duration: number
}

export function CICDPipeline() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Initialize with some demo pipelines
    const demoPipelines: Pipeline[] = [
      {
        id: "pipeline-001",
        name: "DevOps Workspace Deploy",
        branch: "main",
        commit: "a1b2c3d",
        status: "success",
        startTime: new Date(Date.now() - 300000).toISOString(),
        duration: 245,
        stages: [
          {
            id: "build",
            name: "Build & Test",
            status: "success",
            duration: 120,
            startTime: new Date(Date.now() - 300000).toISOString(),
            logs: ["Installing dependencies...", "Running tests...", "Build successful!"],
          },
          {
            id: "security",
            name: "Security Scan",
            status: "success",
            duration: 45,
            logs: ["Scanning for vulnerabilities...", "No critical issues found"],
          },
          {
            id: "deploy",
            name: "Deploy to Production",
            status: "success",
            duration: 80,
            logs: ["Deploying to Vercel...", "Deployment successful!"],
          },
        ],
      },
      {
        id: "pipeline-002",
        name: "Feature Branch CI",
        branch: "feature/hacker-ui",
        commit: "e5f6g7h",
        status: "running",
        startTime: new Date(Date.now() - 60000).toISOString(),
        duration: 0,
        stages: [
          {
            id: "build",
            name: "Build & Test",
            status: "running",
            duration: 0,
            logs: ["Installing dependencies...", "Running unit tests..."],
          },
          {
            id: "security",
            name: "Security Scan",
            status: "pending",
            duration: 0,
            logs: [],
          },
          {
            id: "deploy",
            name: "Deploy to Staging",
            status: "pending",
            duration: 0,
            logs: [],
          },
        ],
      },
    ]

    setPipelines(demoPipelines)
  }, [])

  const runNewPipeline = () => {
    setIsRunning(true)

    const newPipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name: "Manual Trigger",
      branch: "main",
      commit: Math.random().toString(36).substring(7),
      status: "running",
      startTime: new Date().toISOString(),
      duration: 0,
      stages: [
        {
          id: "build",
          name: "Build & Test",
          status: "running",
          duration: 0,
          logs: ["Initializing build environment..."],
        },
        {
          id: "security",
          name: "Security Scan",
          status: "pending",
          duration: 0,
          logs: [],
        },
        {
          id: "deploy",
          name: "Deploy",
          status: "pending",
          duration: 0,
          logs: [],
        },
      ],
    }

    setPipelines((prev) => [newPipeline, ...prev])

    // Simulate pipeline execution
    simulatePipelineExecution(newPipeline.id)
  }

  const simulatePipelineExecution = (pipelineId: string) => {
    const stages = ["build", "security", "deploy"]
    let currentStageIndex = 0

    const executeStage = () => {
      if (currentStageIndex >= stages.length) {
        // Pipeline complete
        setPipelines((prev) =>
          prev.map((p) =>
            p.id === pipelineId
              ? {
                  ...p,
                  status: "success",
                  duration: Math.floor((Date.now() - new Date(p.startTime).getTime()) / 1000),
                }
              : p,
          ),
        )
        setIsRunning(false)
        return
      }

      const stageId = stages[currentStageIndex]
      const stageDuration = Math.random() * 3000 + 2000 // 2-5 seconds

      // Start stage
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipelineId
            ? {
                ...p,
                stages: p.stages.map((s) =>
                  s.id === stageId
                    ? {
                        ...s,
                        status: "running",
                        startTime: new Date().toISOString(),
                        logs: [...s.logs, `Starting ${s.name}...`, "Processing..."],
                      }
                    : s,
                ),
              }
            : p,
        ),
      )

      // Complete stage after duration
      setTimeout(() => {
        setPipelines((prev) =>
          prev.map((p) =>
            p.id === pipelineId
              ? {
                  ...p,
                  stages: p.stages.map((s) =>
                    s.id === stageId
                      ? {
                          ...s,
                          status: "success",
                          duration: Math.floor(stageDuration / 1000),
                          logs: [...s.logs, `${s.name} completed successfully!`],
                        }
                      : s,
                  ),
                }
              : p,
          ),
        )

        currentStageIndex++
        setTimeout(executeStage, 500) // Small delay between stages
      }, stageDuration)
    }

    executeStage()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "running":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "running":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-400">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <GlitchText text="PIPELINE MATRIX" />
            </div>
            <Button
              onClick={runNewPipeline}
              disabled={isRunning}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "EXECUTING..." : "RUN PIPELINE"}
            </Button>
          </CardTitle>
          <BinaryStream className="h-4" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="p-4 bg-gray-800 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <div className="text-white font-medium">{pipeline.name}</div>
                        <div className="text-gray-400 text-sm flex items-center space-x-2">
                          <GitBranch className="w-3 h-3" />
                          <span>{pipeline.branch}</span>
                          <span>•</span>
                          <span className="font-mono">{pipeline.commit}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(pipeline.status)}>{pipeline.status.toUpperCase()}</Badge>
                  </div>

                  <div className="space-y-3">
                    {pipeline.stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 w-32">
                          {getStatusIcon(stage.status)}
                          <span className="text-sm text-gray-300">{stage.name}</span>
                        </div>

                        <div className="flex-1">
                          {stage.status === "running" && (
                            <Progress value={Math.random() * 100} className="h-2 bg-gray-700" />
                          )}
                          {stage.status === "success" && (
                            <div className="h-2 bg-green-500/30 rounded-full">
                              <div className="h-full bg-green-500 rounded-full w-full" />
                            </div>
                          )}
                          {stage.status === "failed" && (
                            <div className="h-2 bg-red-500/30 rounded-full">
                              <div className="h-full bg-red-500 rounded-full w-3/4" />
                            </div>
                          )}
                          {stage.status === "pending" && <div className="h-2 bg-gray-700 rounded-full" />}
                        </div>

                        <div className="text-xs text-gray-400 w-16 text-right">
                          {stage.duration > 0 ? `${stage.duration}s` : stage.status === "running" ? "..." : "-"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
                    Started: {new Date(pipeline.startTime).toLocaleString()}
                    {pipeline.duration > 0 && <span className="ml-4">Duration: {pipeline.duration}s</span>}
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