const express = require("express");
const { Current } = require("../../../controllers/userController");
const { validateAcessToken } = require("../../../middlewares/validateAccessToken");

const router = express.Router();


router.route('/current').get(validateAcessToken, Current);




module.exports = router;