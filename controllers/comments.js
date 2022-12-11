const express = require('express');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/mw-authentication');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const Reply = require('../models/reply');

module.exports.putComment = async function (req, res, next) {
    const { campId } = req.params
    const comment = new Comment(req.body)
    comment.author = req.user._id
    comment.campground = campId
    const campground = await Campground.findByIdAndUpdate(campId, { $push: { comments: comment._id } }, { runValidators: true, new: true })
    if (campground) {
        await comment.save()
        res.redirect(`/campgrounds/${campId}`)
    } else {
        req.flash('error', `Campgound with id ${campId} was not found`)
        res.redirect('/')
    }
}

module.exports.putReply = async function (req, res, next) {
    const { commentId } = req.params
    const reply = new Reply(req.body)
    const comment = await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply._id } }, { runValidators: true, new: true })
    if (comment) {
        reply.campground = comment.campground
        reply.author = req.user._id
        await reply.save()
        res.redirect(`/comments/${commentId}`)
    } else {
        req.flash('error', `Comment with id ${commentId} was not found`)
        res.redirect('/')
    }
}

module.exports.showComment = async function (req, res, next) {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId).populate({ path: 'replies', populate: { path: 'author' } }).populate('campground').populate('author')
    if (comment) {
        res.render('comments/show', { comment })
    } else {
        req.flash('error', `Comment with id ${commentId} doesn't exist`)
        res.redirect('/')
    }
}

module.exports.deleteComment = async function (req, res, next) {
    console.log('HHHHHHHHHHHHHHHHHHHHHHH')
    const { commentId, campId } = req.params
    const campground = await Campground.findByIdAndUpdate(campId, { $pull: { comments: { $in: [commentId] } } })
    const comment = await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Comment deleted')
    res.redirect(`/campgrounds/${campId}`)
}

module.exports.deleteReply = async function (req, res, next) {
    const { replyId, commentId } = req.params
    const comment = await Comment.findByIdAndUpdate(commentId, { $pull: { replies: { $in: [replyId] } } })
    const reply = await Reply.findByIdAndDelete(replyId)
    req.flash('success', 'Reply deleted')
    res.redirect(`/comments/${commentId}`)
}