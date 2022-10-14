const express = require("express");
const router = express.Router();

const {viewHome} = require("../controllers/index");


router.get("/", viewHome);

module.exports = router;