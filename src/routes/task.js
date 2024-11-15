const express = require("express");
const { userAuth } = require("../middleware/user");
const { createTask, updateTask, getTaskDetails, getAllTask } = require("../controllers/taskController");

const taskRouter = express.Router()

// taskRouter.route("/create/:projectId").post(userAuth, createTask);
taskRouter.route("/:projectId").get(userAuth, getAllTask).post(userAuth, createTask);
taskRouter.route("/:taskId").put(userAuth, updateTask)
    .get(userAuth, getTaskDetails);

module.exports = taskRouter;