const { User } = require("../models");
const { RegisterSchema, LoginSchema } = require("../validation");

const registerUser = async (req, res) => {
    const parsedData = RegisterSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }

    try {
        //Check if email already exist
        const userExist = await User.findOne({ email: parsedData.data.email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exist" });
        }
        const user = await User.create(parsedData.data);
        const token = await user.generateToken();
        res.status(201).json({
            name: user.name,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const loginUser = async (req, res) => {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.issues[0].message });
    }

    try {
        const user = await User.findOne({ email: parsedData.data.email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await user.matchPassword(parsedData.data.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        const token = await user.generateToken();

        res.status(200).json({
            name: user.name,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getAllUsers
}