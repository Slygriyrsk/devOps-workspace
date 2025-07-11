"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HackerTerminal } from "@/components/dashboard/hacker-terminal";
import { SystemMonitor } from "@/components/dashboard/system-monitor";
import { DatabaseMonitor } from "@/components/dashboard/database-monitor";
import { GitWorkflow } from "@/components/dashboard/git-workflow";
import { DockerManager } from "@/components/dashboard/docker-manager";
import { CICDPipeline } from "@/components/dashboard/cicd-pipeline";
import { GitBranch, Database, Container, Activity, Shield } from "lucide-react";
import { MatrixRain } from "@/components/ui/matrix-rain";
import { GlitchText } from "@/components/ui/glitch-text";
import { BinaryStream } from "@/components/ui/binary-stream";

export default function DevOpsWorkspace() {
  return (
    <div className="min-h-screen bg-gray-950 text-green-400 p-4 relative overflow-hidden">
      <MatrixRain className="opacity-5" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-green-400 animate-pulse" />
              <h1 className="text-2xl font-bold text-white">
                <GlitchText text="CYBER DEVOPS COMMAND CENTER" />
              </h1>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              CLASSIFIED
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <BinaryStream className="w-32" />
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-sm text-gray-400">NEURAL LINK ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HackerTerminal />
          </div>
          <div>
            <SystemMonitor />
          </div>
        </div>

        {/* Dynamic Tabs */}
        <Tabs defaultValue="git" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
            <TabsTrigger
              value="git"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              GIT NEURAL NET
            </TabsTrigger>
            <TabsTrigger
              value="cicd"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Activity className="w-4 h-4 mr-2" />
              PIPELINE MATRIX
            </TabsTrigger>
            <TabsTrigger
              value="docker"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Container className="w-4 h-4 mr-2" />
              CONTAINER GRID
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Database className="w-4 h-4 mr-2" />
              DATA VAULT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="git" className="space-y-4">
            <GitWorkflow />
          </TabsContent>

          <TabsContent value="cicd" className="space-y-4">
            <CICDPipeline />
          </TabsContent>

          <TabsContent value="docker" className="space-y-4">
            <DockerManager />
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <DatabaseMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}