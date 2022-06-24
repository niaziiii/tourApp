const mongoose = require('mongoose');

const schema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'the booking must require Tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'the booking must require user'],
    },
    price: {
        type: String,
        required: [true, 'the booking must require Price'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email role _id'
    }).populate({
        path: 'tour',
        select: 'name summary imageCover'
    })
    next()
})

const booking = mongoose.model('booking', schema);

module.exports = booking;

