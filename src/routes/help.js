const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    
    res.render("customer/help", { title: "Trợ giúp" }); 
});

module.exports = router;