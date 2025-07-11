// // // "use client"

// // // import { useState, useEffect } from "react"
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // import { TerminalComponent } from "@/components/dashboard/terminal"
// // // import { SystemMonitor } from "@/components/dashboard/system-monitor"
// // // import { Terminal, GitBranch, Database, Container, Activity } from "lucide-react"

// // // const terminalCommands = [
// // //   "$ git clone https://github.com/user/awesome-app.git",
// // //   "$ cd awesome-app",
// // //   "$ npm install",
// // //   "$ docker build -t awesome-app .",
// // //   "$ docker-compose up -d",
// // //   "$ npm run dev",
// // //   "✓ Server running on http://localhost:3000",
// // //   "✓ MongoDB connected successfully",
// // //   "✓ All tests passed",
// // // ]

// // // const gitWorkflow = [
// // //   { step: "Feature Branch", command: "git checkout -b feature/user-auth", status: "completed" },
// // //   { step: "Development", command: "git add . && git commit -m 'Add authentication'", status: "completed" },
// // //   { step: "Push Branch", command: "git push origin feature/user-auth", status: "completed" },
// // //   { step: "Pull Request", command: "Create PR on GitHub", status: "in-progress" },
// // //   { step: "Code Review", command: "Team review & approval", status: "pending" },
// // //   { step: "Merge to Main", command: "git merge feature/user-auth", status: "pending" },
// // // ]

// // // const cicdStages = [
// // //   { name: "Build", status: "success", duration: "2m 34s" },
// // //   { name: "Test", status: "success", duration: "1m 12s" },
// // //   { name: "Security Scan", status: "success", duration: "45s" },
// // //   { name: "Deploy Staging", status: "running", duration: "1m 05s" },
// // //   { name: "Integration Tests", status: "pending", duration: "-" },
// // //   { name: "Deploy Production", status: "pending", duration: "-" },
// // // ]

// // // const dockerContainers = [
// // //   { name: "awesome-app-web", status: "running", port: "3000:3000", uptime: "2h 15m" },
// // //   { name: "awesome-app-db", status: "running", port: "27017:27017", uptime: "2h 15m" },
// // //   { name: "awesome-app-redis", status: "running", port: "6379:6379", uptime: "2h 15m" },
// // //   { name: "awesome-app-nginx", status: "running", port: "80:80", uptime: "2h 15m" },
// // // ]

// // // export default function DevOpsWorkspace() {
// // //   const [currentCommand, setCurrentCommand] = useState(0)
// // //   const [terminalOutput, setTerminalOutput] = useState<string[]>([])

// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       if (currentCommand < terminalCommands.length) {
// // //         setTerminalOutput((prev) => [...prev, terminalCommands[currentCommand]])
// // //         setCurrentCommand((prev) => prev + 1)
// // //       }
// // //     }, 2000)

// // //     return () => clearInterval(interval)
// // //   }, [currentCommand])

// // //   const getStatusIcon = (status: string) => {
// // //     switch (status) {
// // //       case "success":
// // //       case "completed":
// // //         return <Terminal className="w-4 h-4 text-green-400" />
// // //       case "running":
// // //       case "in-progress":
// // //         return <Activity className="w-4 h-4 text-yellow-400 animate-spin" />
// // //       case "failed":
// // //         return <Database className="w-4 h-4 text-red-400" />
// // //       default:
// // //         return <Container className="w-4 h-4 text-gray-400" />
// // //     }
// // //   }

// // //   const getStatusColor = (status: string) => {
// // //     switch (status) {
// // //       case "success":
// // //       case "completed":
// // //         return "bg-green-500/20 text-green-400 border-green-500/30"
// // //       case "running":
// // //       case "in-progress":
// // //         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
// // //       case "failed":
// // //         return "bg-red-500/20 text-red-400 border-red-500/30"
// // //       default:
// // //         return "bg-gray-500/20 text-gray-400 border-gray-500/30"
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-950 text-green-400 p-4">
// // //       <div className="max-w-7xl mx-auto space-y-6">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between">
// // //           <div className="flex items-center space-x-4">
// // //             <div className="flex items-center space-x-2">
// // //               <Terminal className="w-8 h-8 text-green-400" />
// // //               <h1 className="text-2xl font-bold text-white">Dynamic DevOps Workspace</h1>
// // //             </div>
// // //           </div>
// // //           <div className="flex items-center space-x-2">
// // //             <div className="flex items-center space-x-1">
// // //               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
// // //               <span className="text-sm text-gray-400">Live System</span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Main Dashboard */}
// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //           <div className="lg:col-span-2">
// // //             <TerminalComponent />
// // //           </div>
// // //           <div>
// // //             <SystemMonitor />
// // //           </div>
// // //         </div>

