const mongoose = require("mongoose");

const khuyenmaiSchema = new mongoose.Schema({
  TenKhuyenMai: { type: String, required: true },
  MaCode: { type: String, unique: true },
  PhanTramGiam: { type: Number, default: 0 },   // giảm %
  SoTienGiam: { type: Number, default: 0 },     // giảm tiền cố định
  GiaTriToiThieu: { type: Number, default: 0 }, // đơn tối thiểu
  SoLuong: { type: Number, default: 0 },        // số lượt dùng
  DaSuDung: { type: Number, default: 0 },       // đã dùng
  NgayBatDau: { type: Date },
  NgayKetThuc: { type: Date },
  TrangThai: { type: Boolean, default: true }   // còn hoạt động
}, { timestamps: true });

module.exports = mongoose.model("khuyenmai", khuyenmaiSchema);