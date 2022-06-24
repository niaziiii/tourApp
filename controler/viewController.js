const User = require('../models/newUsermodel');
const AppError = require('../utilties/appError');
const Tour = require('./../models/tourmodel');
const catchAsync = require('./../utilties/catchAsync')
const factory = require('./factoryHandlers');
const bookingModel = require('./../models/bookingmodel');


module.exports.overviewPage = catchAsync(async (req, res, next) => {
    const allTours = await Tour.find();

    res.status(200).render('overview', {
        title: 'Overview Page',
        allTours
    })
});

module.exports.tourPage = catchAsync(async (req, res, next) => {

    const tour = await Tour.find(req.params).populate({ path: 'reviews' })
        .populate({
            path: 'guides',
            select: 'name email'
        });

    if (!tour || tour.length === 0) {
        return next(new AppError('The tour is not found'))
    }
    const [data] = tour;

    res.status(200)
        // .set(
        //     'Content-Security-Policy',
        //     "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        //   )
        .render('tour', {
            title: 'tour Page',
            data: data
        })
})

module.exports.loginUser = async (req, res) => {
    const allTours = await Tour.find();

    res.status(200).render('login', {
        title: 'login Page',
        allTours
    })
}

module.exports.getUserInfo = catchAsync(async (req, res) => {
    const allBookings = await bookingModel.find();
    let booking = [];
    allBookings.forEach(el => { if (`${req.user._id}` === `${el.user._id}`) {  booking.push(el)   };  });


    res.status(200).render('myAccount', {
        title: "Profile",
        booked : booking
    })
})


module.exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('myAccount', {
        title: "Profile",
        user: updatedUser
    })
})




