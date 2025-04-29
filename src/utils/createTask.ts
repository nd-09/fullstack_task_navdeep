// src/utils/createTask.ts
import { Task } from '../types/Task';

export function createTask(data: { text: string; createdAt: string }): Task {
  return {
    id: Date.now().toString(), // Or uuid(),
    text: data.text,
    createdAt: data.createdAt,
  };
}
