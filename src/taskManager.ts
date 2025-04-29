// src/taskManager.ts
import { redisClient } from './redisClient';
import { tasksCollection } from './mongoClient';
import { Task } from './types/Task';

const REDIS_KEY = 'FULLSTACK_TASK_NAVDEEP_CHOVATIYA'; 

export const addTask = async (task: Task) => {
  const existing = await redisClient.get(REDIS_KEY);
  const tasks = existing ? JSON.parse(existing) as Task[] : [];

  tasks.push(task);

  if (tasks.length > 50) {
    await tasksCollection.insertMany(tasks);
    await redisClient.del(REDIS_KEY);
  } else {
    await redisClient.set(REDIS_KEY, JSON.stringify(tasks));
  }
};

export const fetchAllTasks = async (): Promise<Task[]> => {
  const redisData = await redisClient.get(REDIS_KEY);
  const redisTasks = redisData ? JSON.parse(redisData) : [];

  const mongoTasks = await tasksCollection.find({}).toArray();
  return [...mongoTasks, ...redisTasks];
};
