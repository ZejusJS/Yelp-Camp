const catchAsync = require('../utils/catchAsync');
const validateCampground = require('../utils/mw-validateCampground');
const validateReview = require('../utils/mw-validateReview');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp } = require('../utils/mw-isAuthor');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

const validateRegister = require('../utils/mw-validateAuth');

module.exports.register = async function (req, res, next) {
    res.render('users/register')
}

module.exports.postRegister = async function (req, res, next) {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    try {
        const registeredUser = await User.register(user, password);
        req.login(user, function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to Yelp Camp!');
            return res.redirect('/');
        });
    } catch (e) {
        let errMsg = e.message;
        if (e.message === 'email taken') { // email taken je změněno v user.js (chema user)
            errMsg = `Email "${email}" is already taken`
        }
        req.flash('error', errMsg);
        res.redirect('/user/register');
    }
}

module.exports.login = async function (req, res, next) {
    res.render('users/login')
};

module.exports.postLogin = function (req, res, next) {
    req.flash('success', 'Logged in');
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
};

module.exports.logout = async function (req, res, next) {
    if (req.user && req.user._id) {
        req.logout(function (err) {
            if (err) return next(err)
            req.flash('success', 'Goodbye!')
            res.redirect('/')
        });
    } else {
        res.redirect('/')
    }
};

module.exports.show = async function (req, res, next) {
    const { username } = req.params;
    const user = await User.findOne({ "username": { $regex: new RegExp("^" + username.toLowerCase(), "i") } });
    if (user) {
        const campgrounds = await Campground.find({ author: user._id }).sort({ _id: "descending" });
        const reviews = await Review.find({ author: user._id }).sort({ _id: "descending" });
        res.render('users/show-user', { user, campgrounds, reviews });
    } else {
        req.flash('error', `User "${req.params}" doesn't exist`);
        res.redirect('/');
    }
};

module.exports.usernamecheck = async function (req, res, next) {
    const username = req.body.username;
    const findUser = await User.findOne({ username: username });
    if (findUser) {
        const msg = 'NAME EXIST'
        return res.send(msg)
    }
    res.send('NAME DOESNT EXIST');
}
// module.exports.