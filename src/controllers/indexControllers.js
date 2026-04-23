const Sanpham = require("../models/sanpham");

exports.renderIndex = async (req, res) => {
    try {

        const items = await Sanpham.find()
            .sort({ createdAt: -1 })
            .limit(8);

        console.log("=== DEBUG TRANG CHỦ ===");
        console.log("Số lượng bánh tìm thấy:", items.length);
        
        res.render("index", {
            title: "Dream Bakery - Bánh ngọt từ trái tim",
            products: items || [] 
        });

    } catch (error) {
        console.error("Lỗi Controller renderIndex:", error);
        res.render("index", { 
            title: "Dream Bakery", 
            products: [] 
        });
    }
};