// const req = require('express/lib/request');
const AppError = require('../utilties/appError');
const Tour = require('./../models/tourmodel');
const catchAsync = require('./../utilties/catchAsync')
const factory = require('./factoryHandlers');

// tours route handelrs
exports.setCheapTour = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'rattingAverage,price';
    req.query.fields = "name,summary,price,difficulty,rattingAverage"
    next();
}

exports.getAllTours = factory.getAllDoc(Tour)
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOneDoc(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.tourHome = (req, res) => {
    res.status(200).send('<h1> working on home </h1>')
}
exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { rattingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: `$difficulty`,
                avgRatting: { $avg: '$rattingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        }
    ])
    res.status(200).json({
        status: "sucess",
        data: stats
    })
})

exports.getMonthly = async (req, res, next) => {
    try {
        const year = req.params.year;
        console.log(year)
        const monthly = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-06-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            }
        ])

        res.status(200).json({
            status: "sucess",
            length: monthly.length,
            data: monthly
        })
    }
    catch (err) {
        res.status(200).json({
            status: "failed"
        })
    }
}



exports.tourWitin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!latlng || !distance ||!unit) return next(new AppError('The given values are wrong',400))
    console.log(radius, lat,lng,unit, distance);

    const data = await Tour.find({ startLocation: { $geoWithin: { centerSphere: [[lat,lng], radius] } } });

    res.status(200).json({
        status: 'success',
        data: {
            data
        }
    })
});



// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             status: 404,
//             massage: "the name & price isnt given :)"
//         })
//     }
//     next();
// }