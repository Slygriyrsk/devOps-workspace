// import { NextResponse } from "next/server"
// import { exec } from "child_process"
// import { promisify } from "util"

// const execAsync = promisify(exec)

// export async function GET() {
//   try {
//     const projectRoot = process.cwd()

//     try {
//       // Get recent commits with detailed format
//       const { stdout } = await execAsync('git log --oneline -20 --pretty=format:"%H|%s|%an|%ad|%d" --date=iso', {
//         cwd: projectRoot,
//       })

//       const commits = stdout
//         .split("\n")
//         .filter((line) => line.trim())
//         .map((line) => {
//           const [hash, message, author, date, refs] = line.split("|")

//           // Extract branch from refs
//           let branch = "main"
//           if (refs && refs.includes("origin/")) {
//             const branchMatch = refs.match(/origin\/([^,)]+)/)
//             if (branchMatch) {
//               branch = branchMatch[1]
//             }
//           }

//           return {
//             hash: hash?.substring(0, 8) || "unknown",
//             message: message || "No commit message",
//             author: author || "Unknown",
//             date: date || new Date().toISOString(),
//             branch: branch,
//             fullHash: hash,
//           }
//         })

//       return NextResponse.json(commits)
//     } catch (gitError) {
//       return NextResponse.json(
//         {
//           error: "Not a git repository or no commits found",
//           commits: [],
//         },
//         { status: 200 },
//       )
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: error.message,
//         commits: [],
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET() {
  try {
    const projectRoot = process.cwd()

    try {
      // Check if git repo exists and has commits
      const { stdout } = await execAsync('git log --oneline -10 --pretty=format:"%H|%s|%an|%ad" --date=iso', {
        cwd: projectRoot,
      })

      if (!stdout.trim()) {
        return NextResponse.json({
          error: "No commits found",
          commits: [],
          suggestion: "Make your first commit",
          quickStart: {
            step1: "git add .",
            step2: "git commit -m 'Initial commit'",
          },
        })
      }

      const commits = stdout
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [hash, message, author, date] = line.split("|")

          return {
            hash: hash?.substring(0, 8) || "unknown",
            message: message || "No commit message",
            author: author || "Unknown",
            date: date || new Date().toISOString(),
            branch: "main", // Default branch
            fullHash: hash,
          }
        })

      return NextResponse.json(commits)
    } catch (gitError) {
      return NextResponse.json({
        error: "Not a git repository or no commits found",
        commits: [],
        suggestion: "Initialize git and make commits",
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      commits: [],
    })
  }
}