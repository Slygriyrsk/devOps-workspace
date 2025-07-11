import { type NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const ALLOWED_COMMANDS = [
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

  "docker ps",
  "docker images",
  "docker version",
  "docker info",
  "docker stats",
  "docker logs",
  "docker inspect",
  "docker system df",
  "docker system info",

  "npm --version",
  "node --version",
  "npm list",
  "npm outdated",
  "npm info",
  "npm search",
  "npx --version",
  "yarn --version",

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

  "ping",
  "nslookup",
  "dig",
  "curl --version",
  "wget --version",
  "netstat",

  "code --version",
  "vim --version",
  "nano --version",
  "python --version",
  "java -version",
  "gcc --version",
  "make --version",
  "cmake --version",

  "pip --version",
  "pip list",
  "conda --version",
  "brew --version",

  "mongo --version",
  "mysql --version",
  "psql --version",
  "redis-cli --version",

  "kubectl version",
  "helm version",
  "terraform --version",
  "ansible --version",
  "vagrant --version",
  "packer --version",

  "hack",
  "matrix",
  "nuke",
  "scan",
  "exploit",
  "decrypt",
  "trace",
  "breach",
];

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
];

function isCommandSafe(command: string): boolean {
  const cmd = command.toLowerCase().trim();

  for (const pattern of DANGEROUS_PATTERNS) {
    if (cmd.includes(pattern)) {
      return false;
    }
  }

  for (const allowed of ALLOWED_COMMANDS) {
    if (cmd.startsWith(allowed.toLowerCase())) {
      return true;
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== "string") {
      return NextResponse.json({
        success: false,
        error: "Command is required and must be a string",
      });
    }

    const trimmedCommand = command.trim();

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
      });
    }

    if (trimmedCommand === "commands") {
      return NextResponse.json({
        success: true,
        output: `All ${
          ALLOWED_COMMANDS.length
        } Available Commands:\n\n${ALLOWED_COMMANDS.join(", ")}`,
      });
    }

    if (trimmedCommand === "scan") {
      return NextResponse.json({
        success: true,
        output: `NETWORK SCAN INITIATED...
Scanning ports: 21, 22, 23, 25, 53, 80, 110, 443, 993, 995
Port 22: OPEN (SSH)
Port 80: OPEN (HTTP)
Port 443: OPEN (HTTPS)
Scan complete. 3 open ports found.`,
      });
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
      });
    }

    if (trimmedCommand === "decrypt") {
      return NextResponse.json({
        success: true,
        output: `DECRYPTION MODULE ACTIVE...
Attempting to decrypt intercepted data...
Progress: [████████████████████] 100%
Decryption successful!
Message: "The cake is a lie"`,
      });
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
      });
    }

    if (trimmedCommand === "breach") {
      return NextResponse.json({
        success: true,
        output: `SECURITY BREACH DETECTED!
Firewall status: COMPROMISED
Intrusion detected at: ${new Date().toLocaleString()}
Threat level: CRITICAL
Initiating countermeasures...`,
      });
    }

    if (trimmedCommand === "git add" || trimmedCommand === "git add .") {
      try {
        const { stdout, stderr } = await execAsync("git add .", {
          timeout: 10000,
          cwd: process.cwd(),
        });

        const { stdout: statusOutput } = await execAsync(
          "git status --porcelain",
          {
            cwd: process.cwd(),
          }
        );

        if (statusOutput.trim()) {
          return NextResponse.json({
            success: true,
            output: `Files staged for commit:\n${statusOutput}`,
          });
        } else {
          return NextResponse.json({
            success: true,
            output: "No changes to stage. Working directory is clean.",
          });
        }
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: `Git add failed: ${error.message}`,
        });
      }
    }

    if (trimmedCommand.startsWith("git commit")) {
      try {
        const { stdout: statusOutput } = await execAsync(
          "git status --porcelain",
          {
            cwd: process.cwd(),
          }
        );

        if (!statusOutput.trim()) {
          return NextResponse.json({
            success: false,
            error: "No changes staged for commit. Run 'git add .' first.",
          });
        }

        let commitCommand = trimmedCommand;
        if (trimmedCommand === "git commit") {
          commitCommand = 'git commit -m "Auto commit from DevOps Terminal"';
        }

        const { stdout, stderr } = await execAsync(commitCommand, {
          timeout: 10000,
          cwd: process.cwd(),
        });

        return NextResponse.json({
          success: true,
          output: stdout || stderr || "Commit successful!",
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: `Git commit failed: ${error.message}`,
        });
      }
    }

    if (trimmedCommand === "git status") {
      try {
        const { stdout } = await execAsync("git status", {
          cwd: process.cwd(),
        });

        return NextResponse.json({
          success: true,
          output: stdout,
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: `Git status failed: ${error.message}. Try 'git init' first.`,
        });
      }
    }

    if (!isCommandSafe(trimmedCommand)) {
      return NextResponse.json({
        success: false,
        error: `Command '${trimmedCommand}' is not allowed for security reasons.\nType 'help' to see available commands.`,
      });
    }

    try {
      const { stdout, stderr } = await execAsync(trimmedCommand, {
        timeout: 15000,
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024,
      });

      const output = stdout || stderr || "Command executed successfully";

      return NextResponse.json({
        success: true,
        output: output.trim(),
        command: trimmedCommand,
        timestamp: new Date().toISOString(),
      });
    } catch (execError: any) {
      return NextResponse.json({
        success: false,
        error: execError.message || "Command execution failed",
        stderr: execError.stderr || "",
        code: execError.code || 1,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error: " + error.message,
      },
      { status: 500 }
    );
  }
}