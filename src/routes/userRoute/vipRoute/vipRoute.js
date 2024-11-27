const express = require("express");
const { auth } = require("../../../middlewares/auth");
const { validateAcessToken } = require("../../../middlewares/validateAccessToken");
const { vip } = require("../../../controllers/vipController");


const router = express.Router();


router.route('/vip').get(validateAcessToken, auth('vip0', 'vip1', 'vip2', 'vip3', 'vip4', 'admin'), vip);




module.exports = router;