const router = require("express").Router();
const sanphamController = require("../controllers/sanphamControllers"); // Trỏ đúng file ở trên

router.get("/", sanphamController.getSanpham);

router.get("/detail/:id", sanphamController.getById);

module.exports = router;