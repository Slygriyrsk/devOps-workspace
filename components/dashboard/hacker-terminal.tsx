"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, Send, Trash2, Volume2 } from "lucide-react"
import { MatrixRain } from "@/components/ui/matrix-rain"
import { BinaryStream } from "@/components/ui/binary-stream"
import { GlitchText } from "@/components/ui/glitch-text"
import { useSound } from "@/hooks/use-sound"

interface TerminalLine {
  id: string
  content: string
  type: "command" | "output" | "error" | "system"
  timestamp: Date
}

export function HackerTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isHacked, setIsHacked] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { playBeep, playAlertSound, playHackerSound, playErrorSound, playSuccessSound } = useSound()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    // Initial hacker messages
    const initMessages = [
      "SYSTEM BREACH DETECTED...",
      "INITIALIZING QUANTUM FIREWALL...",
      "NEURAL NETWORK ACTIVATED...",
      "READY FOR CYBER OPERATIONS...",
    ]

    initMessages.forEach((msg, index) => {
      setTimeout(() => {
        addLine(msg, "system")
        if (index === 0) playAlertSound()
        else playBeep(800 + index * 100, 100)
      }, index * 1000)
    })
  }, [])

  const addLine = (content: string, type: "command" | "output" | "error" | "system" = "output") => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      content,
      type,
      timestamp: new Date(),
    }
    setLines((prev) => [...prev, newLine])
  }

  const simulateHack = () => {
    setIsHacked(true)
    playAlertSound()

    const hackSequence = [
      ">>> INITIATING CYBER ATTACK <<<",
      "Scanning network topology...",
      "01001000 01000001 01000011 01001011",
      "Exploiting buffer overflow...",
      "Injecting malicious payload...",
      "Bypassing authentication protocols...",
      "ROOT ACCESS GRANTED",
      "SYSTEM COMPROMISED",
      ">>> HACK COMPLETE <<<",
    ]

    hackSequence.forEach((msg, index) => {
      setTimeout(() => {
        addLine(msg, index === 0 || index === hackSequence.length - 1 ? "system" : "error")
        if (index % 2 === 0) playHackerSound()
      }, index * 800)
    })

    setTimeout(() => setIsHacked(false), hackSequence.length * 800 + 2000)
  }

  const executeCommand = async () => {
    if (!currentCommand.trim() || isExecuting) return

    setIsExecuting(true)
    const command = currentCommand.trim()

    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    addLine(`$ ${command}`, "command")

    // Special hacker commands
    if (command === "hack") {
      simulateHack()
      setCurrentCommand("")
      setIsExecuting(false)
      return
    }

    if (command === "matrix") {
      addLine("ENTERING THE MATRIX...", "system")
      playHackerSound()
      setCurrentCommand("")
      setIsExecuting(false)
      return
    }

    if (command === "nuke") {
      addLine("LAUNCHING NUCLEAR CODES...", "error")
      addLine("ACCESS DENIED - INSUFFICIENT CLEARANCE", "error")
      playErrorSound()
      setCurrentCommand("")
      setIsExecuting(false)
      return
    }

    try {
      const response = await fetch("/api/terminal/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.output) {
          result.output.split("\n").forEach((line: string) => {
            addLine(line, "output")
          })
          playSuccessSound()
        }
      } else {
        addLine(`ERROR: ${result.error}`, "error")
        playErrorSound()
      }
    } catch (error: any) {
      addLine(`NETWORK ERROR: ${error.message}`, "error")
      playErrorSound()
    }

    setCurrentCommand("")
    setIsExecuting(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      }
    }
  }

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-cyan-400"
      case "error":
        return "text-red-400 animate-pulse"
      case "system":
        return "text-yellow-400 font-bold"
      default:
        return "text-green-400"
    }
  }

  return (
    <Card className={`bg-gray-900 border-gray-700 h-full relative overflow-hidden ${isHacked ? "animate-pulse" : ""}`}>
      {isHacked && <MatrixRain className="opacity-20" />}

      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5" />
            <GlitchText text="CYBER TERMINAL" className="text-green-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => playHackerSound()} size="sm" className="bg-purple-500/20 hover:bg-purple-500/30">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button onClick={() => setLines([])} size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <BinaryStream className="h-4" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="bg-black rounded-lg m-4 border border-green-500/30">
          <div className="flex items-center space-x-2 p-3 border-b border-green-500/30 bg-gray-900/50">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 ml-4 text-sm font-mono">
              <GlitchText text="SECURE_TERMINAL_v2.1.337" />
            </span>
          </div>

          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="font-mono text-sm space-y-1">
              {lines.map((line) => (
                <div key={line.id} className={getLineColor(line.type)}>
                  <span className="text-gray-500 text-xs mr-2">[{line.timestamp.toLocaleTimeString()}]</span>
                  {line.content}
                </div>
              ))}
              {isExecuting && (
                <div className="text-yellow-400 animate-pulse flex items-center space-x-2">
                  <span>EXECUTING COMMAND...</span>
                  <div className="animate-spin">⟳</div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-green-500/30 bg-gray-900/50">
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-mono animate-pulse">root@cyberops:~$</span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter command... (try: hack, matrix, nuke)"
                className="bg-transparent border-green-500/30 text-green-400 font-mono focus:ring-green-500/50 focus-visible:ring-green-500/50"
                disabled={isExecuting}
              />
              <Button
                onClick={executeCommand}
                disabled={isExecuting || !currentCommand.trim()}
                size="sm"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs">
              <BinaryStream className="flex-1" speed={200} />
              <span className="text-gray-500 ml-4">Commands: {commandHistory.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}