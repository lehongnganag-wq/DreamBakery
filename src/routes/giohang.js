const router = require("express").Router();
const {
  getAllSanpham,
  getSanphamDetail,
  getSanphamByDanhmuc
} = require("../controllers/sanphamControllers");

router.get("/", getAllSanpham);

router.get("/detail/:id", getSanphamDetail);

router.get("/danhmuc/:danhmucId", getSanphamByDanhmuc);

module.exports = router;