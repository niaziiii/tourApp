const catchAsync = require('./../utilties/catchAsync')
const AppError = require('./../utilties/appError')
const Tour = require('./../models/tourmodel');
const Stripe = require('stripe')
const bookingModel = require('./../models/bookingmodel');

module.exports.getCheckOutSession = catchAsync(async (req, res, next) => {
    const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`)

    const tour = await Tour.findById(req.params.tourId)
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [tour.imageCover],
            amount: tour.price * 100,
            currency: 'usd',
            quantity: 1
        }]
    })


    res.status(200).json({
        status: 'success',
        session
    })
})

module.exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // this is temporary cuz unsecure anyone booking without paying.
    const { tour, user, price } = req.query;
    if (!price && !tour && !user) return next();
    await bookingModel.create({ tour, user, price })
    res.redirect(`${req.protocol}://${req.get('host')}`)
})
