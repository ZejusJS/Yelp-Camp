const Campground = require('../models/campground');
const Review = require('../models/review');
const Comment = require('../models/comment');
const Reply = require('../models/reply');

module.exports.isAuthorCamp = async function (req, res, next) {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);
    if (!findCampground) {
        req.flash('error', `Campground with id ${id} was not found`);
        res.redirect(`/campgrounds`);
    } else {
        if (findCampground.author.equals(req.user._id)) {
            next()
        } else {
            req.flash('error', `You do not have permission to edit this campground`);
            res.redirect(`/campgrounds/${id}`);
        }
    }
}

module.exports.isAuthorReview = async function (req, res, next) {
    const { campId, reviewId } = req.params;
    const findReview = await Review.findById(reviewId);
    if (!findReview) {
        req.flash('error', `Review with id ${reviewId} was not found`);
        res.redirect(`/campgrounds`);
    } else {
        if (findReview.author.equals(req.user._id)) {
            next()
        } else {
            req.flash('error', `You do not have permission to edit this review`);
            res.redirect(`/campgrounds/${campId}`);
        }
    }
}

module.exports.isAuthorReply = async function (req, res, next) {
    const { commentId, replyId } = req.params;
    const comment = await Comment.findById(commentId);
    const reply = await Reply.findById(replyId);
    if (!comment) {
        req.flash('error', `Comment with id ${commentId} was not found`);
        res.redirect(`/campgrounds`);
    } else if (!reply) {
        req.flash('error', `Reply with id ${replyId} was not found`);
        res.redirect(`/comments/${commentId}`);
    } else {
        if (reply.author.equals(req.user._id)) {
            next()
        } else {
            req.flash('error', `You do not have permission to delete this reply`);
            res.redirect(`/comments/${commentId}`);
        }
    }
}

module.exports.isAuthorComment = async function (req, res, next) {
    const { commentId, campId } = req.params;
    const comment = await Comment.findById(commentId);
    const campground = await Campground.findById(campId);
    if (!campground) {
        req.flash('error', `Campground with id ${campId} was not found`);
        res.redirect(`/campgrounds`);
    } else if (!comment) {
        req.flash('error', `Comment with id ${commentId} was not found`);
        res.redirect(`/campground/${campId}`);
    } else {
        if (comment.author.equals(req.user._id)) {
            next()
        } else {
            req.flash('error', `You do not have permission to delete this comment`);
            res.redirect(`/campgrounds/${campId}`);
        }
    }
}