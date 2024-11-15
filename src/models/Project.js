const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    }],
},
    { timestamps: true }
)

module.exports = mongoose.model("Project", projectSchema);