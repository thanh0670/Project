const { default: mongoose } = require("mongoose");


const schema = mongoose.Schema({
    email: {
        type: String,
        unique: [true, "email alreaty taken"],
        required: [true, "please add the email address"]
    }
})

const BlacklistUser = mongoose.model("users", schema);

module.exports = BlacklistUser;




