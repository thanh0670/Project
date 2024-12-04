const mongoose = require("mongoose");
const BlacklistUser = require("../../models/blacklistUser");

const mongodbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_CONNECT_STRING);
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

const isHaveUserInBlacklist = async (email) => {
    try {
        const user = await BlacklistUser.findOne({ email });
        return !!user; // Trả về true nếu tìm thấy
    } catch (error) {
        console.error("Error checking user in blacklist:", error);
        throw error;
    }
};
const pushUserToBlackList = async (email) => {
    try {
        await BlacklistUser.create({ email });
        console.log("User added to blacklist successfully.");
    } catch (error) {
        if (error.code === 11000) {
            console.error("Error: Email already exists in blacklist.");
        } else {
            console.error("Error adding user to blacklist:", error);
        }
        throw error;
    }
};

module.exports = { mongodbConnect, pushUserToBlackList, mongodbConnect, isHaveUserInBlacklist };