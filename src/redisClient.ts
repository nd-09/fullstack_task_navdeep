// src/redisClient.ts
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost'; // Default to 'localhost' if not found
const redisPort = parseInt(process.env.REDIS_PORT || '6379'); // Default to 6379 if not found
const redisUsername = process.env.REDIS_USERNAME || ''; // Default to empty string if not found
const redisPassword = process.env.REDIS_PASSWORD || ''; // Default to empty string if not found

export const redisClient = createClient({
  url: `redis://${redisUsername}:${redisPassword}@${redisHost}:${redisPort}`
});

// Function to connect to Redis
const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection failed', err);
  }
};

connectToRedis();
