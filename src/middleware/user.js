const jwt = require('jsonwebtoken')
exports.userAuth = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        req.userId = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthorized" });
    }

}