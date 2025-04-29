import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost'; 
const redisPort = parseInt(process.env.REDIS_PORT || '6379'); 
const redisUsername = process.env.REDIS_USERNAME || ''; 
const redisPassword = process.env.REDIS_PASSWORD || ''; 

export const redisClient = createClient({
  url: `redis://${redisUsername}:${redisPassword}@${redisHost}:${redisPort}`
});

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection failed', err);
  }
};

connectToRedis();
