// src/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import tasksRoute from './routes/tasks';
import { addTask } from './taskManager';
import { Task } from './types/Task';
import './redisClient';
import './mongoClient';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

app.use('/fetchAllTasks', tasksRoute);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('add', async (task: Task) => {
    if (!task?.text) {
        socket.emit('error', { message: 'Task title is required.' });
        return;
      }      
    await addTask(task);
    io.emit('taskAdded', task); // Notify all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
