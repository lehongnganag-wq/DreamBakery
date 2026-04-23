const Sanpham = require("../models/sanpham"); 
const Danhmuc = require("../models/danhmuc");

exports.getSanpham = async (req, res) => {
    try {
        const loai_id = req.query.loai;
        const categories = await Danhmuc.find();
        let filter = { TrangThai: true }; 

        if (loai_id) {
            filter.DanhMuc = loai_id;
        }

        const products = await Sanpham.find(filter)
            .populate("DanhMuc")
            .sort({ createdAt: -1 });

        res.render("customer/Sanpham", {
            title: "Sản phẩm - Dream Bakery",
            products: products, 
            categories: categories, 
            currentCategory: loai_id || null, 
            layout: "layout" 
        });
    } catch (error) {
        console.error("Lỗi tải sản phẩm khách hàng:", error);
        res.status(500).send("Lỗi tải sản phẩm");
    }
};


exports.getById = async (req, res) => {
    try {
        
        const product = await Sanpham.findById(req.params.id).populate("DanhMuc");
        
        if (!product) {
            return res.status(404).send("Sản phẩm không tồn tại");
        }

        res.render("customer/chitiet_sanpham", {
            title: product.TenSanPham, 
            product: product, 
            layout: "layout"
        });
    } catch (error) {
        console.error("Lỗi chi tiết sản phẩm:", error);
        res.status(500).send("Lỗi chi tiết sản phẩm");
    }
};