const catchAsync = require('../utils/catchAsync');
const validateCampground = require('../utils/mw-validateCampground');
const validateReview = require('../utils/mw-validateReview');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp } = require('../utils/mw-isAuthor');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

module.exports.postReview = async function (req, res, next) {
    const campground = await Campground.findById(req.params.campId);
    const review = new Review(req.body.review);
    if (campground) {
        campground.reviews.push(review);
        review.author = req.user._id;
        review.campgroundTitle = campground.title;
        review.campgroundId = campground._id;
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully made a review');
        res.redirect(`/campgrounds/${campground._id}`);
    } else {
        const err = new ExpressError(400, 'Campground was not found')
        next(err)
    }
};

module.exports.deleteReview = async function (req, res, next) {
    const campground = await Campground.findByIdAndUpdate(req.params.campId, { $pull: { reviews: { $in: [req.params.reviewId] } } });
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.campId}`);
};