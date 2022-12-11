const ExpressError = require('./ExpressError');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { campgroundSchema } = require('../models/joi-schemas');
const { reviewSchema } = require('../models/joi-schemas');

const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

module.exports = validateReview;