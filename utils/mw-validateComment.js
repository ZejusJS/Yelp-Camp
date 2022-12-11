const ExpressError = require('./ExpressError');

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const { commentSchema } = require('../models/joi-schemas');

module.exports.validateComment = function (req, res, next) {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}