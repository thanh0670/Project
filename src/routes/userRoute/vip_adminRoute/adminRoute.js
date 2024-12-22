const express = require("express");
const { auth } = require("../../../middlewares/auth");
const { validateAcessToken } = require("../../../middlewares/validateAccessToken");
const { adminBlock, adminUser, adminUnblock } = require("../../../controllers/vip_adminController");



const router = express.Router();


router.route('/admin').post(validateAcessToken, auth('admin'), adminBlock).get(validateAcessToken, auth('admin'), adminUser).put(validateAcessToken, auth('admin'), adminUnblock);

module.exports = router;