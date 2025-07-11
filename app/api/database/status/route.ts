// import { NextResponse } from "next/server"
// import { MongoClient } from "mongodb"

// let cachedClient: MongoClient | null = null

// async function connectToMongoDB() {
//   if (!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI environment variable is not set")
//   }

//   if (cachedClient) {
//     return cachedClient
//   }

//   try {
//     const client = new MongoClient(process.env.MONGODB_URI)
//     await client.connect()
//     cachedClient = client
//     return client
//   } catch (error) {
//     throw new Error(`Failed to connect to MongoDB: ${error}`)
//   }
// }

// export async function GET() {
//   try {
//     const client = await connectToMongoDB()
//     const db = client.db()

//     // Test the connection with a simple ping
//     await client.db("admin").command({ ping: 1 })

//     // Get basic database stats (these don't require admin privileges)
//     let dbStats = null
//     let serverInfo = null

//     try {
//       dbStats = await db.stats()
//     } catch (error) {
//       console.log("Cannot access db.stats(), user may not have sufficient privileges")
//     }

//     try {
//       // Try to get server info without admin privileges
//       serverInfo = await db.admin().command({ buildInfo: 1 })
//     } catch (error) {
//       console.log("Cannot access server info, user may not have admin privileges")
//     }

//     // Get collections (this should work with regular user privileges)
//     const collections = await db.listCollections().toArray()

//     // Count documents in each collection
//     let totalDocuments = 0
//     const collectionStats = []

//     for (const collection of collections) {
//       try {
//         const count = await db.collection(collection.name).countDocuments()
//         totalDocuments += count

//         // Get sample document to show collection structure
//         const sampleDoc = await db.collection(collection.name).findOne()

//         collectionStats.push({
//           name: collection.name,
//           documentCount: count,
//           sampleFields: sampleDoc ? Object.keys(sampleDoc).slice(0, 5) : [],
//         })
//       } catch (error) {
//         collectionStats.push({
//           name: collection.name,
//           documentCount: 0,
//           error: "Access denied or collection error",
//         })
//       }
//     }

//     // Get current time for uptime calculation
//     const startTime = Date.now()

//     const databaseInfo = {
//       status: "connected",
//       database: db.databaseName,
//       collections: collections.length,
//       collectionStats,
//       totalDocuments,
//       storageSize: dbStats?.storageSize || 0,
//       dataSize: dbStats?.dataSize || 0,
//       indexSize: dbStats?.indexSize || 0,
//       avgObjSize: dbStats?.avgObjSize || 0,
//       version: serverInfo?.version || "Unknown",
//       connectionTime: new Date().toISOString(),
//       // Since we can't get server status, we'll track our own connection info
//       connectionInfo: {
//         connected: true,
//         lastPing: new Date().toISOString(),
//         responseTime: Date.now() - startTime,
//       },
//       permissions: {
//         canReadCollections: true,
//         canGetStats: !!dbStats,
//         canGetServerInfo: !!serverInfo,
//         adminAccess: false, // We know this is false since serverStatus failed
//       },
//     }

//     return NextResponse.json(databaseInfo)
//   } catch (error: any) {
//     console.error("Database connection error:", error)

//     // Provide more specific error messages
//     const errorMessage = error.message
//     let suggestion = "Check your MongoDB Atlas configuration"

//     if (error.message.includes("authentication failed")) {
//       suggestion = "Check your MongoDB username and password in MONGODB_URI"
//     } else if (error.message.includes("not allowed")) {
//       suggestion = "Your MongoDB user needs additional permissions. Create a user with 'readWrite' role."
//     } else if (error.message.includes("ENOTFOUND")) {
//       suggestion = "Check your internet connection and MongoDB cluster URL"
//     }

//     return NextResponse.json(
//       {
//         status: "disconnected",
//         error: errorMessage,
//         database: null,
//         collections: 0,
//         totalDocuments: 0,
//         storageSize: 0,
//         dataSize: 0,
//         indexSize: 0,
//         troubleshooting: {
//           mongodbUri: process.env.MONGODB_URI ? "Set" : "Not set",
//           suggestion,
//           commonSolutions: [
//             "Ensure your MongoDB user has 'readWrite' permissions",
//             "Check if your IP is whitelisted in MongoDB Atlas",
//             "Verify the connection string format",
//             "Make sure the database name in the URI is correct",
//           ],
//         },
//       },
//       { status: 500 },
//     )
//   }
// }

