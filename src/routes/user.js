const express = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const { userAuth } = require("../middleware/user");

const userRouter = express.Router()

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(userAuth, getAllUsers);

module.exports = userRouter;