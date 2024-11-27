const UserModel = require('../models/usermodel')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { pushTokenToBlackList } = require('../databases/redis/redis')
const RefreshModel = require('../models/refreshModel')
const { DateTime } = require('luxon')

//@desc Register User
//@route POST /api/users/register
//@access public
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
        res.status(400);
        throw new Error('dien day du thong tin');
    }
    const userAvaliable = await UserModel.findOne({ email });
    if (userAvaliable) {
        res.status(400);
        throw new Error('tai khoan da ton tai');
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);

    const user = UserModel.create({
        email: email,
        username: username,
        password: hashedPassword,
        role: "vip0"
    });
    if (user) {
        res.status(201).json({
            id: user.id,
            username: user.usermame,
            email: user.email,
            role: user.role,
            message: "tao tai khoan thanh cong"
        })
    }
    else {
        res.status(400);
        throw new Error('tao tai khoan that bai')
    }

})

//@desc Login User
//@route POST /api/users/login
//@access private
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.useragent;



    const time = String(
        DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss")
    );

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                },
            }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m",
            }
        );

        // generate refresh token

        const refreshToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                },
            }, process.env.REFRESH_SECRET_KEY,
            {
                expiresIn: "30d",

            }
        );


        RefreshModel.create({
            email: user.email,
            username: user.username,
            deviceInfo: {
                ipAddress: ipAddress,
                userAgent: userAgent.browser,
            },
            token: refreshToken,
            time: time
        })


        // 30 * 24 * 60 * 60 * 1000 = 30 days
        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });
        res.status(200).json({
            accessToken
        });
    } else {
        res.status(401);
        throw new Error("email or password is not valid")
    }
})




//@desc Logout User
//@route POST /api/users/logout
//@access public
const logout = asyncHandler(async (req, res) => {
    const { email, token } = req.body;
    const cookie = req.cookies.refreshToken;
    await pushTokenToBlackList(email, token, 900);

    await RefreshModel.findOneAndDelete({ token: cookie });

    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({
        message: "logout successfull"
    })

})


//@desc Current User
//@route GET /api/users/Current
//@access private
const Current = (req, res) => {

    res.status(200).json(
        req.user
    )
}



//@desc Refresh User
//@route POST /api/users/Current
//@access private
const refresh = asyncHandler((req, res) => {
    const accessToken = jwt.sign(
        {
            user: {
                username: req.user.username,
                email: req.user.email,
                id: req.user.id,
                role: req.user.role,
            },
        }, process.env.JWT_SECRET_KEY,
        {
            expiresIn: "15m",

        }
    );
    res.status(200).json({
        accessToken
    });
})




module.exports = { login, logout, register, Current, refresh }