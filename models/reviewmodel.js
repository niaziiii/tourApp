const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'An review can not be empty!!']
    },
    ratting: {
        type: Number,
        max: 5,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'the review must belong to Tour'],
        ref: 'Tour'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'the review must belong to User'],
        ref: 'users'
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

reviewsSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name  guides maxGroupSize'
    }).populate({
        path: 'user',
        select: '__v name email'
    })
    next()
})


const Review = mongoose.model('reviews', reviewsSchema);

module.exports = Review;