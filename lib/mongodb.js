import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable');
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable');
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = MongoClient.connect(MONGO_URL, opts).then((client) => {
      return {
        client,
        db: client.db(DB_NAME),
      };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function getCollection(name) {
  const { db } = await connectToDatabase();
  return db.collection(name);
}