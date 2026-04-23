const Sanpham = require("../models/sanpham");
const Danhmuc = require("../models/danhmuc");
const fs = require("fs");
const path = require("path");


const deleteOldImage = (imagePath) => {
    if (imagePath && imagePath !== "/images/default.png") {
        const fullPath = path.join(process.cwd(), "public", imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

exports.adminGetProducts = async (req, res) => {
    try {
        const products = await Sanpham.find().populate("DanhMuc").sort({ createdAt: -1 });
        res.render("admin/sanpham", {
            title: "Quản lý sản phẩm",
            products,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi tải danh sách sản phẩm");
    }
};


exports.renderCreatePage = async (req, res) => {
    try {
        const categories = await Danhmuc.find();
        res.render("admin/add-sanpham", {
            title: "Thêm bánh mới",
            categories,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi trang thêm");
    }
};


exports.create = async (req, res) => {
    try {
        const { TenSanPham, Gia, SoLuong, DanhMuc, MoTa } = req.body;
        
       
        if (!req.file) {
            return res.status(400).send("Lỗi: Chưa chọn ảnh hoặc Multer không nhận được file. Hãy kiểm tra enctype='multipart/form-data' ở Form.");
        }

        const HinhAnh = `/images/${req.file.filename}`;

        await Sanpham.create({
            TenSanPham,
            Gia: Number(Gia),
            SoLuong: Number(SoLuong),
            DanhMuc,
            HinhAnh,
            MoTa
        });

        res.redirect("/admin/sanpham");
    } catch (error) {
        console.error("Lỗi Create:", error);
        res.status(500).send("Lỗi khi tạo sản phẩm: " + error.message);
    }
};


exports.renderEditPage = async (req, res) => {
    try {
        const [product, categories] = await Promise.all([
            Sanpham.findById(req.params.id),
            Danhmuc.find()
        ]);
        res.render("admin/edit-sanpham", {
            title: "Sửa sản phẩm",
            product,
            categories,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi trang sửa");
    }
};


exports.update = async (req, res) => {
    try {
        const { TenSanPham, Gia, SoLuong, DanhMuc, MoTa } = req.body;
        const product = await Sanpham.findById(req.params.id);
        
        const updateData = { 
            TenSanPham, 
            Gia: Number(Gia), 
            SoLuong: Number(SoLuong), 
            DanhMuc, 
            MoTa 
        };

        if (req.file) {
            
            deleteOldImage(product.HinhAnh);
            updateData.HinhAnh = `/images/${req.file.filename}`;
        }

        await Sanpham.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/admin/sanpham");
    } catch (error) {
        console.error("Lỗi Update:", error);
        res.status(500).send("Lỗi cập nhật");
    }
};

exports.remove = async (req, res) => {
    try {
        const product = await Sanpham.findById(req.params.id);
        if (product) {
           
            deleteOldImage(product.HinhAnh);
            await Sanpham.findByIdAndDelete(req.params.id);
        }
        res.redirect("/admin/sanpham");
    } catch (error) {
        res.status(500).send("Lỗi xóa");
    }
};