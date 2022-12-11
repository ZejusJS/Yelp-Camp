const express = require('express');
const router = express.Router({ mergeParams: true });

const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { validateCampground, validatePutCampground } = require('../utils/mw-validateCampground')
const validateReview = require('../utils/mw-validateReview')
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp } = require('../utils/mw-isAuthor');

const Campground = require('../models/campground');
const Review = require('../models/review');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});

router.get('/yep', catchAsync(async function (req, res, next) {
    console.log(req.params);
    res.render('zkouseni/axios');
}));

router.get('/try', catchAsync(async function (req, res, next) {
    console.log(req.user);
    const camp = await Campground.findOne();
    res.json(camp);
}));

router.post('/try', isLoggedIn, validateCampground, catchAsync(async function (req, res, next) {
    console.log('ZZZ', req.user);
    console.log('QQQ', req.body);
    // console.log('LOL', req.params);

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    // campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();

    res.send('haha');
}));

module.exports = router