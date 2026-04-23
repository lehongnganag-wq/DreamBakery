const router = require("express").Router();
const sanphamController = require("../controllers/sanphamControllers");

router.get("/", sanphamController.getSanpham);

router.get("/detail/:id", sanphamController.getById);

module.exports = router;