const express = require('express');
const router = express.Router({ mergeParams: true });

const mongoose = require('mongoose');
const Joi = require('joi');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const ejsMate = require('ejs-mate');

const { validateCampground, validatePutCampground } = require('../utils/mw-validateCampground')
const validateReview = require('../utils/mw-validateReview')
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp } = require('../utils/mw-isAuthor');
const { limitPost, limitIp, limitDelete } = require('../utils/post-limit')

const Campground = require('../models/campground');
const Review = require('../models/review');


const { mwUploadCampImg } = require('../utils/mw-imgUpload');
const { isFromCampgroundsIndex } = require('../utils/checkReferer')

// controllers require:
const campgrounds = require('../controllers/campgrounds')
//

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, limitPost, mwUploadCampImg, validateCampground, catchAsync(campgrounds.postNew))

router.get('/new', isLoggedIn, catchAsync(campgrounds.getNew))

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, limitPost, isAuthorCamp, mwUploadCampImg, validatePutCampground, catchAsync(campgrounds.putEdit))
    .delete(isLoggedIn, limitDelete, isAuthorCamp, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthorCamp, catchAsync(campgrounds.edit))

router.post('/istitletaken', isFromCampgroundsIndex, catchAsync(campgrounds.title))





module.exports = router;