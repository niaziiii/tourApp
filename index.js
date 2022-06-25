const express = require('express');
const helmet = require("helmet");
const xss = require('xss-clean')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize');
// const pug = require('pug');
const path = require('path')
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utilties/appError')
const globalErrorHandler = require('./controler/errorControler')

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewsRoute');
const homeRouter = require('./routes/homeRouter');
const viewRouter = require('./routes/viewRouter');
const bookingRouter = require('./routes/bookingRouter');



const app = express();

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'))


// serving static files
app.use(express.static(`${__dirname}/public/`));
app.use(express.static(path.join(__dirname,'views')));

// this middleware use every request and send to store data
app.use(homeRouter.visitFn)

// set security http Headers. 
// app.use(helmet());
//Access req.body || parse cookies from front-end & set limit of data to 10kb 
app.use(express.json({limit : '10kb'}));
app.use(express.urlencoded({extended : true, limit:'10kb'}))
app.use(cookieParser());


// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// prevent parameters pollution if we input array of white list prams
//  its mean there can use used duplicates
app.use(hpp({
    whitelist:[
        'duration',
        'ratingQauntity',
        'rattingAverage',
        'createdAt',
        'maxGroupSize',
        'difficulty',
        'price']
}))

app.use(compression())



//  routers
app.use('/',viewRouter);
app.use('/stats', homeRouter.homeRoute);

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/reviews', reviewRoute)
app.use('/api/v1/bookings', bookingRouter)




// some kind of middleWare for express to undefined routes to send custom json || html
app.all('*', (req, res, next) => {
    // console.log(req.originalUrl);
    next(new AppError(`Error :: cant find router -> ${req.originalUrl} <-`, 404))
})



// global middleWare error handler for operational errors
app.use(globalErrorHandler)

module.exports = app; 





