const mongoose = require("mongoose");
const Task = require("./Task");

const worklogSchema = new mongoose.Schema({
    description: String,
    timeSpent: Number,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    }
},
    { timestamps: true }
)

// Add worklogId to task tablel save
worklogSchema.post("save", async function (doc) {
    const task = await Task.findById(doc.task);
    if (task.worklog.includes(doc._id)) return
    task.worklog.push(doc._id);
    await task.save();
});


module.exports = mongoose.model("Worklog", worklogSchema);