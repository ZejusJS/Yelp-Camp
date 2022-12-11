const ExpressError = require('./ExpressError');

const User = require('../models/user');

const { registerSchema, loginSchema } = require('../models/joi-schemas');

module.exports.validateRegister = async function (req, res, next) {
    const { error } = registerSchema.validate(req.body);
    const { username } = req.body
    const userFindUsername = await User.findOne({ "username": { $regex: new RegExp("^" + username.toLowerCase(), "i") } });
    if (userFindUsername) {
        req.flash('error', `Username "${username}" is already taken`);
        res.redirect('/user/register');
    }
    else if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(error);
        req.flash('error', msg);
        res.redirect('/user/register');
    } else {
        if (/[^a-zA-Z0-9 ]/g.test(req.body.username) || /[&\/\\#,+()$~%'":*?<>{}]/g.test(req.body.email)) {
            req.flash('error', `Username and email can't contain special characters`);
            res.redirect('/user/register');
        } else {
            next();
        }
    }
}

module.exports.validateLogin = function (req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(error);
        req.flash('error', msg);
        return res.redirect('/user/login');
    } else {
        if (/[&\/\\#,+()$~%'":*?<>{}]/g.test(req.body.email)) {
            req.flash('error', `Email can't contain special characters`);
            return res.redirect('/user/login');
        } else {
            next();
        }
    }
}