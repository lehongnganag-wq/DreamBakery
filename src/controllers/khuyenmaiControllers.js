const Khuyenmai = require("../models/khuyenmai");

exports.getAll = async (req, res) => {
    try {
        const data = await Khuyenmai.find().sort({ createdAt: -1 });
        res.render("admin/khuyenmai", {
            title: "Quản lý mã giảm giá",
            promos: data,
            layout: "admin/layout" 
        });
    } catch (error) {
        console.error("Lỗi getAll:", error);
        res.status(500).send("Lỗi tải danh sách khuyến mãi.");
    }
};

exports.renderCreatePage = async (req, res) => {
    res.render("admin/add-khuyenmai", {
        title: "Tạo mã giảm giá",
        layout: "admin/layout"
    });
};

exports.create = async (req, res) => {
    try {
        const { TenKhuyenMai, MaCode, PhanTramGiam, SoTienGiam, GiaTriToiThieu, SoLuong, NgayBatDau, NgayKetThuc } = req.body;

        const existing = await Khuyenmai.findOne({ MaCode: MaCode.toUpperCase() });
        if (existing) {
            return res.status(400).send("Mã khuyến mãi này đã tồn tại!");
        }

        await Khuyenmai.create({
            TenKhuyenMai,
            MaCode: MaCode.toUpperCase(),
            PhanTramGiam: Number(PhanTramGiam) || 0,
            SoTienGiam: Number(SoTienGiam) || 0,
            GiaTriToiThieu: Number(GiaTriToiThieu) || 0,
            SoLuong: Number(SoLuong) || 0,
            NgayBatDau,
            NgayKetThuc,
            TrangThai: true
        });

        res.redirect("/admin/khuyenmai");
    } catch (error) {
        console.error("Lỗi tạo khuyến mãi:", error);
        res.status(500).send("Không thể tạo mã khuyến mãi.");
    }
};

exports.renderEditPage = async (req, res) => {
    try {
        const promo = await Khuyenmai.findById(req.params.id);
        if (!promo) {
            return res.status(404).send("Không tìm thấy mã khuyến mãi.");
        }
        res.render("admin/edit-khuyenmai", {
            title: "Chỉnh sửa mã giảm giá",
            promo: promo,
            layout: "admin/layout"
        });
    } catch (error) {
        res.status(500).send("Lỗi hệ thống.");
    }
};

exports.update = async (req, res) => {
    try {
        const { TenKhuyenMai, MaCode, PhanTramGiam, SoTienGiam, GiaTriToiThieu, SoLuong, NgayBatDau, NgayKetThuc, TrangThai } = req.body;

        await Khuyenmai.findByIdAndUpdate(req.params.id, {
            TenKhuyenMai,
            MaCode: MaCode.toUpperCase(),
            PhanTramGiam: Number(PhanTramGiam) || 0,
            SoTienGiam: Number(SoTienGiam) || 0,
            GiaTriToiThieu: Number(GiaTriToiThieu) || 0,
            SoLuong: Number(SoLuong) || 0,
            NgayBatDau,
            NgayKetThuc,
            TrangThai: TrangThai === "true" 
        });

        res.redirect("/admin/khuyenmai");
    } catch (error) {
        console.error("Lỗi cập nhật khuyến mãi:", error);
        res.status(500).send("Không thể cập nhật mã khuyến mãi.");
    }
};


exports.apply = async (req, res) => {
    try {
        const { MaCode, TongTienDonHang } = req.body; 
        const now = new Date();

        const promo = await Khuyenmai.findOne({
            MaCode: MaCode.toUpperCase(),
            TrangThai: true
        });

        if (!promo) {
            return res.status(404).json({ success: false, msg: "Mã giảm giá không tồn tại hoặc đã bị khóa." });
        }

        if (promo.NgayBatDau && new Date(promo.NgayBatDau) > now) {
            return res.status(400).json({ success: false, msg: "Mã chưa đến thời gian sử dụng." });
        }
        if (promo.NgayKetThuc && new Date(promo.NgayKetThuc) < now) {
            return res.status(400).json({ success: false, msg: "Mã đã hết hạn." });
        }

        if (promo.SoLuong > 0 && promo.DaSuDung >= promo.SoLuong) {
            return res.status(400).json({ success: false, msg: "Mã đã hết lượt dùng." });
        }

        if (TongTienDonHang < promo.GiaTriToiThieu) {
            return res.status(400).json({ 
                success: false, 
                msg: `Đơn hàng tối thiểu phải từ ${promo.GiaTriToiThieu.toLocaleString()}đ để sử dụng mã này.` 
            });
        }

        let discountValue = promo.PhanTramGiam > 0 ? promo.PhanTramGiam : promo.SoTienGiam;
        let discountType = promo.PhanTramGiam > 0 ? "percent" : "fixed";

        return res.json({
            success: true,
            discount: discountValue,
            type: discountType,
            msg: `Áp dụng thành công mã: ${promo.TenKhuyenMai}`
        });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Lỗi hệ thống." });
    }
};


exports.remove = async (req, res) => {
    try {
        await Khuyenmai.findByIdAndDelete(req.params.id);
        res.redirect("/admin/khuyenmai");
    } catch (error) {
        res.status(500).send("Lỗi khi xóa mã.");
    }
};


exports.toggleStatus = async (req, res) => {
    try {
        const promo = await Khuyenmai.findById(req.params.id);
        promo.TrangThai = !promo.TrangThai;
        await promo.save();
        res.redirect("/admin/khuyenmai");
    } catch (error) {
        res.status(500).send("Lỗi đổi trạng thái.");
    }
};