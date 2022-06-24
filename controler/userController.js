const User = require('./../models/newUsermodel')
const catchAsync = require('./../utilties/catchAsync')
const AppError = require('./../utilties/appError')
const factory = require('./factoryHandlers')
const multer = require('multer')
const sharp = require('sharp');



// images serving
//  1. Create storage
//  2. create filter
//  3. add storage&filter to route
//  4. add upload to route
//  5. resize or uodate the image of buffer form


// const multerStorage = multer.diskStorage({
//     destination: (req, file, callBackk) => {
//         callBackk(null, 'public/imgs/users')
//     },
//     filename: (req, file, callBackk) => {
//         const ext = file.mimetype.split('/')[1]
//         callBackk(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

const multerFilter = (req, file, callBackk) => {
    if (file.mimetype.startsWith('image')) {
        callBackk(null, true)
    } else {
        callBackk(new AppError('the file type isnt image', 400), false)
    }
}
const multerStorage = multer.memoryStorage()

const upload =multer({
    storage:multerStorage,
    fileFilter : multerFilter
})
module.exports.uploadUserPhoto = upload.single('photo');
module.exports.resizeUserPhoto = (req,file,next)=>{
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/images/users/${req.file.filename}`);

    next()
}



const filterObj = (obj, ...alowedFields) => {
    // obj & allowedfield is array
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (alowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj;
}
module.exports.DeleteMe = catchAsync(async (req, res, next) => {
    if (req.user.role = 'user') req.user.active = false;

    await User.findByIdAndUpdate(req.user._id, { active: req.user.active }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: "Success",
        massage: `The Current User '${req.user.name}' is Deleted!`
    });
})
module.exports.updateMe = catchAsync(async (req, res, next) => {

    if (req.body.password || req.body.confirmPassword)  return next(new AppError(`The route isnt for password update..`, 400))
    
    const objectMain = filterObj(req.body, 'name', 'email');
    if(req.file) objectMain.photo = req.file.filename;

    
        const updateUser = await User.findByIdAndUpdate(
        req.user._id,
        objectMain,
        {
            new: true,
            runValidators: true
        }
    );


    res.status(200).json({
        status: "Success",
        user: updateUser
    });
})
module.exports.createUser = (req, res) => {
    res.status(500).json({
        status: "5000 internal server erro",
        massage: 'this functionality is not gona work kindly visit /signup instead'
    });
}

module.exports.me = (req, res, next) => {
    req.params.id = req.user.id;
    next()
}
module.exports.getAllUser = factory.getAllDoc(User)
module.exports.getUser = factory.getOneDoc(User)
module.exports.delteUser = factory.deleteOne(User);

