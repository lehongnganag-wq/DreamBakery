const Giohang = require("../models/giohang");
const KhuyenMai = require("../models/khuyenmai");

exports.getGiohang = async (req, res) => {
    try {
        const items = await Giohang.find({ NguoiDung: req.user.id }).populate("SanPham");
        const coupons = await KhuyenMai.find({ TrangThai: true });

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

        res.render("customer/giohang", {
            title: "Giỏ hàng của bạn",
            cart,
            coupons,
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