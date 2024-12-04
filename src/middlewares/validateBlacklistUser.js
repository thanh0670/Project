const asyncHandler = require("express-async-handler");
const { isHaveUserInBlacklist } = require("../databases/mongodb/mongodbConnect");
const validateBlacklistUser = asyncHandler(async (req, res, next) => {
    const email = req.body.email || req.query.email; // Lấy email từ body hoặc query parameter
    if (!email) {
        return res.status(400).json({ message: "Don't have email" });
    }
    const isInBlacklist = await isHaveUserInBlacklist(email);
    if (isInBlacklist) {
        res.status(401).json({ message: "Email is in blacklist" });
    } else {
        next(); // Nếu không có trong blacklist, tiếp tục xử lý request
    }
})
module.exports = { validateBlacklistUser }