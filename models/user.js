import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    pendingTasks: {type: [String], default: []},
    dateCreated: { type: Date, default: Date.now }
})

 export default mongoose.model('User', userSchema)