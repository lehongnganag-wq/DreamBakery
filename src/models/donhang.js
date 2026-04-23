const mongoose = require("mongoose");

const donhangSchema = new mongoose.Schema({
  NguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  DanhSachSanPham: [
    {
      SanPham: { type: mongoose.Schema.Types.ObjectId, ref: "sanpham" },
      SoLuong: Number,
      Gia: Number
    }
  ],

  TongTien: { type: Number, default: 0 },

  PhuongThucThanhToan: { 
    type: String, 
    enum: ["COD", "Chuyển khoản"], 
    default: "COD" 
  },

  DaThanhToan: { type: Boolean, default: false },

  TrangThai: { 
    type: String, 
    enum: ["pending", "shipping", "delivered", "cancelled"], 
    default: "pending" 
  }

}, { timestamps: true });

module.exports = mongoose.model("donhang", donhangSchema);