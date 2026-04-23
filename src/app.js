require('dotenv').config(); 
const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); 

const User = require("./models/User");
console.log("NEW BUILD RUNNING...");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(process.cwd(), "src", "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); 

app.use(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
            const user = await User.findById(decoded.id).select("-password");
            res.locals.user = user; 
        } else {
            res.locals.user = null;
        }
      
        res.locals.products = res.locals.products || []; 
        next();
    } catch (err) {
        res.locals.user = null;
        next();
    }
});

const help = require("./routes/help");
const indexRoutes = require("./routes/index");
const auth = require("./routes/auth");
const sanpham = require("./routes/sanpham");
const adminSanpham = require("./routes/adminSanpham");
const giohang = require("./routes/giohang");
const donhang = require("./routes/donhang"); 
const danhmuc = require("./routes/danhmuc");
const admin = require("./routes/admin");
const adminDonhang = require("./routes/adminDonhang"); 
const khuyenmai = require("./routes/khuyenmai"); 

app.use("/", indexRoutes); 
app.use("/auth", auth);
app.use("/sanpham", sanpham); 
app.use("/giohang", giohang);
app.use("/donhang", donhang); 

app.get("/login", (req, res) => res.redirect("/auth/login"));
app.get("/register", (req, res) => res.redirect("/auth/register"));
app.get("/logout", (req, res) => res.redirect("/auth/logout"));

app.use("/admin/sanpham", adminSanpham); 
app.use("/admin/danhmuc", danhmuc);
app.use("/admin/donhang", adminDonhang); 
app.use("/admin/khuyenmai", khuyenmai); 
app.use("/admin", admin);
app.use("/help", help);

app.use((req, res) => {
    res.status(404).render("404", {
        title: "Không tìm thấy trang",
        user: res.locals.user || null,
        products: [], 
        layout: false
    });
});

app.use((err, req, res, next) => {
    console.error("🔥 LỖI HỆ THỐNG:", err.message);
    res.status(500).send('Có lỗi xảy ra từ hệ thống: ' + err.message);
});

module.exports = app;