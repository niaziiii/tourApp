const User = require('./../models/newUsermodel')
const catchAsync = require('./../utilties/catchAsync')
const AppError = require('./../utilties/appError')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sendEmail = require('./../utilties/mail')
const crypto = require('crypto');
const Email = require('./../utilties/mailProd');

const TokenGenerate = id => {
    return jwt.sign({ id: id }, process.env.JWTSECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

const createSendTokenCookie = (user, statusCode, res) => {
    const token = TokenGenerate(user._id);

    const cookieOptions = {
        expire: new Date(Date.now() + process.env.JWT_Cookie_EXPIRE_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    
    if (process.env.NODE.ENV === "production") cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })
}

exports.logout = (req,res) =>{
    res.cookie('jwt','logout',{
        expires : new Date(Date.now() + 10 * 1000),
        httpOnly: true,

    })

    res.status(200).json({
        status : 'success'
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(newUser,url).sendWellcome()

    createSendTokenCookie(newUser, 201, res)
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!password || !email) return next(new AppError('Provided email & password incorrect', 401));

    const user = await User.findOne({ email }).select('+password')
    if (!user) return next(new AppError('incorrect email & password', 401));

    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) return next(new AppError('incorrect email & password', 401));

    createSendTokenCookie(user, 200, res)

})

exports.protect = catchAsync(async (req, res, next) => {
    //  1). getting token and check it
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) { token = req.headers.authorization.split(' ')[1]; }
    else if (req.cookies.jwt) { token = req.cookies.jwt }


    if (!token) return next(new AppError('Your are not logged in! Please login to get access', 401));


    // 2). Verification token like user id 
    const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRET)


    // 3). Check if there user stil exit || deleted himself
    const freshUser = await User.findOne({ _id: decoded.id })

    if (!freshUser) {
        return next(new AppError('The user is not belong to this token! Please login to get access', 401));
    }



    // 4). check user change password and after the token issued

    if (await freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('The user change his Password! Please login to get access', 401));
    }

    req.user = freshUser;
    res.locals.user = freshUser;

    next();
});

// this function is for front-end pages to check cookies logged in
exports.isLoggedIn = async (req, res, next) => {
   try {
        //  1). getting token and check it
    if (req.cookies.jwt) {

        // 2). Verification token like user id 
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWTSECRET)

        // 3). Check if there user stil exit || deleted himself
        const freshUser = await User.findById({ _id: decoded.id })
        if (!freshUser) return next()
        // 4). check user change password and after the token issued

        if (freshUser.changePasswordAfter(decoded.iat)) return next()
        res.locals.user = freshUser;
         return next()
    }
    next();
   } catch (error) {
     return  next()
   }
};

exports.restrictTo = (...roles) => {
    // roles are : lead-guide , admin
    return (req, _, next) => {

        if (!roles.includes(req.user.role)) return next(new AppError('Your have no authorization to performe this 🔥🔥', 401));
        next()
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on Posted email
    const user = await User.findOne({ email: req.body.email })


    if (!user) {
        return next(new AppError('There is no user with this email 🔥🔥', 401));
    }

    //  2) Geneterate random reset token
    const resetToken = user.createPasswordRestToken();
    await user.save({ validateBeforeSave: false })

    // 3) Send it to user's Email

    try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`
    new Email(user,resetURL).passwordRest()

    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There is an error sending in email . Try again later 🔥🔥', 500));
    }


    res.status(200).json({
        status: 'success',
        message: 'token sended to email'
    })

})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1.  get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');


    const nowTime = Date.now();


    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: nowTime }
    })



    // 2. If token is not expired then there is user and set new password
    if (!user) return next(new AppError('Token is invalid or expired', 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    const token = TokenGenerate(user._id)
    res.status(201).json({
        status: 'success',
        token: token,
        user: user
    })
})
