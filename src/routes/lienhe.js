const express = require("express");
const router = express.Router();
const controller = require("../controllers/lienheControllers");

router.get("/", controller.getForm);
router.post("/", controller.submit);

module.exports = router;