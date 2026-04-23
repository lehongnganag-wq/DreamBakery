const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
        req.user = decoded;
        if (decoded.role !== "admin") {
            return res.status(403).send("Truy cập bị từ chối: Bạn không có quyền vào Admin!");
        }
        next();

    } catch (err) {
        return res.redirect("/login");
    }
};