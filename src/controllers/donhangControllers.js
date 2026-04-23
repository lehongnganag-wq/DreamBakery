const Donhang = require("../models/donhang");
const Sanpham = require("../models/sanpham");
const Giohang = require("../models/giohang");


exports.checkout = async (req, res) => {
    try {
        const { customerName, address, phone, note, discountValue } = req.body;
        const userId = req.user.id;

 
        const cartItems = await Giohang.find({ NguoiDung: userId }).populate("SanPham");

        if (!cartItems || cartItems.length === 0) {
            return res.send("<script>alert('Giỏ hàng rỗng!'); window.location.href='/giohang';</script>");
        }

        let subtotal = 0;
        const danhSachSanPham = cartItems.map(item => {
            const thanhTien = (item.SanPham.Gia || 0) * item.SoLuong;
            subtotal += thanhTien;
            return {
                SanPham: item.SanPham._id,
                SoLuong: item.SoLuong,
                Gia: item.SanPham.Gia 
            };
        });

        const discount = parseFloat(discountValue) || 0;
        const total = subtotal - discount;

        const newOrder = new Donhang({
            NguoiDung: userId,
            DanhSachSanPham: danhSachSanPham,
            TongTien: total,
            
            TrangThai: "pending" 
        });

        await newOrder.save();

      
        for (const item of cartItems) {
            await Sanpham.findByIdAndUpdate(item.SanPham._id, {
                $inc: { SoLuong: -item.SoLuong }
            });
        }

        await Giohang.deleteMany({ NguoiDung: userId });

        res.send(`
            <script>
                alert('Đặt hàng thành công!');
                window.location.href = '/donhang';
            </script>
        `);

    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.status(500).send("Có lỗi xảy ra: " + error.message);
    }
};


exports.getHistory = async (req, res) => {
    try {
   
        const orders = await Donhang.find({ NguoiDung: req.user.id }).sort({ createdAt: -1 });
        res.render("customer/donhang", {
            title: "Lịch sử đặt hàng",
            orders: orders
        });
    } catch (error) {
        res.status(500).send("Lỗi tải lịch sử");
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Donhang.findOne({
            _id: req.params.id,
            NguoiDung: req.user.id
        }).populate({
            path: "DanhSachSanPham.SanPham", 
            model: "sanpham" 
        });

        if (!order) return res.status(404).send("Không tìm thấy đơn hàng.");

        res.render("customer/chitiet_donhang", {
            title: "Chi tiết đơn hàng",
            order: order
        });
    } catch (error) {
        console.error("Lỗi xem chi tiết:", error);
        res.status(500).send("Lỗi hệ thống: " + error.message);
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const order = await Donhang.findOne({ 
            _id: req.params.id, 
            NguoiDung: req.user.id, 
            TrangThai: "pending" 
        });

        if (!order) return res.send("<script>alert('Không thể hủy đơn hàng này!'); window.location.href='/donhang';</script>");

       
        for (const item of order.DanhSachSanPham) {
            await Sanpham.findByIdAndUpdate(item.SanPham, { 
                $inc: { SoLuong: item.SoLuong } 
            });
        }

        order.TrangThai = "cancelled";
        await order.save();
        res.send("<script>alert('Đã hủy đơn hàng thành công!'); window.location.href='/donhang';</script>");
    } catch (error) {
        res.status(500).send("Lỗi khi hủy đơn");
    }
};