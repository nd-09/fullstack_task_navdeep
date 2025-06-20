import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { redisClient } from "./redisClient";
import { mongoClient, tasksCollection,db } from "./mongoClient";
import cors from "cors";
import { createTask } from "./utils/createTask";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle add task event
  socket.on("add", async (taskData: { text: string; createdAt: string }) => {
    try {
      // Create a task with the proper ID using the createTask utility
      const task = createTask(taskData);

      const tasks = await redisClient.lRange("FULLSTACK_TASKS_Navdeep", 0, -1);
      let taskList = tasks.map((task) => JSON.parse(task));

      // Add the new task to the list
      taskList.push(task);

      if (taskList.length > 50) {
        await tasksCollection.insertMany(taskList);

        await redisClient.del("FULLSTACK_TASKS_Navdeep");

        console.log("Moved tasks to MongoDB and cleared Redis");
      } else {
        await redisClient.del("FULLSTACK_TASKS_Navdeep");
        const serializedTasks = taskList.map((t) => JSON.stringify(t));
        await redisClient.rPush("FULLSTACK_TASKS_Navdeep", serializedTasks);

        console.log("Task added to Redis");
      }

      socket.emit("taskAdded", task);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  });

  // Handle get tasks event
  socket.on("getTasks", async () => {
    try {
      let tasks = await redisClient.lRange("FULLSTACK_TASKS_Navdeep", 0, -1);

      if (tasks.length === 0) {
        const mongoTasks = await tasksCollection.find().toArray();
        tasks = mongoTasks.map((task) => JSON.stringify(task)); // Convert MongoDB tasks to stringified format
      }

      // Emit the tasks back to the client
      socket.emit("tasksFetched", tasks.map((task) => JSON.parse(task)));
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/fetchAllTasks", async (req, res) => {
  try {
    let tasks = await redisClient.lRange("FULLSTACK_TASKS_Navdeep", 0, -1);
    if (tasks.length === 0) {
      const mongoTasks = await tasksCollection.find().toArray();
      tasks = mongoTasks.map((task) => JSON.stringify(task));
    }

    res.json(tasks.map((task) => JSON.parse(task)));
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
