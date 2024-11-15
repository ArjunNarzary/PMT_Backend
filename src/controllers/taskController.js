const { Task, Project } = require("../models");
const { CreateTaskSchema, UpdateTaskSchema } = require("../validation");

var ObjectId = require("mongoose").Types.ObjectId;

const createTask = async (req, res) => {
    const { projectId } = req.params;
    if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Project not found" });
    }

    const parsedData = CreateTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }

    try {
        //Check if project exist
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ message: "Project not found" });
        }

        const task = await Task.create({
            title: parsedData.data.title,
            description: parsedData?.data?.description || '',
            priority: parsedData?.data?.priority || "low",
            status: "TO DO",
            dueDate: parsedData?.data?.dueDate || undefined,
            estimate: parsedData?.data?.estimate || undefined,
            project: req.params.projectId,
            creator: req.userId
        });


        return res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const getAllTask = async (req, res) => {
    const { projectId } = req.params;
    if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Project not found" });
    }

    try {
        const tasks = await Task.find({ project: projectId })
            .populate('creator', { name: 1, email: 1 })
            .populate('assignee', { name: 1, email: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const getTaskDetails = async (req, res) => {
    const { taskId } = req.params;
    if (!ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Project not found" });
    }

    try {
        const task = await Task.findById(req.params.taskId)
            .populate('creator', { name: 1, email: 1 })
            .populate('assignee', { name: 1, email: 1 })
            .populate('project', { title: 1, description: 1 })
            .populate('worklog', { description: 1, timeSpent: 1, createdAt: 1 });
        if (!task) {
            return res.status(400).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.log("error", error)
        res.status(400).json({ message: "Something went wrong" });
    }
}

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    if (!ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Project not found" });
    }

    const parsedData = UpdateTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }

    try {
        //Check if task exist
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: "task not found" });
        }

        task.title = parsedData?.data?.title || task.title;
        task.description = parsedData?.data?.description || task?.description;
        task.priority = parsedData?.data?.priority || task?.priority;
        task.dueDate = parsedData?.data?.dueDate || task?.dueDate;
        task.estimate = parsedData?.data?.estimate || task.estimate;
        task.status = parsedData?.data?.status || task.status;
        task.timer = parsedData?.data?.timer ? { ...task?.timer, ...parsedData?.data?.timer } : task?.timer;
        task.assignee = parsedData?.data?.assignee || task?.assignee;
        await task.save();
        return res.status(200).json(task);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Something went wrong" });
    }


}


module.exports = { createTask, updateTask, getTaskDetails, getAllTask };