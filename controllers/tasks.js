import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req,res) =>
{
   
    // console.log(req.body)
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        deadline: req.body.deadline,
        completed: req.body.completed,
        assignedUser: req.body.assignedUser,
        assignedUserName: req.body.assignedUserName,
        dateCreated: Date.now()
    });
    
  try {
    const newTask = await task.save();

    if(task.assignedUser!=="")
    {
        
        const user = await User.findById(req.body.assignedUser);
        if(user) {
            user.pendingTasks.push(newTask._id);
            await user.save();
        }
    }
       return res.status(201).json({message: "OK", data: newTask})
    } catch (err) {
        console.log(err);
        return res.status(400).json({message: "Malformed Request", data: [] })
    }
} 


export const getAllTasks = async (req,res)=>{


    
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


    try {
        var allTasks
        if(count)
        {
            allTasks = await Task.find(queryWhere).limit(queryLimit).skip(querySkip).sort(querySort).select(querySelect).count();
        } 
        else{ 
            allTasks = await Task.find(queryWhere)
            .limit(queryLimit)
            .skip(querySkip)
            .sort(querySort)
            .select(querySelect);}
            res.status(200).json({data:allTasks,message:"ok"})
    } catch(error){
        res.status(404).json({message: error.message});
    }
}


// gettask:id -> details of task

export const gettask = async(req,res) =>{
    try {

        const id = req.params.id;
        const task = await Task.findById(id);
        
        if(task) {
            res.status(200).json(task)
        }else res.status(404).json({message : "Invalid task id"})
        
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const deleteTask = async(req,res) =>
{
    
    try { 
    const id = req.params.id;
    const task = await Task.findById(id);
    console.log(task)

    if(task===null) {
    res.status(404).json({message: 'Task not found'}); return;
    }
 else {

    if(task.assignedUser!="")
    {
    const user_id = task.assignedUser;
    const user = await User.findById(user_id);
    const pending_task = user.pendingTasks
    const update = pending_task.filter((item => item !== id));
    console.log(update)
    user.pendingTasks = update;
    user.save()}

    try {
        console.log("delete pending tasks")
        console.log(id)
        await Task.findOneAndDelete({_id:id})
    } catch (error) {
        res.status(500).json({message:error.message})
    }

    res.status(200).json({message:"Task deleted successfully"})
 }
        
    } catch (error) {
        res.status(404).json({message: error.message});
    }

}


// puttask:id -> replace entire task

export const updateTask = async(req, res) => {
    
    try {
        const id = req.params.id;
        const task = await Task.findById(id);
        if(task===null){
            res.status(404).json({message: 'Task not found'}); return;
        }
        else {

            const prevUser = task.assignedUser
            task.name = req.body.name;
            task.description = req.body.description;
            task.deadline = req.body.deadline;
            task.completed = req.body.completed;
            task.assignedUser = req.body.assignedUser;
            task.assignedUserName = req.body.assignedUserName;
            await task.save()

            if(prevUser===task.assignedUser) {
                return;
            }
     // adding task in new user

            if(task.assignedUser!="")
            { 
                const user = await User.findById(req.body.assignedUser);
                user.pendingTasks.push(id);
                user.save();
            }

    //    remove from previous users pending tasks
          
            if(prevUser!=="") {
            
                const user_id = prevUser;
                const olduser = await User.findById(user_id);
                const pending_task = olduser.pendingTasks
                const update = pending_task.filter((item => item!== id));
                olduser.pendingTasks = update;
                olduser.save()
            }

                   


                   
            res.status(200).json(task)
        }
    } catch (error) {
        console.log("here")
        res.status(404).json({message:error.message})
    }
}