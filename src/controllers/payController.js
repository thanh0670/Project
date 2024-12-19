const asyncHandler = require('express-async-handler');
const BillModel = require('../models/BillModel');
const { DateTime } = require('luxon')
const UserSql = require('../models/userMysqlModel')


const pay = asyncHandler(async (req, res) => {
    const { email, address, productName, total } = req.body;
    const time = String(
        DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss")
    );
    const user = await UserSql.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        BillModel.create({
            email: user.email,
            username: user.username,
            address: address,
            productName: productName,
            total: total,
            time: time
        })
        res.status(201).json({
            email: user.email,
            username: user.username,
            address: address,
            productName: productName,
            total: total,
            time: time
        });
    }
    else {
        res.status(401);
        throw new Error("email is not valid")
    }
})


module.exports = { pay }