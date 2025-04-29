// src/routes/tasks.ts
import express from 'express';
import { fetchAllTasks } from '../taskManager';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const tasks = await fetchAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

export default router;