// // //         {/* Dynamic Tabs */}
// // //         <Tabs defaultValue="git" className="w-full">
// // //           <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
// // //             <TabsTrigger value="git" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
// // //               <GitBranch className="w-4 h-4 mr-2" />
// // //               Git Live
// // //             </TabsTrigger>
// // //             <TabsTrigger
// // //               value="cicd"
// // //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// // //             >
// // //               <Activity className="w-4 h-4 mr-2" />
// // //               CI/CD Live
// // //             </TabsTrigger>
// // //             <TabsTrigger
// // //               value="docker"
// // //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// // //             >
// // //               <Container className="w-4 h-4 mr-2" />
// // //               Docker Live
// // //             </TabsTrigger>
// // //             <TabsTrigger
// // //               value="database"
// // //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// // //             >
// // //               <Database className="w-4 h-4 mr-2" />
// // //               DB Live
// // //             </TabsTrigger>
// // //           </TabsList>

// // //           <TabsContent value="git" className="space-y-4">
// // //             <div className="text-center py-8 text-gray-400">
// // //               <GitBranch className="w-12 h-12 mx-auto mb-4" />
// // //               <p>Real Git integration will be implemented with live branch data</p>
// // //             </div>
// // //           </TabsContent>

// // //           <TabsContent value="cicd" className="space-y-4">
// // //             <div className="text-center py-8 text-gray-400">
// // //               <Activity className="w-12 h-12 mx-auto mb-4" />
// // //               <p>Live CI/CD pipeline status will be shown here</p>
// // //             </div>
// // //           </TabsContent>

// // //           <TabsContent value="docker" className="space-y-4">
// // //             <div className="text-center py-8 text-gray-400">
// // //               <Container className="w-12 h-12 mx-auto mb-4" />
// // //               <p>Real Docker container management interface</p>
// // //             </div>
// // //           </TabsContent>

// // //           <TabsContent value="database" className="space-y-4">
// // //             <div className="text-center py-8 text-gray-400">
// // //               <Database className="w-12 h-12 mx-auto mb-4" />
// // //               <p>Live MongoDB Atlas connection and query interface</p>
// // //             </div>
// // //           </TabsContent>
// // //         </Tabs>
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // "use client"

// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Badge } from "@/components/ui/badge"
// // import { TerminalComponent } from "@/components/dashboard/terminal"
// // import { SystemMonitor } from "@/components/dashboard/system-monitor"
// // import { DatabaseMonitor } from "@/components/dashboard/database-monitor"
// // import { GitWorkflow } from "@/components/dashboard/git-workflow"
// // import { Terminal, GitBranch, Database, Container, Activity } from "lucide-react"

// // export default function DevOpsWorkspace() {
// //   return (
// //     <div className="min-h-screen bg-gray-950 text-green-400 p-4">
// //       <div className="max-w-7xl mx-auto space-y-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <div className="flex items-center space-x-2">
// //               <Terminal className="w-8 h-8 text-green-400" />
// //               <h1 className="text-2xl font-bold text-white">DevOps Workspace</h1>
// //             </div>
// //             <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live System</Badge>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <div className="flex items-center space-x-1">
// //               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
// //               <span className="text-sm text-gray-400">System Online</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main Dashboard */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           <div className="lg:col-span-2">
// //             <TerminalComponent />
// //           </div>
// //           <div>
// //             <SystemMonitor />
// //           </div>
// //         </div>

// //         {/* Dynamic Tabs */}
// //         <Tabs defaultValue="git" className="w-full">
// //           <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
// //             <TabsTrigger value="git" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
// //               <GitBranch className="w-4 h-4 mr-2" />
// //               Git Live
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="cicd"
// //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// //             >
// //               <Activity className="w-4 h-4 mr-2" />
// //               CI/CD Live
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="docker"
// //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// //             >
// //               <Container className="w-4 h-4 mr-2" />
// //               Docker Live
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="database"
// //               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
// //             >
// //               <Database className="w-4 h-4 mr-2" />
// //               MongoDB Live
// //             </TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="git" className="space-y-4">
// //             <GitWorkflow />
// //           </TabsContent>

