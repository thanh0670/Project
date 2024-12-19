const { default: mongoose } = require("mongoose");


const schema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please add the user name"]
    },
    email: {
        type: String,
        required: [true, "please add the email address"]
    },
    address: {
        type: String,
        required: [true, "please add the user address"]
    },
    productName: {
        type: String,
        required: [true, "please add the user productName"]
    },
    total: {
        type: String,
        default: 0
    },
    time: {
        type: String,
        default: 0
    },
})

module.exports = mongoose.model("Bill", schema);
