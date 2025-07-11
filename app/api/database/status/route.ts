import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

async function connectToMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
}

export async function GET() {
  try {
    const client = await connectToMongoDB();
    const db = client.db();

    await client.db("admin").command({ ping: 1 });

    let dbStats = null;
    let serverInfo = null;

    try {
      dbStats = await db.stats();
    } catch (error) {
      console.log("Cannot access db.stats() - limited permissions");
    }

    try {
      serverInfo = await db.admin().command({ buildInfo: 1 });
    } catch (error) {
      console.log("Cannot access build info - very limited permissions");
    }

    const collections = await db.listCollections().toArray();

    let totalDocuments = 0;
    const collectionStats = [];

    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        totalDocuments += count;

        const sampleDoc = await db.collection(collection.name).findOne();

        collectionStats.push({
          name: collection.name,
          documentCount: count,
          sampleFields: sampleDoc ? Object.keys(sampleDoc).slice(0, 5) : [],
          lastAccessed: new Date().toISOString(),
        });
      } catch (error) {
        collectionStats.push({
          name: collection.name,
          documentCount: 0,
          error: "Access denied",
        });
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
    };

    return NextResponse.json(databaseInfo);
  } catch (error: any) {
    console.error("Database connection error:", error);

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
      { status: 500 }
    );
  }
}