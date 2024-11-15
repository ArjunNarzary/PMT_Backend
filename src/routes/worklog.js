
const express = require("express");
const { userAuth } = require("../middleware/user");
const { createWorkLog, updateWorklog, deleteWorkLog } = require("../controllers/worklogController");

const worklogRouter = express.Router()

worklogRouter.route("/").post(userAuth, createWorkLog);
worklogRouter.route("/:worklogId").put(userAuth, updateWorklog)
    .delete(userAuth, deleteWorkLog);

module.exports = worklogRouter;