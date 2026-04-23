const Giohang = require("../models/giohang");
const KhuyenMai = require("../models/khuyenmai");

exports.getGiohang = async (req, res) => {
    try {
        const items = await Giohang.find({ NguoiDung: req.user.id }).populate("SanPham");
        const coupons = await KhuyenMai.find({ TrangThai: true }); // Khớp TrangThai

        let totalAmount = 0;

        const cart = {
            items: items.map(i => {
                const price = i.SanPham ? i.SanPham.Gia : 0;
                const quantity = i.SoLuong || 0;
                totalAmount += price * quantity;

                return {
                    product: {
                        _id: i.SanPham ? i.SanPham._id : null,
                        name: i.SanPham ? i.SanPham.TenSanpham : "Sản phẩm đã ngừng bán",
                        price: price,
                        HinhAnh: i.SanPham ? i.SanPham.HinhAnh : ""
                    },
                    quantity: quantity
                };
            }),
            totalAmount: totalAmount 
        };

        // Lấy lỗi từ session nếu có
        const error = req.session.voucherError || null;
        delete req.session.voucherError;

        res.render("customer/giohang", {
            title: "Giỏ hàng của bạn",
            cart,
            coupons,
            error, // Truyền biến error ra view
            layout: "layout"
        });
    } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
        res.render("customer/giohang", {
            title: "Giỏ hàng",
            cart: { items: [], totalAmount: 0 },
            coupons: [],
            layout: "layout"
        });
    }
};

// --- PHẦN BỔ SUNG: HÀM ÁP DỤNG MÃ GIẢM GIÁ ---
exports.applyVoucher = async (req, res) => {
    try {
        const { voucherCode } = req.body;
        const code = voucherCode ? voucherCode.trim().toUpperCase() : "";

        // Tìm mã khớp với Database
        const voucher = await KhuyenMai.findOne({ 
            MaCode: code,             // Trường MaCode
            TrangThai: true,          // Trường TrangThai
            NgayBatDau: { $lte: new Date() },
            NgayKetThuc: { $gte: new Date() }
        });

        if (!voucher) {
            req.session.voucherError = "Mã này không đúng hoặc đã hết hạn!";
            return res.redirect("/giohang");
        }

        // Kiểm tra đơn tối thiểu (ví dụ trường GiaTriToiThieu trong DB)
        const items = await Giohang.find({ NguoiDung: req.user.id }).populate("SanPham");
        const currentTotal = items.reduce((sum, i) => sum + (i.SanPham ? i.SanPham.Gia * i.SoLuong : 0), 0);

        if (currentTotal < voucher.GiaTriToiThieu) {
            req.session.voucherError = `Đơn hàng tối thiểu phải từ ${voucher.GiaTriToiThieu.toLocaleString()}đ`;
            return res.redirect("/giohang");
        }

        // Lưu thông tin giảm giá vào session để xử lý tiếp ở trang thanh toán
        req.session.discountAmount = voucher.PhanTramGiam > 0 
            ? (currentTotal * voucher.PhanTramGiam / 100) 
            : voucher.SoTienGiam;
        
        res.redirect("/giohang");
    } catch (error) {
        console.error("Lỗi voucher:", error);
        res.redirect("/giohang");
    }
};

exports.add = async (req, res) => {
    try {
        const productId = req.params.id; 
        const { quantity } = req.body; 
        const qty = parseInt(quantity) || 1;

        let item = await Giohang.findOne({
            NguoiDung: req.user.id,
            SanPham: productId
        });

        if (item) {
            item.SoLuong += qty;
            await item.save();
        } else {
            await Giohang.create({
                NguoiDung: req.user.id,
                SanPham: productId,
                SoLuong: qty
            });
        }
        
        res.redirect("/giohang");
    } catch (error) {
        console.error(" Lỗi thêm giỏ hàng:", error);
        res.status(500).send("Lỗi thêm giỏ hàng");
    }
};


exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const item = await Giohang.findOne({
            NguoiDung: req.user.id,
            SanPham: productId
        });

        if (item) {
            item.SoLuong = parseInt(quantity);
            if (item.SoLuong <= 0) {
                await Giohang.deleteOne({ _id: item._id });
            } else {
                await item.save();
            }
        }
        res.redirect("/giohang");
    } catch (error) {
        console.error(" Lỗi cập nhật giỏ hàng:", error);
        res.status(500).send("Lỗi cập nhật giỏ hàng");
    }
};

exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.params;
        
        await Giohang.deleteOne({
            NguoiDung: req.user.id,
            SanPham: productId
        });
        res.redirect("/giohang");
    } catch (error) {
        console.error("🔥 Lỗi xoá món hàng:", error);
        res.status(500).send("Lỗi xoá món hàng");
    }
};