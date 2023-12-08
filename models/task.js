import mongoose from "mongoose";

const taskschema = mongoose.Schema({
    name: {type: String, required: true},
    description: { type: String, default: "" },
    deadline: {type: String, required: true},
    completed: { type: Boolean, default: false },
    assignedUser: { type: String, default: "" },
    assignedUserName: { type: String, default: "unassigned" },
    dateCreated: { type: Date, default: Date.now }
});

export default mongoose.model("Task",taskschema);