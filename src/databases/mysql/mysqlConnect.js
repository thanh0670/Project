// const mysql = require('mysql');
const { Sequelize, Datatypes } = require('sequelize');
const { mysqlConfig } = require('../../configs/mysqlConfig');
const BlacklistUser = require('../../models/blacklistUser');


const sequelize = new Sequelize(
    mysqlConfig.DB,
    mysqlConfig.USER,
    mysqlConfig.PASSWORD,
    {
        host: mysqlConfig.HOST,
        dialect: mysqlConfig.DIALECT,
        logging: false,
        pool: {
            max: mysqlConfig.POOL.max,
            min: mysqlConfig.POOL.min,
            accquire: mysqlConfig.POOL.accquire,
            idle: mysqlConfig.POOL.idle
        }

    }
)

// ket noi gian tiep thong qua sequelize

const sequelizeConnect = async () => {
    try {
        await sequelize.authenticate(); // Kiểm tra kết nối
        console.log("MySQL connected!");
    } catch (err) {
        console.log("Error connecting to MySQL:", err);
    }
}

const sequelizeSync = async () => {
    try {
        await sequelize.sync({ force: false }); // Đồng bộ tất cả model, không xóa dữ liệu cũ
        console.log("Database & tables synced!");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
}

// const isHaveUserInBlacklist = async (email) => {
//     const user = await BlacklistUser.findOne({ where: { email } });
//     return !!user; // Trả về true nếu tìm thấy
// };
// const pushUserToBlackList = async (email) => {
//     await BlacklistUser.create({ email });
//     console.log('User added to blacklist successfully.');
// };



module.exports = { sequelizeConnect, sequelize, sequelizeSync };

