const express = require("express");
const { pay, deleteBill, getBill } = require("../../../controllers/payController");
const router = express.Router();


router.route('/pay').post(pay).get(getBill).delete(deleteBill);



module.exports = router;