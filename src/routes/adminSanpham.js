const router = require("express").Router();
const adminController = require("../controllers/adminSanphamControllers"); 

const upload = require("../middleware/upload"); 

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", auth, isAdmin, adminController.adminGetProducts);

router.get("/create", auth, isAdmin, adminController.renderCreatePage);

router.post("/create", auth, isAdmin, upload.single('HinhAnh'), adminController.create);

router.get("/edit/:id", auth, isAdmin, adminController.renderEditPage);

router.post("/update/:id", auth, isAdmin, upload.single('HinhAnh'), adminController.update);


router.get("/delete/:id", auth, isAdmin, adminController.remove);

module.exports = router;