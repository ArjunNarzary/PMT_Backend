require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./config/database");
const cookieParser = require("cookie-parser");
const router = require("./routes");

const app = express();
connectDatabase();

app.use(express.json());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);
app.use(cookieParser());
app.use("/", router);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




