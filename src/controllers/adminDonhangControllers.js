const Donhang = require("../models/donhang");
const User = require("../models/User"); // BẮT BUỘC phải có để hiện tên khách hàng

exports.getAllOrders = async (req, res) => {
    try {
        // .populate("NguoiDung") là chìa khóa để hiện tên khách hàng
        const orders = await Donhang.find()
            .populate("NguoiDung") 
            .sort({ createdAt: -1 });

        res.render("admin/donhang", {
            title: "Quản lý đơn hàng",
            orders,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi tải danh sách");
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Donhang.findById(req.params.id)
            .populate("NguoiDung")
            .populate("DanhSachSanPham.SanPham");
            
        if (!order) return res.status(404).send("Không tìm thấy đơn hàng");

        res.render("admin/chitiet_donhang", {
            title: "Chi tiết đơn hàng",
            order,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi hệ thống: " + error.message);
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Donhang.findByIdAndUpdate(orderId, { TrangThai: status });
        res.redirect("/admin/donhang");
    } catch (error) {
        res.status(500).send("Lỗi cập nhật trạng thái");
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Donhang.findByIdAndDelete(req.params.id);
        res.redirect("/admin/donhang");
    } catch (error) {
        res.status(500).send("Lỗi xóa đơn hàng");
    }
};