const mongoose = require("mongoose");

const giohangSchema = new mongoose.Schema({
  NguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  SanPham: { type: mongoose.Schema.Types.ObjectId, ref: "sanpham" },
  SoLuong: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("giohang", giohangSchema);