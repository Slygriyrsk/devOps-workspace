import { NextResponse } from "next/server"
import os from "os"

export async function GET() {
  try {
    const cpus = os.cpus()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const uptime = os.uptime()

    // Calculate CPU usage (simplified)
    const cpuUsage = Math.random() * 100 // Replace with actual CPU calculation

    const stats = {
      cpu: cpuUsage,
      memory: ((totalMem - freeMem) / totalMem) * 100,
      disk: Math.random() * 100, // Replace with actual disk usage
      uptime: formatUptime(uptime),
      processes: Math.floor(Math.random() * 200) + 50,
      networkIn: Math.random() * 1024 * 1024,
      networkOut: Math.random() * 1024 * 1024,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get system stats" }, { status: 500 })
  }
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}
