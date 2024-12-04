const { DataTypes } = require('sequelize');
const { sequelize } = require('../databases/mysql/mysqlConnect');

const UserSql = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Kiểm tra định dạng email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,// Đặt giá trị mặc định
    },
    account: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    timestamps: false, // Tự động thêm `createdAt` và `updatedAt`
    tableName: 'users', // Tên bảng trong cơ sở dữ liệu
});


module.exports = UserSql;
