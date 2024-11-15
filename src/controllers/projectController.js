const { Project } = require("../models");
const { CreateProjectSchema } = require("../validation");
var ObjectId = require("mongoose").Types.ObjectId;

const createProject = async (req, res) => {
    const parsedData = CreateProjectSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }
    try {
        const project = await Project.create({
            title: parsedData.data.title,
            description: parsedData.data.description,
            creator: req.userId
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('creator', { name: 1, email: 1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        //Validate id
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Project not found" });
        }

        const project = await Project.findById(req.params.id).populate('creator', { name: 1, email: 1 }).populate('tasks');
        if (!project) {
            return res.status(400).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}


module.exports = {
    createProject,
    getAllProjects,
    getProjectDetails
}