const { Worklog, Task } = require("../models");
const { CreateWorklogSchema } = require("../validation");

const ObjectId = require("mongoose").Types.ObjectId;

const createWorkLog = async (req, res) => {
    const parsedData = CreateWorklogSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }
    try {

        const { taskId } = parsedData.data;
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Task not found" });
        }

        const task = await Task.findById(taskId).populate('assignee', { name: 1, email: 1 });
        if (!task) {
            return res.status(400).json({ message: "Task not found" });
        }

        //Restrict user to create worklog if task is not assigned to the current user
        if (task.assignee._id.toString() !== req.userId.toString() || !task?.assignee?._id) {
            return res.status(400).json({ message: "You are not allowed to create worklog for this task" });
        }

        const worklog = await Worklog.create({
            description: parsedData.data.description,
            task: taskId,
            creator: req.userId,
            timeSpent: parsedData.data.timeSpent,
            user: req.userId
        });
        res.status(201).json(worklog);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const updateWorklog = async (req, res) => {
    const { worklogId } = req.params;
    if (!ObjectId.isValid(worklogId)) {
        return res.status(400).json({ message: "Worklog not found" });
    }
    try {
        const worklog = await Worklog.findById(worklogId).populate('creator', { name: 1 });
        if (!worklog) {
            return res.status(400).json({ message: "Worklog not found" });
        }

        //Validate user
        if (worklog.creator._id.toString() !== req.userId.toString()) {
            return res.status(400).json({ message: "You are not allowed to update this worklog" });
        }

        worklog.description = req?.body?.description || worklog.description;
        worklog.timeSpent = req?.body?.timeSpent || worklog.timeSpent;
        await worklog.save();
        return res.status(200).json(worklog);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const deleteWorkLog = async (req, res) => {
    const { worklogId } = req.params;
    if (!ObjectId.isValid(worklogId)) {
        return res.status(400).json({ message: "Worklog not found" });
    }
    try {
        const worklog = await Worklog.findById(worklogId).populate('creator', { name: 1 }).populate('task', { title: 1 });
        if (!worklog) {
            return res.status(400).json({ message: "Worklog not found" });
        }

        //Validate user
        if (worklog.creator._id.toString() !== req.userId.toString()) {
            return res.status(400).json({ message: "You are not allowed to delete this worklog" });
        }

        await Worklog.deleteOne();

        //Remove worklof from task
        const task = await Task.findById(worklog.task._id);
        task.worklog = task.worklog.filter((worklog) => worklog.toString() !== worklogId);
        await task.save();

        return res.status(200).json({ message: "Worklog deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}



module.exports = { createWorkLog, updateWorklog, deleteWorkLog }