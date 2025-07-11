// // import { type NextRequest, NextResponse } from "next/server"
// // import { exec } from "child_process"
// // import { promisify } from "util"

// // const execAsync = promisify(exec)

// // const ALLOWED_COMMANDS = [
// //   "ls",
// //   "pwd",
// //   "whoami",
// //   "date",
// //   "echo",
// //   "cat",
// //   "head",
// //   "tail",
// //   "git status",
// //   "git branch",
// //   "git log --oneline -10",
// //   "docker ps",
// //   "docker images",
// //   "npm --version",
// //   "node --version",
// // ]

// // export async function POST(request: NextRequest) {
// //   try {
// //     const { command } = await request.json()

// //     // Security check - only allow safe commands
// //     const isAllowed = ALLOWED_COMMANDS.some((allowed) => command.startsWith(allowed) || command === allowed)

// //     if (!isAllowed) {
// //       return NextResponse.json({
// //         success: false,
// //         error: `Command '${command}' is not allowed for security reasons`,
// //       })
// //     }

// //     const { stdout, stderr } = await execAsync(command, {
// //       timeout: 10000, // 10 second timeout
// //       cwd: process.cwd(),
// //     })

// //     return NextResponse.json({
// //       success: true,
// //       output: stdout || stderr || "Command executed successfully",
// //     })
// //   } catch (error: any) {
// //     return NextResponse.json({
// //       success: false,
// //       error: error.message || "Command execution failed",
// //     })
// //   }
// // }

// import { type NextRequest, NextResponse } from "next/server"
// import { exec } from "child_process"
// import { promisify } from "util"

// const execAsync = promisify(exec)

// // Comprehensive list of allowed commands for security
// const ALLOWED_COMMANDS = [
//   // Basic file system
//   "ls",
//   "dir",
//   "pwd",
//   "whoami",
//   "date",
//   "echo",
//   "cat",
//   "head",
//   "tail",
//   "wc",
//   "grep",
//   // Git commands
//   "git status",
//   "git branch",
//   "git log",
//   "git diff",
//   "git show",
//   "git remote",
//   // Docker commands (read-only)
//   "docker ps",
//   "docker images",
//   "docker version",
//   "docker info",
//   // Node/npm commands
//   "npm --version",
//   "node --version",
//   "npm list",
//   "npm outdated",
//   // System info
//   "uname",
//   "hostname",
//   "uptime",
//   "df",
//   "free",
//   "ps",
//   // Network (safe commands)
//   "ping",
//   "nslookup",
//   "curl --version",
// ]

// const DANGEROUS_PATTERNS = [
//   "rm ",
//   "del ",
//   "format",
//   "fdisk",
//   "mkfs",
//   "dd ",
//   "sudo",
//   "su ",
//   ">",
//   ">>",
//   "|",
//   "&",
//   ";",
//   "$(",
//   "`",
//   "eval",
//   "exec",
// ]

// function isCommandSafe(command: string): boolean {
//   const cmd = command.toLowerCase().trim()

//   // Check for dangerous patterns
//   for (const pattern of DANGEROUS_PATTERNS) {
//     if (cmd.includes(pattern)) {
//       return false
//     }
//   }

//   // Check if command starts with allowed commands
//   for (const allowed of ALLOWED_COMMANDS) {
//     if (cmd.startsWith(allowed.toLowerCase())) {
//       return true
//     }
//   }

//   return false
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { command } = await request.json()

//     if (!command || typeof command !== "string") {
//       return NextResponse.json({
//         success: false,
//         error: "Command is required and must be a string",
//       })
//     }

//     const trimmedCommand = command.trim()

//     // Security check
//     if (!isCommandSafe(trimmedCommand)) {
//       return NextResponse.json({
//         success: false,
//         error: `Command '${trimmedCommand}' is not allowed for security reasons.\nAllowed commands: ${ALLOWED_COMMANDS.slice(0, 10).join(", ")}...`,
//       })
//     }

//     try {
//       const { stdout, stderr } = await execAsync(trimmedCommand, {
//         timeout: 15000, // 15 second timeout
//         cwd: process.cwd(),
//         maxBuffer: 1024 * 1024, // 1MB max buffer
//       })

//       const output = stdout || stderr || "Command executed successfully"

//       return NextResponse.json({
//         success: true,
//         output: output.trim(),
//         command: trimmedCommand,
//         timestamp: new Date().toISOString(),
//       })
//     } catch (execError: any) {
//       // Handle command execution errors
//       return NextResponse.json({
//         success: false,
//         error: execError.message || "Command execution failed",
//         stderr: execError.stderr || "",
//         code: execError.code || 1,
//       })
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Server error: " + error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// Comprehensive list of allowed commands
const ALLOWED_COMMANDS = [
  // Basic file system
  "ls",
  "dir",
  "pwd",
  "whoami",
  "date",
  "echo",
  "cat",
  "head",
  "tail",
  "wc",
  "grep",
  "find",
  "tree",

  // Git commands
  "git status",
  "git branch",
  "git log",
  "git diff",
  "git show",
  "git remote",
  "git config",
  "git init",
  "git add",
  "git commit",
  "git push",
  "git pull",
  "git clone",
  "git checkout",

  // Docker commands (read-only and safe)
  "docker ps",
  "docker images",
  "docker version",
  "docker info",
  "docker stats",
  "docker logs",
  "docker inspect",
  "docker system df",
  "docker system info",

  // Node/npm commands
  "npm --version",
  "node --version",
  "npm list",
  "npm outdated",
  "npm info",
  "npm search",
  "npx --version",
  "yarn --version",

  // System info
  "uname",
  "hostname",
  "uptime",
  "df",
  "free",
  "ps",
  "top",
  "htop",
  "which",
  "whereis",

  // Network (safe commands)
  "ping",
  "nslookup",
  "dig",
  "curl --version",
  "wget --version",
  "netstat",

  // Development tools
  "code --version",
  "vim --version",
  "nano --version",
  "python --version",
  "java -version",
  "gcc --version",
  "make --version",
  "cmake --version",

  // Package managers
  "pip --version",
  "pip list",
  "conda --version",
  "brew --version",

  // Database tools
  "mongo --version",
  "mysql --version",
  "psql --version",
  "redis-cli --version",

  // DevOps tools
  "kubectl version",
  "helm version",
  "terraform --version",
  "ansible --version",
  "vagrant --version",
  "packer --version",

  // Special hacker commands
  "hack",
  "matrix",
  "nuke",
  "scan",
  "exploit",
  "decrypt",
  "trace",
  "breach",
]

