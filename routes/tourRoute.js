const express = require('express')
const tourController = require('./../controler/tourController');
const authController = require('./../controler/authUserController')
const reviewRoute = require('./../routes/reviewsRoute')

const tourRouter = express.Router()

// middle for just id
// tourRouter.param('id', tourController.checkID)


tourRouter
    .route('/5-cheap-tour')
    .get(tourController.setCheapTour, tourController.getAllTours)
//  tour routes


tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

tourRouter
    .route('/tour-stats')
    .get(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.getTourStats)

tourRouter
    .route('/monthly/:year')
    .get(tourController.getMonthly)


tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

    
// /tour-witin/:distance/center/:30.169268,71.455415/unit/:unit
tourRouter
.route('/tour-witin/:distance/center/:latlng/unit/:unit')
.get(tourController.tourWitin)

tourRouter.use('/:tourId/reviews', reviewRoute)


// tourRouter
// .route('/:tourId/reviews')
// .post(authController.protect, reviews.createReview)

    

module.exports =  tourRouter;
// module.exports = homePageRouter;
