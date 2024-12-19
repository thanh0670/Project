const express = require("express");
const { pay } = require("../../../controllers/payController");
const router = express.Router();

router.route('/pay').post(pay);



module.exports = router;