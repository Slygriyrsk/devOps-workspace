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
    try {
      // check docker version first
      await execAsync("docker version --format json", { timeout: 5000 })
    } catch (error: any) {
      const errorMsg = error.message.toLowerCase()

      if (errorMsg.includes("pipe") || errorMsg.includes("connect") || errorMsg.includes("daemon")) {
        return NextResponse.json({
          error: "Docker Desktop is not running",
          containers: [],
          dockerAvailable: false,
          suggestion: "Start Docker Desktop application and wait for it to fully load",
          troubleshooting: {
            step1: "Open Docker Desktop application",
            step2: "Wait for the whale icon to be steady (not animated)",
            step3: "Check Docker Desktop dashboard shows containers",
            step4: "Refresh this page",
            dockerDesktopUrl: "https://www.docker.com/products/docker-desktop/",
          },
        })
      }

      return NextResponse.json({
        error: "Docker is not installed or accessible",
        containers: [],
        dockerAvailable: false,
        suggestion: "Install Docker Desktop",
      })
    }

    try {
      // Use simpler docker ps command that works better on Windows
      const { stdout } = await execAsync("docker ps -a --no-trunc", { timeout: 10000 })

      if (!stdout.trim() || stdout.split("\n").length <= 1) {
        return NextResponse.json({
          containers: [],
          totalContainers: 0,
          runningContainers: 0,
          dockerAvailable: true,
          message: "Docker is running but no containers found",
          suggestion: "Your containers might have been removed. Try creating new ones:",
          quickStart: {
            step1: "docker run hello-world",
            step2: "docker run -d --name test-nginx -p 3001:80 nginx",
            step3: "docker run -d --name test-redis redis:alpine",
            step4: "docker ps -a (to verify)",
          },
        })
      }

      // Parse docker ps output
      const lines = stdout.split("\n").filter((line) => line.trim() && !line.includes("CONTAINER ID"))
      const containers: DockerContainer[] = []

      for (const line of lines) {
        try {
          // Split by multiple spaces to get columns
          const parts = line.split(/\s{2,}/)
          if (parts.length < 6) continue

          const [containerId, image, command, created, status, ports, ...nameParts] = parts
          const name = nameParts.join(" ") || "unnamed"

          // Determine status
          let containerStatus: "running" | "stopped" | "paused" | "restarting" = "stopped"
          if (status.toLowerCase().includes("up")) {
            containerStatus = "running"
          } else if (status.toLowerCase().includes("paused")) {
            containerStatus = "paused"
          } else if (status.toLowerCase().includes("restarting")) {
            containerStatus = "restarting"
          }

          const container: DockerContainer = {
            id: containerId.substring(0, 12),
            fullId: containerId,
            name: name.replace(/^\//, ""),
            image: image,
            status: containerStatus,
            ports: ports
              ? ports
                  .split(",")
                  .map((p) => p.trim())
                  .filter((p) => p && p !== "")
              : [],
            uptime: extractUptime(status),
            createdAt: created,
            fullStatus: status,
          }

          // Get resource usage for running containers
          if (container.status === "running") {
            try {
              const { stdout: statsOutput } = await execAsync(
                `docker stats ${container.id} --no-stream --format "{{.CPUPerc}} {{.MemUsage}} {{.MemPerc}}"`,
                { timeout: 5000 },
              )

              if (statsOutput.trim()) {
                const [cpuPerc, memUsage, memPerc] = statsOutput.trim().split(/\s+/)
                container.cpu = Number.parseFloat(cpuPerc.replace("%", "")) || 0
                container.memoryUsage = memUsage || "0B / 0B"
                container.memoryPercent = Number.parseFloat(memPerc.replace("%", "")) || 0
              }
            } catch (statsError) {
              // Stats failed, but container exists
              container.cpu = 0
              container.memoryUsage = "N/A"
              container.memoryPercent = 0
            }
          }

          containers.push(container)
        } catch (parseError) {
          console.error("Error parsing container line:", parseError)
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
        suggestion: "Make sure Docker Desktop is fully started and try again",
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

function extractUptime(status: string): string {
  if (status.toLowerCase().includes("up")) {
    const parts = status.split(" ")
    const uptimeIndex = parts.findIndex((part) => part.toLowerCase() === "up")
    if (uptimeIndex > -1 && parts.length > uptimeIndex + 1) {
      return parts[uptimeIndex + 1].trim()
    }
  }
  return "Not running"
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