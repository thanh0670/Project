const asyncHandler = require('express-async-handler');

const auth = (...permission) => {




    return asyncHandler(async (req, res, next) => {

        const role = req.user.role;
        console.log("hello", role);

        if (!permission.includes(role)) {
            res.status(403);
            throw new Error("you don't have permission!")
        }
        next();
    })
}









module.exports = { auth }