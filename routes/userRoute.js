const express = require('express')
const userController = require('./../controler/userController')
const authUserController = require('./../controler/authUserController')
const rateLimit = require('express-rate-limit')

//  routes
const userRouter = express.Router()



// rate limiter for same api for single route using express-rate-limiting
const limiter = rateLimit({
    max: 5,
    windowMs: 5 * 60 * 1000,
    message: "to many request kindly wait 5 - mins "
})
// app.use('/api/v1/user/forget-Password', limiter);

// user login & sign-up routes and admin can also login
userRouter.post('/signup', authUserController.signup);
userRouter.post('/login', authUserController.login);
userRouter.get('/logout', authUserController.logout)

// user forget and reset-password with token just for users
userRouter.post('/forget-Password', limiter, authUserController.forgetPassword);
userRouter.patch('/reset-password/:token', authUserController.resetPassword);

// User can change Email & Name & DeleteMe mean inactive Himself :) 
// userRouter.patch('/updateMe', authUserController.protect, userController.updateMe);

userRouter.use(authUserController.protect)

userRouter.delete('/deleteMe', userController.DeleteMe);
userRouter.get('/me', userController.me, userController.getUser)
userRouter
.patch('/updateMe',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe);


userRouter
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createUser);

userRouter
    .route('/:id')
    .get(userController.getUser)
    .delete(authUserController.protect, authUserController.restrictTo('admin'), userController.delteUser);



module.exports = userRouter;