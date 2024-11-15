const mongoose = require("mongoose");


const historySchema = new mongoose.Schema({
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },

},
    { timestamps: true }
)

module.exports = mongoose.model("History", historySchema);