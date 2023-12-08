import  express from "express";
import { createUser }from "../controllers/users.js";
import { getAllUsers } from "../controllers/users.js";
import { getUser, updateUser, deleteUser } from "../controllers/users.js"



const router = express.Router();

router.put("/:id",updateUser)
router.delete("/:id",deleteUser)
router.get("/:id", getUser);
router.get("/",getAllUsers);
router.post("/",createUser);



export default router;