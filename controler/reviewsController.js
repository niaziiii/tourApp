const catchAsync = require('./../utilties/catchAsync')
const AppError = require('./../utilties/appError')
const Review = require('./../models/reviewmodel');
const factory = require('./factoryHandlers')

module.exports.setUserID_TourID = (req,res,next) =>{
    if (!req.body.user) req.body.user = req.user._id
    if (!req.body.tour) req.body.tour = req.params.tourId 
    next()
}

module.exports.getAllReviews = factory.getAllDoc(Review)
module.exports.getReview = factory.getOneDoc(Review);
module.exports.createReview = factory.createOne(Review);
module.exports.deleteReview = factory.deleteOne(Review);
module.exports.updateReview = factory.updateOne(Review);