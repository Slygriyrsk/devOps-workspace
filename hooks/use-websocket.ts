// "use client"

// import { useEffect, useRef, useState } from "react"

// interface WebSocketMessage {
//   type: string
//   data: any
//   timestamp: string
// }

// export function useWebSocket(url: string) {
//   const [messages, setMessages] = useState<WebSocketMessage[]>([])
//   const [isConnected, setIsConnected] = useState(false)
//   const ws = useRef<WebSocket | null>(null)

//   useEffect(() => {
//     const connectWebSocket = () => {
//       ws.current = new WebSocket(url)

//       ws.current.onopen = () => {
//         setIsConnected(true)
//         console.log("WebSocket connected")
//       }

//       ws.current.onmessage = (event) => {
//         const message = JSON.parse(event.data)
//         setMessages((prev) => [...prev.slice(-99), message]) // Keep last 100 messages
//       }

//       ws.current.onclose = () => {
//         setIsConnected(false)
//         console.log("WebSocket disconnected")
//         // Reconnect after 3 seconds
//         setTimeout(connectWebSocket, 3000)
//       }

//       ws.current.onerror = (error) => {
//         console.error("WebSocket error:", error)
//       }
//     }

//     connectWebSocket()

//     return () => {
//       if (ws.current) {
//         ws.current.close()
//       }
//     }
//   }, [url])

//   const sendMessage = (message: any) => {
//     if (ws.current && isConnected) {
//       ws.current.send(JSON.stringify(message))
//     }
//   }

//   return { messages, isConnected, sendMessage }
// }

"use client"

import { useEffect, useRef, useState } from "react"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export function useWebSocket(url?: string) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Don't try to connect if no URL provided
    if (!url) {
      return
    }

    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
          setIsConnected(true)
          console.log("WebSocket connected")
        }

        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            setMessages((prev) => [...prev.slice(-99), message])
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        ws.current.onclose = () => {
          setIsConnected(false)
          console.log("WebSocket disconnected")
        }

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          setIsConnected(false)
        }
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error)
        setIsConnected(false)
      }
    }

    connectWebSocket()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { messages, isConnected, sendMessage }
}