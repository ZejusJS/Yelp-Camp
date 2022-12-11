const express = require('express');
const router = express.Router({ mergeParams: true });

const mongoose = require('mongoose');
const Joi = require('joi');
const ejsMate = require('ejs-mate');
var methodOverride = require('method-override');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const path = require('path');

const validateCampground = require('../utils/mw-validateCampground')
const validateReview = require('../utils/mw-validateReview')
const { limitPost, limitIp, limitDelete } = require('../utils/post-limit')
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp, isAuthorReview } = require('../utils/mw-isAuthor');

const Campground = require('../models/campground');
const Review = require('../models/review');


//controllers require:
const reviews = require('../controllers/reviews')
//

router.post('/', isLoggedIn, limitPost, validateReview, catchAsync(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, limitDelete, isAuthorReview, catchAsync(reviews.deleteReview));

module.exports = router;