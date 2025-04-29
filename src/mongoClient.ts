// src/mongoClient.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';


dotenv.config();

const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'assignment';
const collectionName = process.env.MONGO_COLLECTION_NAME || 'tasks';

export const mongoClient = new MongoClient(mongoUri);
export const db = mongoClient.db(dbName);
export const tasksCollection = db.collection(collectionName); 

const connectToMongo = async () => {
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed', err);
  }
};

connectToMongo();
