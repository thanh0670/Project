const { default: mongoose } = require("mongoose");


const schema = mongoose.Schema({
    email: {
        type: String,
        unique: [true, "email alreaty taken"],
        required: [true, "please add the email address"]
    },
    validateBlock: {
        type: String,
        default: "yes"
    }
})

module.exports = mongoose.model("blockUsers", schema);





