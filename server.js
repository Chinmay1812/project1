import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import users from "./routes/users.js";
import tasks from "./routes/tasks.js";
import cors from 'cors';

const app = express();
app.use(cors());



// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express API' });
});

// Define your API routes here
app.use("/api/users",users)
app.use("/api/tasks",tasks)

// Error handling middleware


const URL = "mongodb+srv://todo-backend:mVClHmEN6JjseiYp@cluster0.rpgmaio.mongodb.net/?retryWrites=true&w=majority"
const PORT = 4000;
const DATABASE_URL = URL;

mongoose
  .connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
