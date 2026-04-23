const mongoose = require("mongoose");

const lienheSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "replied"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("lienhe", lienheSchema);