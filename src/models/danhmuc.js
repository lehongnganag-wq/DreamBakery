const mongoose = require("mongoose");

const danhmucSchema = new mongoose.Schema({
  TenDanhMuc: { type: String, required: true },
  MoTa: { type: String },
  TrangThai: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("danhmuc", danhmucSchema);