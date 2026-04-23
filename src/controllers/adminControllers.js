const User = require("../models/User");
const Donhang = require("../models/donhang");
const Sanpham = require("../models/sanpham");
const Danhmuc = require("../models/danhmuc");

exports.getDashboard = async (req, res) => {
    try {

        const [users, products, orders] = await Promise.all([
            User.find(),
            Sanpham.find(),

            Donhang.find().populate("NguoiDung").sort({ createdAt: -1 })
        ]);

        const deliveredOrders = orders.filter(
            o => o.TrangThai === "delivered" || o.TrangThai === "Hoàn tất"
        );

        const totalRevenue = deliveredOrders.reduce((sum, o) => {
            return sum + (o.TongTien || 0);
        }, 0);

        res.render("admin/dashboard", {
            title: "Bảng điều khiển Admin",
            userCount: users.length,
            productCount: products.length,
            orderCount: orders.length,
            totalRevenue,

            recentOrders: orders.slice(0, 5),
            layout: "admin/layout"
        });

    } catch (err) {
        console.error("Lỗi Dashboard:", err);
        res.status(500).send("Lỗi hệ thống khi tải Dashboard");
    }
};

exports.getDoanhThu = async (req, res) => {
    try {
        const orders = await Donhang.find().populate("NguoiDung").sort({ createdAt: -1 });

        const delivered = orders.filter(
            o => o.TrangThai === "delivered" || o.TrangThai === "Hoàn tất"
        );

        const totalRevenue = delivered.reduce((sum, o) => {
            return sum + (o.TongTien || 0);
        }, 0);

        res.render("admin/doanhthu", {
            title: "Thống kê doanh thu",
            orders: delivered,
            totalRevenue,
            layout: "admin/layout"
        });

    } catch (err) {
        console.error("Lỗi doanh thu:", err);
        res.status(500).send("Lỗi hệ thống khi tải doanh thu");
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.render("admin/users", {
            title: "Quản lý người dùng",
            users,
            layout: "admin/layout"
        });

    } catch (err) {
        res.status(500).send("Lỗi danh sách người dùng");
    }
};
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin/users");
    } catch (err) {
        res.status(500).send("Lỗi khi xóa người dùng");
    }
};

exports.getAdminProducts = async (req, res) => {
    try {
        const [products, categories] = await Promise.all([
            Sanpham.find().populate("DanhMuc").sort({ createdAt: -1 }),
            Danhmuc.find()
        ]);

        res.render("admin/sanpham", {
            title: "Quản lý kho bánh",
            products,
            categories,
            layout: "admin/layout"
        });

    } catch (err) {
        res.status(500).send("Lỗi danh sách sản phẩm");
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Donhang.find().populate("NguoiDung").sort({ createdAt: -1 });

        res.render("admin/donhang", {
            title: "Quản lý đơn hàng",
            orders,
            layout: "admin/layout"
        });

    } catch (err) {
        res.status(500).send("Lỗi danh sách đơn hàng");
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        await Donhang.findByIdAndUpdate(id, {
            TrangThai: status
        });

        res.redirect("/admin/orders");

    } catch (err) {
        res.status(500).send("Lỗi cập nhật trạng thái đơn hàng");
    }
};