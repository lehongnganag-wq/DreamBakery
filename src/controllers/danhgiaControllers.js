const Danhgia = require("../models/danhgia");


exports.add = async (req, res) => {
    try {
        const { SanPham, NoiDung, SoSao } = req.body;

       
        if (!NoiDung || !SoSao) {
            return res.status(400).send("Vui lòng nhập nội dung và số sao đánh giá.");
        }

        if (SoSao < 1 || SoSao > 5) {
            return res.status(400).send("Số sao phải từ 1 đến 5.");
        }

        await Danhgia.create({
            NguoiDung: req.user.id,
            SanPham: SanPham,
            NoiDung: NoiDung,
            SoSao: SoSao
        });

        res.redirect(`/sanpham/${SanPham}`);

    } catch (error) {
        console.error("Lỗi khi thêm đánh giá:", error);
        res.status(500).send("Không thể gửi đánh giá lúc này.");
    }
};


exports.getByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const data = await Danhgia.find({ SanPham: productId })
            .populate("NguoiDung", "name")
            .sort({ createdAt: -1 });

        res.json(data);

    } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        res.status(500).json({ msg: "Lỗi máy chủ" });
    }
};