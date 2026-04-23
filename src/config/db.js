const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:admin123@ac-iqon8pl-shard-00-01.ehofa5r.mongodb.net:27017/dream_bakery?ssl=true&authSource=admin");
    console.log("Kết nối thành công");
  } catch (err) {
    console.log("Lỗi:", err);
  }
};

module.exports = connectDB;