const DANGEROUS_PATTERNS = [
  "rm ",
  "del ",
  "format",
  "fdisk",
  "mkfs",
  "dd ",
  "sudo",
  "su ",
  ">",
  ">>",
  "|",
  "&",
  ";",
  "$(",
  "`",
  "eval",
  "exec",
  "chmod +x",
  "wget http",
  "curl http",
  "nc ",
  "netcat",
]

function isCommandSafe(command: string): boolean {
  const cmd = command.toLowerCase().trim()

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (cmd.includes(pattern)) {
      return false
    }
  }

  // Check if command starts with allowed commands
  for (const allowed of ALLOWED_COMMANDS) {
    if (cmd.startsWith(allowed.toLowerCase())) {
      return true
    }
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    if (!command || typeof command !== "string") {
      return NextResponse.json({
        success: false,
        error: "Command is required and must be a string",
      })
    }

    const trimmedCommand = command.trim()

    // Handle special commands first
    if (trimmedCommand === "help") {
      return NextResponse.json({
        success: true,
        output: `Available Commands:

BASIC COMMANDS:
  ls, pwd, whoami, date, echo, cat, head, tail

GIT COMMANDS:
  git status, git branch, git log, git init, git add, git commit

DOCKER COMMANDS:
  docker ps, docker images, docker version, docker info

SYSTEM INFO:
  uname, hostname, uptime, df, free, ps

DEVELOPMENT:
  npm --version, node --version, python --version

SPECIAL HACKER COMMANDS:
  hack, matrix, nuke, scan, exploit, decrypt, trace, breach

NETWORK:
  ping <host>, nslookup <domain>

Type 'commands' to see all ${ALLOWED_COMMANDS.length} available commands.`,
      })
    }

    if (trimmedCommand === "commands") {
      return NextResponse.json({
        success: true,
        output: `All ${ALLOWED_COMMANDS.length} Available Commands:\n\n${ALLOWED_COMMANDS.join(", ")}`,
      })
    }

    // Special hacker commands
    if (trimmedCommand === "scan") {
      return NextResponse.json({
        success: true,
        output: `NETWORK SCAN INITIATED...
Scanning ports: 21, 22, 23, 25, 53, 80, 110, 443, 993, 995
Port 22: OPEN (SSH)
Port 80: OPEN (HTTP)
Port 443: OPEN (HTTPS)
Scan complete. 3 open ports found.`,
      })
    }

    if (trimmedCommand === "exploit") {
      return NextResponse.json({
        success: true,
        output: `EXPLOIT FRAMEWORK LOADED...
Available exploits:
- CVE-2021-44228 (Log4Shell)
- CVE-2021-34527 (PrintNightmare)
- CVE-2020-1472 (Zerologon)
WARNING: For educational purposes only!`,
      })
    }

    if (trimmedCommand === "decrypt") {
      return NextResponse.json({
        success: true,
        output: `DECRYPTION MODULE ACTIVE...
Attempting to decrypt intercepted data...
Progress: [████████████████████] 100%
Decryption successful!
Message: "The cake is a lie"`,
      })
    }

    if (trimmedCommand === "trace") {
      return NextResponse.json({
        success: true,
        output: `TRACE ROUTE INITIATED...
Tracing connection to target...
1. 192.168.1.1 (2ms)
2. 10.0.0.1 (15ms)
3. 203.0.113.1 (45ms)
4. *.*.*.* (ENCRYPTED)
Trace complete. Target located.`,
      })
    }

    if (trimmedCommand === "breach") {
      return NextResponse.json({
        success: true,
        output: `SECURITY BREACH DETECTED!
Firewall status: COMPROMISED
Intrusion detected at: ${new Date().toLocaleString()}
Threat level: CRITICAL
Initiating countermeasures...`,
      })
    }

    // Security check for real commands
    if (!isCommandSafe(trimmedCommand)) {
      return NextResponse.json({
        success: false,
        error: `Command '${trimmedCommand}' is not allowed for security reasons.\nType 'help' to see available commands.`,
      })
    }

    try {
      const { stdout, stderr } = await execAsync(trimmedCommand, {
        timeout: 15000,
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024,
      })

      const output = stdout || stderr || "Command executed successfully"

      return NextResponse.json({
        success: true,
        output: output.trim(),
        command: trimmedCommand,
        timestamp: new Date().toISOString(),
      })
    } catch (execError: any) {
      return NextResponse.json({
        success: false,
        error: execError.message || "Command execution failed",
        stderr: execError.stderr || "",
        code: execError.code || 1,
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error: " + error.message,
      },
      { status: 500 },
    )
  }
}