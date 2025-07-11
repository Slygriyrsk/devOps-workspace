// // import { NextResponse } from "next/server"
// // import { exec } from "child_process"
// // import { promisify } from "util"

// // const execAsync = promisify(exec)

// // interface DockerContainer {
// //   id: string
// //   fullId: string
// //   name: string
// //   image: string
// //   status: "running" | "stopped" | "paused" | "restarting"
// //   ports: string[]
// //   uptime: string
// //   createdAt: string
// //   fullStatus: string
// //   cpu?: number
// //   memoryUsage?: string
// //   memoryPercent?: number
// // }

// // export async function GET() {
// //   try {
// //     // Check if Docker is available
// //     try {
// //       await execAsync("docker --version")
// //     } catch (error) {
// //       return NextResponse.json(
// //         {
// //           error: "Docker is not installed or not running",
// //           containers: [],
// //           dockerAvailable: false,
// //           suggestion: "Install Docker Desktop and make sure it's running",
// //         },
// //         { status: 200 },
// //       )
// //     }

// //     try {
// //       // Get all containers (running and stopped)
// //       const { stdout } = await execAsync(
// //         'docker ps -a --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.CreatedAt}}"',
// //       )

// //       if (!stdout.trim()) {
// //         return NextResponse.json({
// //           containers: [],
// //           totalContainers: 0,
// //           runningContainers: 0,
// //           dockerAvailable: true,
// //           message: "No Docker containers found",
// //         })
// //       }

// //       const containers: DockerContainer[] = stdout
// //         .split("\n")
// //         .filter((line) => line.trim())
// //         .map((line) => {
// //           const [id, name, image, status, ports, createdAt] = line.split("|")

// //           const isRunning = status.toLowerCase().includes("up")
// //           const isPaused = status.toLowerCase().includes("paused")
// //           const isRestarting = status.toLowerCase().includes("restarting")

// //           let containerStatus: "running" | "stopped" | "paused" | "restarting" = "stopped"
// //           if (isRestarting) containerStatus = "restarting"
// //           else if (isPaused) containerStatus = "paused"
// //           else if (isRunning) containerStatus = "running"

// //           const container: DockerContainer = {
// //             id: id?.substring(0, 12) || "unknown",
// //             fullId: id || "unknown",
// //             name: name || "unnamed",
// //             image: image || "unknown",
// //             status: containerStatus,
// //             ports: ports
// //               ? ports
// //                   .split(",")
// //                   .map((p) => p.trim())
// //                   .filter((p) => p)
// //               : [],
// //             uptime: extractUptime(status),
// //             createdAt: createdAt || new Date().toISOString(),
// //             fullStatus: status || "unknown",
// //           }

// //           return container
// //         })

// //       // Get resource usage for running containers
// //       for (const container of containers) {
// //         if (container.status === "running") {
// //           try {
// //             const { stdout: statsOutput } = await execAsync(
// //               `docker stats ${container.id} --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}|{{.MemPerc}}"`,
// //             )

// //             if (statsOutput.trim()) {
// //               const [cpuPerc, memUsage, memPerc] = statsOutput.trim().split("|")

// //               // Parse CPU percentage
// //               container.cpu = Number.parseFloat(cpuPerc.replace("%", "")) || 0

// //               // Parse memory usage
// //               container.memoryUsage = memUsage || "0B / 0B"
// //               container.memoryPercent = Number.parseFloat(memPerc.replace("%", "")) || 0
// //             }
// //           } catch (statsError) {
// //             // If stats fail, set default values
// //             container.cpu = 0
// //             container.memoryUsage = "0B / 0B"
// //             container.memoryPercent = 0
// //           }
// //         } else {
// //           // For non-running containers, set default values
// //           container.cpu = 0
// //           container.memoryUsage = "0B / 0B"
// //           container.memoryPercent = 0
// //         }
// //       }

