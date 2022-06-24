const express = require('express')
const bookingController = require('./../controler/bookingController');
const authController = require('./../controler/authUserController')
const reviewRoute = require('./../routes/reviewsRoute')

const Router = express.Router()

Router.get('/check-out-session/:tourId',
    authController.protect,
    bookingController.getCheckOutSession)



module.exports = Router;
// module.exports = homePageRouter;
