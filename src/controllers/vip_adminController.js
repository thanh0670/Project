const asyncHandler = require("express-async-handler");
const { pushUserToBlackList, isHaveUserInBlacklist } = require('../databases/mongodb/mongodbConnect');
const UserSql = require('../models/userMysqlModel')


const vip = asyncHandler(async (req, res) => {
    const role = req.user.role;
    const userID = req.user.id;
    const user = await UserSql.findByPk(userID);


    if (user) {
        if (user.account >= 600) {
            await user.update({ role: "vip4" });
        } else if (user.account >= 400) {
            await user.update({ role: "vip3" });
        } else if (user.account >= 200) {
            await user.update({ role: "vip2" });
        } else {
            await user.update({ role: "vip1" });
        }
    }
    else {
        return res.status(404).json({
            message: "Người dùng không được tìm thấy."
        });
    }

    switch (role) {
        case "vip0":
            return res
                .status(200)
                .json({
                    message:
                        "Chào mừng VIP 0! Đây là nội dung đặc biệt dành cho bạn.",
                    voucher: "0%"
                });
        case "vip1":
            return res
                .status(200)
                .json({
                    message:
                        "Chào mừng VIP 1! Đây là nội dung đặc biệt dành cho bạn.",
                    voucher: "5%"
                });
        case "vip2":
            return res
                .status(200)
                .json({
                    message: "Chào mừng VIP 2! Đây là nội dung dành riêng cho bạn.",
                    voucher: "10%"
                });
        case "vip3":
            return res
                .status(200)
                .json({
                    message:
                        "Chào mừng VIP 3! Bạn có quyền truy cập vào nội dung này.",
                    voucher: "15%"
                });
        case "vip4":
            return res
                .status(200)
                .json({
                    message: "Chào mừng VIP 4! Đây là nội dung cao cấp cho bạn.",
                    voucher: "20%"
                });


        default:
            return res
                .status(403)
                .json({
                    message: "Không có nội dung phù hợp với quyền của bạn."
                });
    }
})
const admin = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send("Không có email");
    }
    const isBlacklisted = await isHaveUserInBlacklist(email);
    console.log(email);

    if (isBlacklisted) {
        return res.status(200).send("Tài khoản đã bị cấm trước đó.");
    }
    await pushUserToBlackList(email);
    res.status(200).send(`Tài khoản ${email} đã bị cấm.`);
});

module.exports = { vip, admin }