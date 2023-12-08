import User from "../models/user.js";
import Task from "../models/task.js";

export const createUser = async (req,res) =>
{

    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        pendingTasks: req.body.pendingTasks,
        dateCreated: Date.now()
    })
    
    try {
        const newUser = await user.save()
        res.status(201).json({message: "OK", data: newUser})
    } catch (err) {
        res.status(400).json({message: "Malformed Request", data: [] })
    }
}



export const getAllUsers = async (req, res) =>{



    var querySelect = req.query.select
    try {
        querySelect = JSON.parse(req.query.select)
    } catch {
        querySelect = req.query.select
    }
    var querySort = req.query.sort
    try {
        var querySort = JSON.parse(req.query.sort)
    } catch {
        querySort = req.query.sort
    }
    var queryWhere = req.query.where
    try {
        queryWhere = JSON.parse(req.query.where)
    } catch {
        queryWhere = req.query.where
    }
    let count = req.query.count
    let querySkip = Number(req.query.skip)
    let queryLimit = Number(req.query.limit)




    
    try{
        var userList
        if(count)
        {
             userList = await User.find(queryWhere).limit(queryLimit).skip(querySkip).sort(querySort).select(querySelect).count();
        } else{  userList = await User.find(queryWhere).limit(queryLimit).skip(querySkip).sort(querySort).select(querySelect);}
        res.status(200).json({data:userList,message:"ok"})
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

// this function is to unassign the user from all the tasks before deleting or updating the user
const UATasks = async(list) =>{
    for(const item of list){
        const task = await Task.findById(item);
        task.assignedUser = "";
        task.assignedUserName = "unassigned";
        await task.save()
    }
}

export const deleteUser = async (req, res) =>{
    const id = req.params.id;
    const user = await User.findById(id)
    const list = user.pendingTasks
    UATasks(list)
    try {
         await User.findOneAndDelete(id)
         res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
   

}

export const updateUser = async (req, res) =>{
    const id = req.params.id;
    const user = await User.findById(id)
    const list = user.pendingTasks
    UATasks(list)
    user.name = req.body.name;
    user.email = req.body.email;
    user.pendingTasks = req.body.pendingTasks;
    try {
        const updatedUser = await user.save()
        res.status(200).json({message: "OK", data: updatedUser})
    } catch (err) {
        res.status(400).json({message: "Malformed Request", data: [] })
    }

}   

export const getUser = async (req, res) => {
    console.log("trigger")
    try {
      
        const id = req.params.id
        console.log(id)
        const user = await User.findById(id);
        console.log(user)
        res.status(200).json(user)
    
    }
    catch(error)
    {
        res.status(404).json({message:error.message})
    }
    }