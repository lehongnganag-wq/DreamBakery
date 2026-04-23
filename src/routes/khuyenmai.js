const router = require("express").Router();
const khuyenmaiController = require("../controllers/khuyenmaiControllers");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", auth, isAdmin, khuyenmaiController.getAll);

router.get("/create", auth, isAdmin, khuyenmaiController.renderCreatePage);

router.post("/create", auth, isAdmin, khuyenmaiController.create);

router.get("/edit/:id", auth, isAdmin, khuyenmaiController.renderEditPage);

router.post("/edit/:id", auth, isAdmin, khuyenmaiController.update);

router.get("/toggle/:id", auth, isAdmin, khuyenmaiController.toggleStatus);

router.get("/delete/:id", auth, isAdmin, khuyenmaiController.remove);

router.post("/apply", auth, khuyenmaiController.apply);

module.exports = router;