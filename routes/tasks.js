import express from "express";
import { gettask,getAllTasks,createTask,deleteTask,updateTask } from "../controllers/tasks.js";




const router = express.Router()

router.delete("/:id",deleteTask)
router.get("/:id",gettask)
router.put("/:id",updateTask)
router.get("/",getAllTasks)
router.post("/",createTask)

export default router