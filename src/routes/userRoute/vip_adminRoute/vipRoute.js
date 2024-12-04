const express = require("express");
const { auth } = require("../../../middlewares/auth");
const { validateAcessToken } = require("../../../middlewares/validateAccessToken");
const { vip } = require("../../../controllers/vip_adminController");
const { validateBlacklistUser } = require("../../../middlewares/validateBlacklistUser");



const router = express.Router();


router.route('/vip').post(validateAcessToken, validateBlacklistUser, auth('vip0', 'vip1', 'vip2', 'vip3', 'vip4'), vip);




module.exports = router;