// //           <TabsContent value="cicd" className="space-y-4">
// //             <div className="text-center py-8 text-gray-400">
// //               <Activity className="w-12 h-12 mx-auto mb-4" />
// //               <p>CI/CD Pipeline integration coming soon...</p>
// //             </div>
// //           </TabsContent>

// //           <TabsContent value="docker" className="space-y-4">
// //             <div className="text-center py-8 text-gray-400">
// //               <Container className="w-12 h-12 mx-auto mb-4" />
// //               <p>Docker container management interface</p>
// //             </div>
// //           </TabsContent>

// //           <TabsContent value="database" className="space-y-4">
// //             <DatabaseMonitor />
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { HackerTerminal } from "@/components/dashboard/hacker-terminal"
// import { SystemMonitor } from "@/components/dashboard/system-monitor"
// import { DatabaseMonitor } from "@/components/dashboard/database-monitor"
// import { GitWorkflow } from "@/components/dashboard/git-workflow"
// import { DockerManager } from "@/components/dashboard/docker-manager"
// import { GitBranch, Database, Container, Activity, Shield } from "lucide-react"
// import { MatrixRain } from "@/components/ui/matrix-rain"
// import { GlitchText } from "@/components/ui/glitch-text"
// import { BinaryStream } from "@/components/ui/binary-stream"

// export default function DevOpsWorkspace() {
//   return (
//     <div className="min-h-screen bg-gray-950 text-green-400 p-4 relative overflow-hidden">
//       <MatrixRain className="opacity-5" />

//       <div className="max-w-7xl mx-auto space-y-6 relative z-10">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <Shield className="w-8 h-8 text-green-400 animate-pulse" />
//               <h1 className="text-2xl font-bold text-white">
//                 <GlitchText text="CYBER DEVOPS COMMAND CENTER" />
//               </h1>
//             </div>
//             <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">CLASSIFIED</Badge>
//           </div>
//           <div className="flex items-center space-x-4">
//             <BinaryStream className="w-32" />
//             <div className="flex items-center space-x-1">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
//               <span className="text-sm text-gray-400">NEURAL LINK ACTIVE</span>
//             </div>
//           </div>
//         </div>

//         {/* Main Dashboard */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <HackerTerminal />
//           </div>
//           <div>
//             <SystemMonitor />
//           </div>
//         </div>

//         {/* Dynamic Tabs */}
//         <Tabs defaultValue="git" className="w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
//             <TabsTrigger value="git" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
//               <GitBranch className="w-4 h-4 mr-2" />
//               GIT NEURAL NET
//             </TabsTrigger>
//             <TabsTrigger
//               value="cicd"
//               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
//             >
//               <Activity className="w-4 h-4 mr-2" />
//               PIPELINE MATRIX
//             </TabsTrigger>
//             <TabsTrigger
//               value="docker"
//               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
//             >
//               <Container className="w-4 h-4 mr-2" />
//               CONTAINER GRID
//             </TabsTrigger>
//             <TabsTrigger
//               value="database"
//               className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
//             >
//               <Database className="w-4 h-4 mr-2" />
//               DATA VAULT
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="git" className="space-y-4">
//             <GitWorkflow />
//           </TabsContent>

//           <TabsContent value="cicd" className="space-y-4">
//             <div className="text-center py-8 text-gray-400">
//               <Activity className="w-12 h-12 mx-auto mb-4 animate-spin" />
//               <GlitchText text="CI/CD NEURAL NETWORK INITIALIZING..." />
//             </div>
//           </TabsContent>

//           <TabsContent value="docker" className="space-y-4">
//             <DockerManager />
//           </TabsContent>

//           <TabsContent value="database" className="space-y-4">
//             <DatabaseMonitor />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HackerTerminal } from "@/components/dashboard/hacker-terminal"
import { SystemMonitor } from "@/components/dashboard/system-monitor"
import { DatabaseMonitor } from "@/components/dashboard/database-monitor"
import { GitWorkflow } from "@/components/dashboard/git-workflow"
import { DockerManager } from "@/components/dashboard/docker-manager"
import { CICDPipeline } from "@/components/dashboard/cicd-pipeline"
import { GitBranch, Database, Container, Activity, Shield } from "lucide-react"
import { MatrixRain } from "@/components/ui/matrix-rain"
import { GlitchText } from "@/components/ui/glitch-text"
import { BinaryStream } from "@/components/ui/binary-stream"

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
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">CLASSIFIED</Badge>
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
            <TabsTrigger value="git" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
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
  )
}