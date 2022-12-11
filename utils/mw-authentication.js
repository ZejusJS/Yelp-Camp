const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.isLoggedIn = async function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        res.redirect('/user/login');
    } else {
        next();
    }
}

module.exports.isLoggedInNeg = async function (req, res, next) {
    if (req.isAuthenticated()) {
        req.flash('error', 'You are already signed in!');
        res.redirect('/');
    } else {
        next();
    }
}