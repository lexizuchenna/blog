const express = require("express");
const router = express.Router();

const {viewHome, viewAbout, viewContact} = require("../controllers/index");


router.get("/", viewHome);
router.get("/about", viewAbout);
router.get("/contact", viewContact);

module.exports = router;