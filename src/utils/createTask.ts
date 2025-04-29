import { Task } from '../types/Task';

export function createTask(data: { text: string; createdAt: string }): Task {
  return {
    id: Date.now().toString(), 
    text: data.text,
    createdAt: data.createdAt,
  };
}
