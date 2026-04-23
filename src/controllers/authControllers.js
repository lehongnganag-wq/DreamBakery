const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render("register", {
                title: "Đăng ký",
                layout: "layout",
                error: "Vui lòng nhập đầy đủ thông tin!",
                old: req.body
            });
        }

    
        const userExists = await User.findOne({ Email: email });
        if (userExists) {
            return res.render("register", {
                title: "Đăng ký",
                layout: "layout",
                error: "Email đã tồn tại!",
                old: req.body
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        
        await User.create({
            HoVaTen: name,
            Email: email,
            TenDangNhap: email, 
            MatKhau: hashed,
            QuyenHan: "user"
        });

        res.redirect("/auth/login");

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        res.render("register", {
            title: "Đăng ký",
            layout: "layout",
            error: "Lỗi server!",
            old: req.body
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", {
                title: "Đăng nhập",
                layout: "layout",
                error: "Vui lòng nhập đầy đủ!"
            });
        }

      
        const user = await User.findOne({ Email: email });

        if (!user) {
            return res.render("login", {
                title: "Đăng nhập",
                layout: "layout",
                error: "Sai email!"
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.MatKhau);

        if (!isMatch) {
            return res.render("login", {
                title: "Đăng nhập",
                layout: "layout",
                error: "Sai mật khẩu!"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.QuyenHan },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        if (user.QuyenHan === "admin") return res.redirect("/admin");

        res.redirect("/");

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.render("login", {
            title: "Đăng nhập",
            layout: "layout",
            error: "Lỗi server!"
        });
    }
};

// ================= ĐĂNG XUẤT =================
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
};