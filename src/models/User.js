const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
        lowercase: true,
    },
    username: String,
    password: {
        type: String,
        required: [true, "Password is required"],
    }
}, { timestamps: true })


//HASH PASSWORD
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//Check password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//GENEARATE TOKEN
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = mongoose.model("User", userSchema);