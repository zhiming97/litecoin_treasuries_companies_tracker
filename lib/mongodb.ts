import { MongoClient, Db } from 'mongodb'

const uri: string | undefined = process.env.MONGODB_URI
const options = {}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper function to get the database
export async function getDatabase(dbName?: string): Promise<Db> {
  if (!clientPromise) {
    throw new Error('MongoDB URI is not configured. Please add MONGODB_URI to your .env.local file')
  }
  const client = await clientPromise
  return client.db(dbName || process.env.MONGODB_DB_NAME || 'holdings')
}

