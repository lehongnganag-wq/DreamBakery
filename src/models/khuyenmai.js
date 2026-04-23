const mongoose = require("mongoose");

const khuyenmaiSchema = new mongoose.Schema({
  TenKhuyenMai: { type: String, required: true },
  MaCode: { type: String, unique: true },
  PhanTramGiam: { type: Number, default: 0 },   
  SoTienGiam: { type: Number, default: 0 },     
  GiaTriToiThieu: { type: Number, default: 0 }, 
  SoLuong: { type: Number, default: 0 },       
  DaSuDung: { type: Number, default: 0 },      
  NgayBatDau: { type: Date },
  NgayKetThuc: { type: Date },
  TrangThai: { type: Boolean, default: true }   
}, { timestamps: true });

module.exports = mongoose.model("khuyenmai", khuyenmaiSchema);