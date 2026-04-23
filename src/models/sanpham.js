const mongoose = require("mongoose");

const sanphamSchema = new mongoose.Schema({
  TenSanPham: { type: String, required: true },
  Gia: { type: Number, required: true },
  GiaGiam: { type: Number, default: 0 },
  MoTa: { type: String },
  HinhAnh: { type: String, default: "/images/default.png" },
  DanhSachAnh: [{ type: String }],
  DanhMuc: { type: mongoose.Schema.Types.ObjectId, ref: "danhmuc" },
  SoLuong: { type: Number, default: 0 },
  DaBan: { type: Number, default: 0 },
  DanhGia: { type: Number, default: 0 },
  SoLuotDanhGia: { type: Number, default: 0 },
  TrangThai: { type: Boolean, default: true },
  NoiBat: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("sanpham", sanphamSchema);