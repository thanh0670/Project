const { default: mongoose } = require("mongoose");


const schema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add the user name"]
    },
    email: {
        type: String,
        unique: [true, "email alreaty taken"],
        required: [true, "please add the email address"]
    },
    password: {
        type: String,
        required: [true, "please add the user password"]
    },
    account: {
        type: Number, // Sửa thành Number thay vì String
        default: 0,
    },
    role: {
        type: String,
        default: "vip0",
        required: [true, "please add user role"]
    }
})

module.exports = mongoose.model("users", schema);




