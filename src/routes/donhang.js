const router = require("express").Router();
const {
    getHistory,
    getOrderDetail,
    cancelOrder,
    checkout 
} = require("../controllers/donhangControllers");

const auth = require("../middleware/auth");

router.use(auth);

router.get("/", getHistory);

router.post("/checkout", checkout);

router.get("/cancel/:id", cancelOrder);

router.get("/:id", getOrderDetail);

module.exports = router;