const mongoose = require('mongoose');
var isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const newUserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name isnt provided'],
    },
    email: {
        type: String,
        required: [true, 'Email isnt provided'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email isnt provided Correctly']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'lead', 'lead-guide'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Pasword isnt provided'],
        select: false,
        minlength: [8, 'Password must have more than 8 charcter'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'confirm password isnt same'],
        validate: {
            validator: function () {
                return this.confirmPassword === this.password
            }
        }
    },
    passwordChangedAt: Date,
    photo: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active :{
        type : Boolean,
        default : true,
        select : false
    }
});


// newUserSchema.pre(/^find/, function (next) {
//     this.find({active : {$ne : false},role:{$ne:'admin'}})
//     next()
// })

newUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next()
})
newUserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    const nowTime = Date.now() - 1000
    this.passwordChangedAt = nowTime
    next()
})
// creating an instance on this schema which is availble to all of the 
// current this schema document.. newUserSchema.methods.correctPassword  
newUserSchema.methods.correctPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass)
}
newUserSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimeStamp < changeTimeStamp
    }
    // false mean not change
    return false
}

newUserSchema.methods.createPasswordRestToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const tenMinLater = Date.now() + (10 * 60 * 1000);

    this.passwordResetExpires = tenMinLater;
    return resetToken
}

const User = mongoose.model('users', newUserSchema);
module.exports = User;