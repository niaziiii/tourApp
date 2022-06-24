//  create a modle schema for DB
const mongoose = require('mongoose');
// const User = require('./newUsermodel');
var slugify = require('slugify')


const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name isnt provided'],
        unique: true,
        maxlength: [40, 'A tour name must have less than 40 charcter'],
        minlength: [10, 'A tour name must have more than 10 charcter'],
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have Group Size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            massage: 'A diffculty must be easy'
        }
    },
    rattingAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'A tour rating must be 5.0'],
        min: [1, 'A tour rating must be 1.0']
    },
    ratingQauntity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'price isnt given']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            massage: 'the discountPrice must be less than price'
        }
    },
    summary: {
        type: String,
        required: [true, "A tour must have summary"],
        trim: true
    },
    descripion: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A must have cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: Boolean,
    startLocation : {
        // GETJSON
           type:{
               type : String,
               default : "Point",
               enum : ["Point"]
           },
           coordinates : [Number],
           address : String,
           description : String
    },
    locations : [{
        // GETJSON
           type:{
               type : String,
               default : "Point",
               enum : ["Point"]
           },
           coordinates : [Number],
           address : String,
           description : String,
           day : Number
    }],
    guides : [{
        // For Reference data inside
        type : mongoose.Schema.ObjectId,
        ref : 'users'

        // for embeded data inside
        // type : Array
        // default : ["625ad166a46f622be037c8fa","625ad14ba46f622be037c8f6"]
    }]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })



// tourSchema.index({price : 1});
tourSchema.index({price : 1, rattingAverage :-1});
tourSchema.index({slug : 1});
tourSchema.index({startLocation : '2dsphere'})
// virtual property for adding more option to our get data instead of saving in DB
tourSchema.virtual('weekDuration').get(function () {
    return this.duration / 7;
})

tourSchema.virtual('reviews', {
    ref : 'reviews',   // this is referenece to model name same as cluster collection
    foreignField : 'tour', //this is model ref value inside model
    localField : '_id'
})
// DOCUMENT MIDDLEWARE whenever user save() or create() 
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    // console.log(this.name)
    next()
})

// for embaded data insdie
// tourSchema.pre('save',async function (next) {
//     const guiders =  this.guides.map(async id => await User.findById(id) )
//     this.guides =  await Promise.all(guiders);
//     next()
// })

// Query MIDDLEWARE (all tours are without screctTour === true )
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next();
})



const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;