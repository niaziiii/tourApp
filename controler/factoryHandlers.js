const catchAsync = require('../utilties/catchAsync')
const AppError = require('../utilties/appError');
const apiFeature = require('./../utilties/apiFeature')

module.exports.deleteOne = Model => {
    return catchAsync(async (
        req, res, next) => {
            
        const delDocument = await Model.findByIdAndDelete(req.params.id)
        if (!delDocument) return next(new AppError('The Doc isnt found with that id 🔥🔥', 404));

        res.status(204).json({
            status: 204,
            massagess: "data is no more",
            data: delDocument
        })
    })
}

module.exports.getAllDoc = Model => 
    catchAsync(async (req, res, next) => {
        let filter = {}
        if(req.params.tourId) filter = {tour : req.params.tourId}

        const features = new apiFeature(Model.find(filter), req.query)
            .filter()
            .sorting()
            .limiting()
            .pagination();
    
        // const doc = await features.query.explain()
        const doc = await features.query;

      
        res.status(200).json({
            status: 'sucess',
            size: doc.length,
            data : doc
        });
})

module.exports.createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)
        res.status(201).json(
            {
                status: "sucess",
                data: {
                    data: doc
                }
            }
        );
    
    })
}

module.exports.updateOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({
            status: "sucess",
            data: doc
        })
    })
}
module.exports.getOneDoc = (Model,populateOptions) =>{
    return  catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if(populateOptions) query.populate(populateOptions);
        const doc = await query;
    
        if (!doc) return next(new AppError('The document isnt found with that id 🔥🔥', 404));
    
        res.status(200).json({
            status: 'sucess',
            alldata: doc
        });
    })
}

