import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execAsync = promisify(exec)

export async function GET() {
  try {
    const projectRoot = process.cwd()
    const gitDir = path.join(projectRoot, ".git")

    // Check if this is a git repository
    if (!fs.existsSync(gitDir)) {
      // Initialize a git repository for demo purposes
      try {
        await execAsync("git init", { cwd: projectRoot })
        await execAsync('git config user.name "DevOps User"', { cwd: projectRoot })
        await execAsync('git config user.email "devops@example.com"', { cwd: projectRoot })

        // Create initial commit
        await execAsync("git add .", { cwd: projectRoot })
        await execAsync('git commit -m "Initial commit - DevOps Workspace"', { cwd: projectRoot })

        return NextResponse.json({
          initialized: true,
          message: "Git repository initialized successfully",
          isGitRepo: true,
        })
      } catch (initError) {
        return NextResponse.json({
          error: "Not a git repository and failed to initialize",
          isGitRepo: false,
          suggestion: "Run 'git init' to initialize a git repository",
        })
      }
    }

    // Get git status
    const { stdout: status } = await execAsync("git status --porcelain", { cwd: projectRoot })
    const { stdout: branch } = await execAsync("git branch --show-current", { cwd: projectRoot })

    return NextResponse.json({
      isGitRepo: true,
      currentBranch: branch.trim() || "main",
      hasChanges: status.trim().length > 0,
      changes: status
        .trim()
        .split("\n")
        .filter((line) => line.trim()),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      isGitRepo: false,
    })
  }
}