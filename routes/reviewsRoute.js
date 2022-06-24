const express = require('express')
const reviewController = require('./../controler/reviewsController');
const authController = require('./../controler/authUserController')


const reviewRoute = express.Router({mergeParams:true});

reviewRoute.use('/',authController.protect)

reviewRoute
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.setUserID_TourID , reviewController.createReview)
    
    reviewRoute
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user','admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user','admin'),reviewController.deleteReview);

module.exports = reviewRoute;