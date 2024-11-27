const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");
const { isHaveTokenInBlackList } = require('../databases/redis/redis');

const validateAcessToken = asyncHandler(async (req, res, next) => {
    let token = "";
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401);
            throw new Error('User is not Authorized or token is missing ')
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            return decoded;
        });
        // Check in blacklist
        const isinBlackList = await isHaveTokenInBlackList(decodedData.user.email, token);

        if (isinBlackList) {
            res.status(401);
            throw new Error("Token is in black list");
        } else {
            req.user = decodedData.user;

            next();
        };
    } else {
        res.status(400);
        throw new Error("access token not found")
    }
})

module.exports = { validateAcessToken }