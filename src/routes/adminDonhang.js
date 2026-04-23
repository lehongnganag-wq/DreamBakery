const router = require("express").Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const adminDonhangController = require("../controllers/adminDonhangControllers");

const { 
    getAllOrders, 
    getOrderDetail, 
    updateStatus, 
    deleteOrder 
} = adminDonhangController;

router.use(auth);
router.use(isAdmin);

router.get("/", getAllOrders);
router.get("/detail/:id", getOrderDetail); 
router.post("/update", updateStatus);
router.get("/delete/:id", deleteOrder);

module.exports = router;