const express = require("express");
const { auth } = require("../../../middlewares/auth");
const { validateAcessToken } = require("../../../middlewares/validateAccessToken");
const { admin } = require("../../../controllers/vip_adminController");


const router = express.Router();


router.route('/admin').post(validateAcessToken, auth('admin'), admin);

module.exports = router;