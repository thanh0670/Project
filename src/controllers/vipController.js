const userModel = require('../models/usermodel');
const vip = async (req, res) => {
    const role = req.user.role;
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    console.log(role);

    if (user) {
        if (user.account >= 200) {
            await userModel.updateOne(
                { _id: userID },
                { $set: { role: "vip1" } }
            );
        }
        else if (user.account >= 400) {
            await userModel.updateOne(
                { _id: userID },
                { $set: { role: "vip2" } }
            );
        }
        else if (user.account >= 600) {
            await userModel.updateOne(
                { _id: userID },
                { $set: { role: "vip3" } }
            );
        }
        else if (user.account >= 600) {
            await userModel.updateOne(
                { _id: userID },
                { $set: { role: "vip4" } }
            );
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
                    message: "Không có nội dung phù hợp với quyền của bạn.",
                    voucher: "25%"
                });
    }
}

module.exports = { vip }