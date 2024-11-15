const mongoose = require("mongoose");
const Project = require("./Project");


const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    status: {
        type: String,
        enum: ["TO DO", "IN PROGRESS", "BLOCKED", "DONE"],
        default: "TO DO",
    },
    dueDate: Date,
    estimate: Number,
    timer: {
        start: Date,
        end: Date
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    worklog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worklog",
    }],
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "history",
    },
},
    { timestamps: true }
)

// Add task id to Project table post save
taskSchema.post("save", async function (doc) {
    const project = await Project.findById(doc.project);
    if (project.tasks.includes(doc._id)) return
    project.tasks.push(doc._id);
    await project.save();
});



module.exports = mongoose.model("Task", taskSchema);