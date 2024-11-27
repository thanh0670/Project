const express = require('express');
const { refresh } = require('../../../controllers/userController');
const { validateRefreshToken } = require('../../../middlewares/validateRefreshToken');

const router = express.Router();

router.route('/refresh').get(validateRefreshToken, refresh);


module.exports = router;