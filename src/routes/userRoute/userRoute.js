const express = require("express");
const router = express.Router();

const loginRoute = require('./loginRoute/loginRoute')
const currentRoute = require('./currentRoute/currentRoute')
const logoutRoute = require('./logoutRoute/logoutRoute')
const registerRoute = require('./registerRoute/registerRoute');
const refreshRoute = require('./refreshCurrentRoute/refreshCurrentRoutea')
const vipRoute = require('./vip_adminRoute/vipRoute')
const adminRoute = require('./vip_adminRoute/adminRoute')

router.use('/users', loginRoute);
router.use('/users', currentRoute);
router.use('/users', logoutRoute);
router.use('/users', registerRoute);
router.use('/users', refreshRoute);
router.use('/users', vipRoute);
router.use('/users', adminRoute);




module.exports = router;