// // Add endpoint to execute safe database queries
// export async function POST(request: Request) {
//   try {
//     const { query, collection } = await request.json()

//     if (!query || !collection) {
//       return NextResponse.json({ error: "Query and collection are required" }, { status: 400 })
//     }

//     const client = await connectToMongoDB()
//     const db = client.db()

//     // Only allow safe read operations
//     const allowedOperations = ["find", "findOne", "countDocuments", "distinct"]
//     const operation = Object.keys(query)[0]

//     if (!allowedOperations.includes(operation)) {
//       return NextResponse.json({ error: "Only read operations are allowed" }, { status: 400 })
//     }

//     let result
//     switch (operation) {
//       case "find":
//         result = await db
//           .collection(collection)
//           .find(query.find || {})
//           .limit(10)
//           .toArray()
//         break
//       case "findOne":
//         result = await db.collection(collection).findOne(query.findOne || {})
//         break
//       case "countDocuments":
//         result = await db.collection(collection).countDocuments(query.countDocuments || {})
//         break
//       case "distinct":
//         result = await db.collection(collection).distinct(query.distinct.field, query.distinct.filter || {})
//         break
//       default:
//         throw new Error("Unsupported operation")
//     }

//     return NextResponse.json({
//       success: true,
//       result,
//       operation,
//       collection,
//       timestamp: new Date().toISOString(),
//     })
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null

async function connectToMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  if (cachedClient) {
    return cachedClient
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    cachedClient = client
    return client
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`)
  }
}

export async function GET() {
  try {
    const client = await connectToMongoDB()
    const db = client.db()

    // Test the connection with a simple ping (this should work with any user)
    await client.db("admin").command({ ping: 1 })

    // Get basic database info without requiring admin privileges
    let dbStats = null
    let serverInfo = null

    // Try to get database stats (works with readWrite permissions)
    try {
      dbStats = await db.stats()
    } catch (error) {
      console.log("Cannot access db.stats() - limited permissions")
    }

    // Try to get build info instead of server status (less privileged)
    try {
      serverInfo = await db.admin().command({ buildInfo: 1 })
    } catch (error) {
      console.log("Cannot access build info - very limited permissions")
    }

    // Get collections (should work with readWrite)
    const collections = await db.listCollections().toArray()

    // Count documents in each collection
    let totalDocuments = 0
    const collectionStats = []

    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments()
        totalDocuments += count

        // Get a sample document to understand structure
        const sampleDoc = await db.collection(collection.name).findOne()

        collectionStats.push({
          name: collection.name,
          documentCount: count,
          sampleFields: sampleDoc ? Object.keys(sampleDoc).slice(0, 5) : [],
          lastAccessed: new Date().toISOString(),
        })
      } catch (error) {
        collectionStats.push({
          name: collection.name,
          documentCount: 0,
          error: "Access denied",
        })
      }
    }

    const databaseInfo = {
      status: "connected",
      database: db.databaseName,
      collections: collections.length,
      collectionStats,
      totalDocuments,
      storageSize: dbStats?.storageSize || 0,
      dataSize: dbStats?.dataSize || 0,
      indexSize: dbStats?.indexSize || 0,
      avgObjSize: dbStats?.avgObjSize || 0,
      version: serverInfo?.version || "Unknown",
      connectionTime: new Date().toISOString(),
      permissions: {
        canReadCollections: true,
        canGetStats: !!dbStats,
        canGetServerInfo: !!serverInfo,
        adminAccess: false,
      },
    }

    return NextResponse.json(databaseInfo)
  } catch (error: any) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "disconnected",
        error: error.message,
        errorCode: error.code,
        database: null,
        collections: 0,
        totalDocuments: 0,
        storageSize: 0,
        dataSize: 0,
        indexSize: 0,
        troubleshooting: {
          mongodbUri: process.env.MONGODB_URI ? "Configured" : "Not configured",
          suggestion: "Check MongoDB Atlas user permissions and network access",
        },
      },
      { status: 500 },
    )
  }
}