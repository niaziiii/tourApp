const express = require('express');
const viewController = require('./../controler/viewController')
const authController = require('./../controler/authUserController')
const bookingController = require('./../controler/bookingController')

const viewRoute = express.Router();


viewRoute.get('/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.overviewPage)

viewRoute.get('/tour/:slug',
    authController.isLoggedIn,
    viewController.tourPage)

viewRoute.get('/login',
    authController.isLoggedIn,
    viewController.loginUser)

viewRoute.get('/myAccount',
    authController.protect,
    viewController.getUserInfo)

//   for more traditonal way to submiting form
// viewRoute.post('/submit-user-data',authController.protect,viewController.updateUserData)



module.exports = viewRoute;