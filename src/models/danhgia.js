const mongoose = require("mongoose");

const danhgiaSchema = new mongoose.Schema({
  NguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  SanPham: { type: mongoose.Schema.Types.ObjectId, ref: "sanpham" },
  SoSao: { type: Number, default: 5 },
  NoiDung: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("danhgia", danhgiaSchema);