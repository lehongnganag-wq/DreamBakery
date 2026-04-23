const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  HoVaTen: { type: String, required: true },
  Email: { type: String, unique: true },
  HinhAnh: { type: String, default: "/images/avatar.png" },
  TenDangNhap: { type: String, required: true, unique: true },
  MatKhau: { type: String, required: true },
  QuyenHan: { type: String, enum: ["user", "admin"], default: "user" },
  KichHoat: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);