"use client"

import { useState, useEffect } from "react"

interface GitBranch {
  name: string
  current: boolean
  ahead: number
  behind: number
  lastCommit: string
}

interface GitCommit {
  hash: string
  message: string
  author: string
  date: string
  branch: string
}

export function useGitData() {
  const [branches, setBranches] = useState<GitBranch[]>([])
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGitData = async () => {
      try {
        const [branchesRes, commitsRes] = await Promise.all([fetch("/api/git/branches"), fetch("/api/git/commits")])

        if (branchesRes.ok && commitsRes.ok) {
          const branchesData = await branchesRes.json()
          const commitsData = await commitsRes.json()
          setBranches(branchesData)
          setCommits(commitsData)
        }
      } catch (error) {
        console.error("Failed to fetch git data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGitData()
    const interval = setInterval(fetchGitData, 10000)

    return () => clearInterval(interval)
  }, [])

  return { branches, commits, isLoading }
}
