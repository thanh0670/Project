const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { pushTokenToBlackList } = require('../databases/redis/redis')
const RefreshModel = require('../models/refreshModel')
const UserSql = require('../models/userMysqlModel')
const { DateTime } = require('luxon')


//@desc Register User
//@route POST /api/users/register
//@access public
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Email được nhận:', email);

    if (!username || !password || !email) {
        res.status(400);
        throw new Error('dien day du thong tin');
    }
    try {
        const userAvaliable = await UserSql.findOne({
            where: { email }
        });
        console.log("Kết quả truy vấn:", userAvaliable);

        if (userAvaliable) {
            res.status(400);
            throw new Error('tai khoan da ton tai');
        }
    } catch (error) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", error);
    }


    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);
    try {
        const user = await UserSql.create({
            email: email,
            username: username,
            password: hashedPassword,
            role: "vip0"
        });
        if (user) {
            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                message: "tao tai khoan thanh cong"
            })
        }
        else {
            res.status(400);
            throw new Error('tao tai khoan that bai')
        }
    } catch (error) {
        console.error("Lỗi khi tạo user:", error);
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
    const user = await UserSql.findOne({
        where: {
            email: email
        }
    });
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
            secure: true, //     true khi có https
            sameSite: "none",// none khi có https 
            path: "/"
        });
        res.status(200).json({
            accessToken,
            refreshToken
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
    try {
        if (!cookie) {
            return res.status(400).json({
                message: "Không có refreshToken trong cookie!",
            });
        }

        await pushTokenToBlackList(email, token, 900);
        await RefreshModel.findOneAndDelete({ token: cookie });


        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true, //     true khi có https
            sameSite: "none",// none khi có https 
            path: "/"
        });

        if (!req.cookies.refreshToken) {
            res.status(200).json({
                message: "logout successfull"
            });
        } else {
            res.status(400)
            throw new Error("refreshToken Van Ton Tai")
        }
    }
    catch {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

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
const refresh = asyncHandler(async (req, res) => {
    try {
        const accessToken = jwt.sign(
            {
                user: {
                    username: req.user.username,
                    email: req.user.email,
                    id: req.user.id,
                    role: req.user.role,
                },
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.status(200).json({
            accessToken
        });
    } catch (err) {
        console.error('Error generating access token:', err);
        res.status(500).json({ message: 'Error generating access token' });
    }
});




module.exports = { login, logout, register, Current, refresh }