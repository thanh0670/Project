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
        const newBill = await BillModel.create({
            email: user.email,
            username: user.username,
            address: address,
            productName: productName,
            total: total,
            time: time
        })
        res.status(201).json({
            id: newBill.id,
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
const getBill = asyncHandler(async (req, res) => {
    try {
        // Lấy tất cả các hóa đơn từ cơ sở dữ liệu
        const bills = await BillModel.find();

        // Trả về danh sách hóa đơn
        res.status(200).json({
            success: true,
            data: bills,
        });
    } catch (error) {
        console.error("Error fetching bills:", error);

        // Xử lý lỗi
        res.status(600).json({
            success: false,
            message: "Failed to fetch bills.",
            error: error.message,
        });
    }
});

const deleteBill = asyncHandler(async (req, res) => {
    const { id } = req.query;  // Lấy id từ query string

    console.log(id);  // Kiểm tra xem có lấy được id từ query string không

    // Xóa hóa đơn dựa trên id
    const deletedBill = await BillModel.findByIdAndDelete(id);

    if (deletedBill) {
        // Nếu xóa thành công, trả về thông báo thành công
        res.status(200).json({
            message: `Bill with id ${id} has been successfully deleted.`,
        });
    } else {
        // Nếu không tìm thấy hóa đơn, trả về lỗi
        res.status(404).json({
            message: `Bill with id ${id} not found.`,
        });
    }
});

module.exports = { pay, deleteBill, getBill }