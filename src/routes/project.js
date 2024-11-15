const express = require("express");
const { createProject, getAllProjects, getProjectDetails } = require("../controllers/projectController");
const { userAuth } = require("../middleware/user");

const projectRouter = express.Router()

projectRouter.route("/").get(userAuth, getAllProjects)
    .post(userAuth, createProject);
projectRouter.route("/:id").get(userAuth, getProjectDetails);

module.exports = projectRouter;