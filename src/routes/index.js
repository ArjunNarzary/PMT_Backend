
const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const projectRouter = require("./project");
const taskRouter = require("./task");
const worklogRouter = require("./worklog");

router.get("/", (req, res) => {
    res.send("Hello world");
});

router.use("/user", userRouter);
router.use("/project", projectRouter);
router.use("/task", taskRouter);
router.use("/worklog", worklogRouter);


module.exports = router;