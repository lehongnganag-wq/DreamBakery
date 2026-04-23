const router = require("express").Router();

const adminController = require("../controllers/adminControllers");

const adminSanphamController = require("../controllers/adminSanphamControllers"); 
const danhmucController = require("../controllers/danhmucControllers");
const khuyenmaiController = require("../controllers/khuyenmaiControllers");


const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


router.use(auth, isAdmin);

router.get("/", (req, res) => {
    res.redirect("/admin/dashboard");
});

router.get("/dashboard", adminController.getDashboard);

router.get("/doanhthu", adminController.getDoanhThu);

router.get("/users", adminController.getUsers);
router.post("/users/delete/:id", adminController.deleteUser);

router.get("/orders", adminController.getOrders);
router.post("/orders/update-status", adminController.updateStatus);

router.get("/sanpham", adminSanphamController.adminGetProducts);
router.post("/sanpham/create", adminSanphamController.create);
router.post("/sanpham/update/:id", adminSanphamController.update);
router.get("/sanpham/delete/:id", adminSanphamController.remove);


router.get("/danhmuc", danhmucController.getAll);
router.post("/danhmuc/create", danhmucController.create);
router.get("/danhmuc/delete/:id", danhmucController.remove);


router.get("/khuyenmai", khuyenmaiController.getAll);
router.post("/khuyenmai/create", khuyenmaiController.create);

module.exports = router;