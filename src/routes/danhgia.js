const router = require("express").Router();
const {
  add,
  getByProduct
} = require("../controllers/danhgiaControllers");

const auth = require("../middleware/auth");

router.post("/", auth, add);

router.get("/sanpham/:productId", getByProduct);

module.exports = router;