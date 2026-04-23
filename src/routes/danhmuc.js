const express = require("express");
const router = express.Router();
const danhmucController = require("../controllers/danhmucControllers");

router.get("/", danhmucController.getAll);

router.post("/create", danhmucController.create);

router.post("/update/:id", danhmucController.update);

router.get("/delete/:id", danhmucController.remove);

module.exports = router;