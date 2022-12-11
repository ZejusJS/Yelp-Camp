const ExpressError = require('./ExpressError');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { campgroundSchema } = require('../models/joi-schemas');
const { reviewSchema } = require('../models/joi-schemas');

const catchAsync = require('../utils/catchAsync');

//
const { cloudinary } = require('../cloudinary/index')
const { storageCampImg } = require('../cloudinary/index')
const multer = require('multer') // multer je middleware pro files
const uploadCampImg = multer({ storage: storageCampImg, limits: { fileSize: 10000000, files: 7 } }).array('image') //jak se campgrounds images ukládají
//

const validateCampground = catchAsync(async function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    const errorDuplicitTitle = await Campground.findOne({ title: req.body.campground.title });
    if (error) {
        for (let img of req.files) {
            await cloudinary.uploader.destroy(img.filename);
        }
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        if (errorDuplicitTitle) {
            req.flash('error', `Campground with the title ${req.body.campground.title} already exists`);
            return res.redirect('/campgrounds/new');
        }
        next();
    }
});

const validatePutCampground = catchAsync(async function (req, res, next) {
    const { id } = req.params;
    const { error } = campgroundSchema.validate(req.body);
    const campground = await Campground.findById(id);
    if (campground.images.length + req.files.length > 7) { // protože nechci mít jak 7 obrázků v campgroundu
        for (let img of req.files) {
            await cloudinary.uploader.destroy(img.filename);
        }
        req.files = [];
    }
    if (error) {
        for (let img of req.files) {
            await cloudinary.uploader.destroy(img.filename);
        }
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
});

module.exports = { validateCampground, validatePutCampground };