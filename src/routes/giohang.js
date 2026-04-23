const router = require("express").Router();
const {
  getGiohang,
  add,
  updateQuantity,
  removeItem
} = require("../controllers/giohangControllers");

const auth = require("../middleware/auth");

router.use(auth);

router.get("/", getGiohang);

router.post("/add/:id", add); 

router.post("/update", updateQuantity);

router.get("/remove/:productId", removeItem);

module.exports = router;