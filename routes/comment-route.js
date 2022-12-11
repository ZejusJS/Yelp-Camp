const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/mw-authentication');
const { validateComment } = require('../utils/mw-validateComment')
const { isAuthorComment, isAuthorReply } = require('../utils/mw-isAuthor')
const { limitPost, limitDelete } = require('../utils/post-limit')

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const comments = require('../controllers/comments')

router.route('/reply/:commentId')
    .post(isLoggedIn, limitPost, validateComment, catchAsync(comments.putReply))

router.route('/:campId')
    .post(isLoggedIn, limitPost, validateComment, catchAsync(comments.putComment))

router.route('/:commentId')
    .get(catchAsync(comments.showComment))

router.route('/:commentId/:campId')
    .delete(isLoggedIn, limitDelete, isAuthorComment, catchAsync(comments.deleteComment))

router.route('/reply/:commentId/:replyId')
    .delete(isLoggedIn, limitDelete, isAuthorReply, catchAsync(comments.deleteReply))



module.exports = router;