const router = require("express").Router();
const { register, login, logout } = require("../controllers/authControllers");

const redirectIfAuthenticated = (req, res, next) => {
    if (req.cookies && req.cookies.token) return res.redirect("/");
    next();
};

router.get("/register", redirectIfAuthenticated, (req, res) => {
    res.render("register", {
        title: "Đăng ký",
        layout: "layout",
        error: null
    });
});
router.post("/register", register);

router.get("/login", redirectIfAuthenticated, (req, res) => {
    res.render("login", {
        title: "Đăng nhập",
        layout: "layout",
        error: null
    });
});
router.post("/login", login);

router.get("/logout", logout);

module.exports = router;