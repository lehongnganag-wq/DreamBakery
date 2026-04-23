const Danhmuc = require("../models/danhmuc");


exports.getAll = async (req, res) => {
    try {
        const data = await Danhmuc.find().sort({ createdAt: -1 });
        res.render("admin/danhmuc", {
            title: "Quản lý danh mục",
            categories: data,
            layout: "admin/layout" 
        });
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        res.status(500).send("Không thể tải danh sách danh mục.");
    }
};


exports.create = async (req, res) => {
    try {
        const { TenDanhMuc, MoTa } = req.body;
        
        const existing = await Danhmuc.findOne({ TenDanhMuc });
        if (existing) {
            return res.send("<script>alert('Tên danh mục đã tồn tại!'); window.location='/admin/danhmuc';</script>");
        }

        await Danhmuc.create({ TenDanhMuc, MoTa });
        res.redirect("/admin/danhmuc");
    } catch (error) {
        res.status(500).send("Lỗi khi thêm danh mục mới.");
    }
};


exports.update = async (req, res) => {
    try {
        const { TenDanhMuc, MoTa } = req.body;
        const id = req.params.id;

        const existing = await Danhmuc.findOne({ TenDanhMuc, _id: { $ne: id } });
        if (existing) {
            return res.send("<script>alert('Tên danh mục này đã tồn tại!'); window.location='/admin/danhmuc';</script>");
        }

        await Danhmuc.findByIdAndUpdate(id, { 
            TenDanhMuc, 
            MoTa 
        });

        res.redirect("/admin/danhmuc");
    } catch (error) {
        console.error("Lỗi cập nhật danh mục:", error);
        res.status(500).send("Lỗi khi cập nhật danh mục.");
    }
};

exports.remove = async (req, res) => {
    try {
        await Danhmuc.findByIdAndDelete(req.params.id);
        res.redirect("/admin/danhmuc");
    } catch (error) {
        res.status(500).send("Lỗi khi xoá danh mục.");
    }
};