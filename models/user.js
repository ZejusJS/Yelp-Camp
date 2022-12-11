const { options } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const ExpressError = require('../utils/ExpressError');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    }
})

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true,
    usernameCaseInsensitive: true,
    limitAttempts: true,
    maxAttempts: 6,
    unlockInterval: 1000 * 60 * 5,
    errorMessages: {
        UserExistsError: 'email taken'
    }
});

UserSchema.post('save', function (error, doc, next) {
    // console.log(error)
    if (error.code === 11000) {
        a = new Error(`Username "${doc.username}" is already taken`);
        next(a);
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);