// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Terminal, Send } from "lucide-react"
// import { useWebSocket } from "@/hooks/use-websocket"

// interface TerminalLine {
//   id: string
//   content: string
//   type: "command" | "output" | "error"
//   timestamp: Date
// }

// export function TerminalComponent() {
//   const [lines, setLines] = useState<TerminalLine[]>([])
//   const [currentCommand, setCurrentCommand] = useState("")
//   const [isExecuting, setIsExecuting] = useState(false)
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const { messages, isConnected, sendMessage } = useWebSocket("ws://localhost:8080/terminal")

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [lines])

//   useEffect(() => {
//     messages.forEach((message) => {
//       if (message.type === "terminal_output") {
//         addLine(message.data.content, message.data.type || "output")
//       }
//     })
//   }, [messages])

//   const addLine = (content: string, type: "command" | "output" | "error" = "output") => {
//     const newLine: TerminalLine = {
//       id: Date.now().toString(),
//       content,
//       type,
//       timestamp: new Date(),
//     }
//     setLines((prev) => [...prev, newLine])
//   }

//   const executeCommand = async () => {
//     if (!currentCommand.trim() || isExecuting) return

//     setIsExecuting(true)
//     addLine(`$ ${currentCommand}`, "command")

//     try {
//       const response = await fetch("/api/terminal/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ command: currentCommand }),
//       })

//       const result = await response.json()

//       if (result.success) {
//         result.output.split("\n").forEach((line: string) => {
//           if (line.trim()) addLine(line, "output")
//         })
//       } else {
//         addLine(result.error, "error")
//       }
//     } catch (error) {
//       addLine(`Error: ${error}`, "error")
//     }

//     setCurrentCommand("")
//     setIsExecuting(false)
//   }

//   const getLineColor = (type: string) => {
//     switch (type) {
//       case "command":
//         return "text-cyan-400"
//       case "error":
//         return "text-red-400"
//       default:
//         return "text-green-400"
//     }
//   }

//   return (
//     <Card className="bg-gray-900 border-gray-700 h-full">
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between text-green-400">
//           <div className="flex items-center space-x-2">
//             <Terminal className="w-5 h-5" />
//             <span>Interactive Terminal</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
//             <span className="text-xs text-gray-400">{isConnected ? "Connected" : "Disconnected"}</span>
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="bg-black rounded-lg m-4">
//           <div className="flex items-center space-x-2 p-3 border-b border-gray-700">
//             <div className="w-3 h-3 bg-red-500 rounded-full" />
//             <div className="w-3 h-3 bg-yellow-500 rounded-full" />
//             <div className="w-3 h-3 bg-green-500 rounded-full" />
//             <span className="text-gray-400 ml-4 text-sm">bash - awesome-app</span>
//           </div>

//           <ScrollArea className="h-80 p-4" ref={scrollRef}>
//             <div className="font-mono text-sm space-y-1">
//               {lines.map((line) => (
//                 <div key={line.id} className={getLineColor(line.type)}>
//                   {line.content}
//                 </div>
//               ))}
//               {isExecuting && <div className="text-yellow-400 animate-pulse">Executing command...</div>}
//             </div>
//           </ScrollArea>

//           <div className="p-4 border-t border-gray-700">
//             <div className="flex items-center space-x-2">
//               <span className="text-green-400 font-mono">$</span>
//               <Input
//                 value={currentCommand}
//                 onChange={(e) => setCurrentCommand(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && executeCommand()}
//                 placeholder="Enter command..."
//                 className="bg-transparent border-none text-green-400 font-mono focus:ring-0"
//                 disabled={isExecuting}
//               />
//               <Button
//                 onClick={executeCommand}
//                 disabled={isExecuting || !currentCommand.trim()}
//                 size="sm"
//                 className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
//               >
//                 <Send className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, Send, Trash2 } from "lucide-react"

interface TerminalLine {
  id: string
  content: string
  type: "command" | "output" | "error"
  timestamp: Date
}

export function TerminalComponent() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const addLine = (content: string, type: "command" | "output" | "error" = "output") => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      content,
      type,
      timestamp: new Date(),
    }
    setLines((prev) => [...prev, newLine])
  }

  const executeCommand = async () => {
    if (!currentCommand.trim() || isExecuting) return

    setIsExecuting(true)
    const command = currentCommand.trim()

    // Add to history
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    addLine(`$ ${command}`, "command")

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
        } else {
          addLine("Command executed successfully", "output")
        }
      } else {
        addLine(`Error: ${result.error}`, "error")
      }
    } catch (error: any) {
      addLine(`Network Error: ${error.message}`, "error")
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

  const clearTerminal = () => {
    setLines([])
  }

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-cyan-400"
      case "error":
        return "text-red-400"
      default:
        return "text-green-400"
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700 h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5" />
            <span>Interactive Terminal</span>
          </div>
          <Button onClick={clearTerminal} size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-black rounded-lg m-4">
          <div className="flex items-center space-x-2 p-3 border-b border-gray-700">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-400 ml-4 text-sm">Terminal - {process.cwd?.() || "workspace"}</span>
          </div>

          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="font-mono text-sm space-y-1">
              {lines.length === 0 && (
                <div className="text-gray-400">
                  Welcome to the interactive terminal. Type commands to get started.
                  <br />
                  Available commands: ls, pwd, git status, docker ps, npm --version, etc.
                </div>
              )}
              {lines.map((line) => (
                <div key={line.id} className={getLineColor(line.type)}>
                  {line.content}
                </div>
              ))}
              {isExecuting && <div className="text-yellow-400 animate-pulse">Executing command...</div>}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-mono">$</span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter command... (Use ↑↓ for history)"
                className="bg-transparent border-none text-green-400 font-mono focus:ring-0 focus-visible:ring-0"
                disabled={isExecuting}
              />
              <Button
                onClick={executeCommand}
                disabled={isExecuting || !currentCommand.trim()}
                size="sm"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {commandHistory.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">Command history: {commandHistory.length} commands</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}