// //       // Get Docker system information
// //       let systemInfo = null
// //       try {
// //         const { stdout: dockerSystemInfo } = await execAsync("docker system df --format json")
// //         systemInfo = JSON.parse(dockerSystemInfo)
// //       } catch (error) {
// //         // If system info fails, continue without it
// //         console.log("Could not get Docker system info")
// //       }

// //       return NextResponse.json({
// //         containers,
// //         totalContainers: containers.length,
// //         runningContainers: containers.filter((c) => c.status === "running").length,
// //         stoppedContainers: containers.filter((c) => c.status === "stopped").length,
// //         dockerAvailable: true,
// //         systemInfo,
// //         lastUpdated: new Date().toISOString(),
// //       })
// //     } catch (dockerError: any) {
// //       return NextResponse.json(
// //         {
// //           error: "Failed to get Docker containers: " + dockerError.message,
// //           containers: [],
// //           dockerAvailable: true,
// //           suggestion: "Make sure Docker daemon is running and you have permissions to access it",
// //         },
// //         { status: 200 },
// //       )
// //     }
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       {
// //         error: error.message,
// //         containers: [],
// //         dockerAvailable: false,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// // function extractUptime(status: string): string {
// //   const upMatch = status.match(/Up\s+(.+?)(?:\s+\(|$)/)
// //   if (upMatch) {
// //     return upMatch[1].trim()
// //   }
// //   return "0 seconds"
// // }

// // // Container control endpoints
// // export async function POST(request: Request) {
// //   try {
// //     const { action, containerId } = await request.json()

// //     if (!containerId) {
// //       return NextResponse.json({ error: "Container ID is required" }, { status: 400 })
// //     }

// //     const allowedActions = ["start", "stop", "restart", "pause", "unpause"]
// //     if (!allowedActions.includes(action)) {
// //       return NextResponse.json({ error: "Invalid action. Allowed: " + allowedActions.join(", ") }, { status: 400 })
// //     }

// //     let command = ""
// //     switch (action) {
// //       case "start":
// //         command = `docker start ${containerId}`
// //         break
// //       case "stop":
// //         command = `docker stop ${containerId}`
// //         break
// //       case "restart":
// //         command = `docker restart ${containerId}`
// //         break
// //       case "pause":
// //         command = `docker pause ${containerId}`
// //         break
// //       case "unpause":
// //         command = `docker unpause ${containerId}`
// //         break
// //     }

// //     const { stdout, stderr } = await execAsync(command, { timeout: 30000 })

// //     return NextResponse.json({
// //       success: true,
// //       message: `Container ${action} successful`,
// //       output: stdout || stderr,
// //       containerId,
// //       action,
// //       timestamp: new Date().toISOString(),
// //     })
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: error.message,
// //         containerId: request.body?.containerId,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// import { NextResponse } from "next/server"
// import { exec } from "child_process"
// import { promisify } from "util"

// const execAsync = promisify(exec)

// interface DockerContainer {
//   id: string
//   fullId: string
//   name: string
//   image: string
//   status: "running" | "stopped" | "paused" | "restarting"
//   ports: string[]
//   uptime: string
//   createdAt: string
//   fullStatus: string
//   cpu?: number
//   memoryUsage?: string
//   memoryPercent?: number
// }

// export async function GET() {
//   try {
//     // Check if Docker is available
//     try {
//       await execAsync("docker --version")
//     } catch (error) {
//       return NextResponse.json({
//         error: "Docker is not installed or not running",
//         containers: [],
//         dockerAvailable: false,
//       })
//     }

//     try {
//       const { stdout } = await execAsync(
//         'docker ps -a --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.CreatedAt}}"',
//       )

//       if (!stdout.trim()) {
//         return NextResponse.json({
//           containers: [],
//           totalContainers: 0,
//           runningContainers: 0,
//           dockerAvailable: true,
//         })
//       }

//       const containers: DockerContainer[] = stdout
//         .split("\n")
//         .filter((line) => line.trim())
//         .map((line) => {
//           const [id, name, image, status, ports, createdAt] = line.split("|")

//           const isRunning = status.toLowerCase().includes("up")
//           const container: DockerContainer = {
//             id: id?.substring(0, 12) || "unknown",
//             fullId: id || "unknown",
//             name: name || "unnamed",
//             image: image || "unknown",
//             status: isRunning ? "running" : "stopped",
//             ports: ports
//               ? ports
//                   .split(",")
//                   .map((p) => p.trim())
//                   .filter((p) => p)
//               : [],
//             uptime: extractUptime(status),
//             createdAt: createdAt || new Date().toISOString(),
//             fullStatus: status || "unknown",
//           }

//           return container
//         })

//       // Get resource usage for running containers
//       for (const container of containers) {
//         if (container.status === "running") {
//           try {
//             const { stdout: statsOutput } = await execAsync(
//               `docker stats ${container.id} --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}|{{.MemPerc}}"`,
//             )

//             if (statsOutput.trim()) {
//               const [cpuPerc, memUsage, memPerc] = statsOutput.trim().split("|")
//               container.cpu = Number.parseFloat(cpuPerc.replace("%", "")) || 0
//               container.memoryUsage = memUsage || "0B / 0B"
//               container.memoryPercent = Number.parseFloat(memPerc.replace("%", "")) || 0
//             }
//           } catch (statsError) {
//             container.cpu = 0
//             container.memoryUsage = "0B / 0B"
//             container.memoryPercent = 0
//           }
//         }
//       }

//       return NextResponse.json({
//         containers,
//         totalContainers: containers.length,
//         runningContainers: containers.filter((c) => c.status === "running").length,
//         dockerAvailable: true,
//       })
//     } catch (dockerError: any) {
//       return NextResponse.json({
//         error: "Failed to get Docker containers: " + dockerError.message,
//         containers: [],
//         dockerAvailable: true,
//       })
//     }
//   } catch (error: any) {
//     return NextResponse.json({
//       error: error.message,
//       containers: [],
//       dockerAvailable: false,
//     })
//   }
// }

// function extractUptime(status: string): string {
//   const upMatch = status.match(/Up\s+(.+?)(?:\s+\(|$)/)
//   if (upMatch) {
//     return upMatch[1].trim()
//   }
//   return "0 seconds"
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const { action, containerId } = body

//     if (!containerId) {
//       return NextResponse.json({ error: "Container ID is required" }, { status: 400 })
//     }

//     const allowedActions = ["start", "stop", "restart", "pause", "unpause"]
//     if (!allowedActions.includes(action)) {
//       return NextResponse.json({ error: "Invalid action" }, { status: 400 })
//     }

//     const command = `docker ${action} ${containerId}`
//     const { stdout, stderr } = await execAsync(command, { timeout: 30000 })

//     return NextResponse.json({
//       success: true,
//       message: `Container ${action} successful`,
//       output: stdout || stderr,
//     })
//   } catch (error: any) {
//     return NextResponse.json({
//       success: false,
//       error: error.message,
//     })
//   }
// }

import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

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

export async function GET() {
  try {
    // Check if Docker Desktop is running
    try {
      await execAsync("docker version", { timeout: 5000 })
    } catch (error: any) {
      if (error.message.includes("pipe") || error.message.includes("connect")) {
        return NextResponse.json({
          error: "Docker Desktop is not running",
          containers: [],
          dockerAvailable: false,
          suggestion: "Start Docker Desktop application",
          troubleshooting: {
            step1: "Open Docker Desktop application",
            step2: "Wait for Docker to start (whale icon should be steady)",
            step3: "Refresh this page",
            dockerDesktopUrl: "https://www.docker.com/products/docker-desktop/",
          },
        })
      }

      return NextResponse.json({
        error: "Docker is not installed",
        containers: [],
        dockerAvailable: false,
        suggestion: "Install Docker Desktop",
        troubleshooting: {
          step1: "Download Docker Desktop from docker.com",
          step2: "Install and restart your computer",
          step3: "Start Docker Desktop",
          dockerDesktopUrl: "https://www.docker.com/products/docker-desktop/",
        },
      })
    }

    try {
      // Get containers with simpler format first
      const { stdout } = await execAsync("docker ps -a", { timeout: 10000 })

      if (!stdout.trim() || stdout.includes("CONTAINER ID")) {
        // No containers or just headers
        return NextResponse.json({
          containers: [],
          totalContainers: 0,
          runningContainers: 0,
          dockerAvailable: true,
          message: "Docker is running but no containers found",
          suggestion: "Create some containers to see them here",
          quickStart: {
            step1: "docker run hello-world",
            step2: "docker run -d nginx",
            step3: "docker run -d -p 3001:80 nginx",
          },
        })
      }

      // Parse docker ps output manually
      const lines = stdout.split("\n").filter((line) => line.trim() && !line.includes("CONTAINER ID"))
      const containers: DockerContainer[] = []

      for (const line of lines) {
        try {
          // Get detailed info for each container
          const containerId = line.split(/\s+/)[0]
          if (!containerId) continue

          const { stdout: inspectOutput } = await execAsync(`docker inspect ${containerId}`)
          const containerInfo = JSON.parse(inspectOutput)[0]

          const container: DockerContainer = {
            id: containerId.substring(0, 12),
            fullId: containerId,
            name: containerInfo.Name.replace("/", ""),
            image: containerInfo.Config.Image,
            status: containerInfo.State.Running ? "running" : "stopped",
            ports: Object.keys(containerInfo.NetworkSettings.Ports || {}).map((port) => {
              const hostPorts = containerInfo.NetworkSettings.Ports[port]
              if (hostPorts && hostPorts[0]) {
                return `${hostPorts[0].HostPort}:${port}`
              }
              return port
            }),
            uptime: containerInfo.State.Running ? calculateUptime(containerInfo.State.StartedAt) : "Not running",
            createdAt: containerInfo.Created,
            fullStatus: containerInfo.State.Status,
          }

          // Get stats for running containers
          if (container.status === "running") {
            try {
              const { stdout: statsOutput } = await execAsync(
                `docker stats ${container.id} --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"`,
                { timeout: 5000 },
              )

              const statsLines = statsOutput.split("\n").filter((line) => !line.includes("CPU"))
              if (statsLines.length > 0) {
                const [cpuPerc, memUsage, memPerc] = statsLines[0].split(/\s+/)
                container.cpu = Number.parseFloat(cpuPerc.replace("%", "")) || 0
                container.memoryUsage = memUsage || "0B / 0B"
                container.memoryPercent = Number.parseFloat(memPerc.replace("%", "")) || 0
              }
            } catch (statsError) {
              container.cpu = 0
              container.memoryUsage = "0B / 0B"
              container.memoryPercent = 0
            }
          }

          containers.push(container)
        } catch (parseError) {
          console.error("Error parsing container:", parseError)
        }
      }

      return NextResponse.json({
        containers,
        totalContainers: containers.length,
        runningContainers: containers.filter((c) => c.status === "running").length,
        dockerAvailable: true,
        lastUpdated: new Date().toISOString(),
      })
    } catch (dockerError: any) {
      return NextResponse.json({
        error: "Failed to get Docker containers: " + dockerError.message,
        containers: [],
        dockerAvailable: true,
        suggestion: "Make sure Docker Desktop is running and try again",
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      containers: [],
      dockerAvailable: false,
    })
  }
}

function calculateUptime(startedAt: string): string {
  const start = new Date(startedAt)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, containerId } = body

    if (!containerId) {
      return NextResponse.json({ error: "Container ID is required" }, { status: 400 })
    }

    const allowedActions = ["start", "stop", "restart", "pause", "unpause"]
    if (!allowedActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const command = `docker ${action} ${containerId}`
    const { stdout, stderr } = await execAsync(command, { timeout: 30000 })

    return NextResponse.json({
      success: true,
      message: `Container ${action} successful`,
      output: stdout || stderr,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}