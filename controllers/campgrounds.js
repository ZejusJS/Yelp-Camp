const catchAsync = require('../utils/catchAsync');
const validateCampground = require('../utils/mw-validateCampground');
const validateReview = require('../utils/mw-validateReview');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/mw-authentication');
const { isAuthorCamp } = require('../utils/mw-isAuthor');
const { isImgsAuthor } = require('../utils/is-imgs-author');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const Reply = require('../models/reply');
const Comment = require('../models/comment');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

const { cloudinary } = require('../cloudinary/index')
const { storageCampImg } = require('../cloudinary/index')
const multer = require('multer') // multer je middleware pro files
const uploadCampImg = multer({ storage: storageCampImg, limits: { fileSize: 10000000, files: 7 } }).array('image') //jak se campgrounds images ukládají


module.exports.index = async function (req, res) {
    const accept = JSON.stringify(req.headers.accept)

    if (!req.query.page && !req.query.search || req.query.page && !req.query.infinite) {
        const campgrounds = await Campground.paginate({}, {
            sort: {
                _id: "descending",
            },
            populate: 'reviews',
            limit: 10
        }).then({});
        return res.render('campgrounds/index', { campgrounds, searchInput: null, stype: null });
    } else if (req.query.infinite && accept.match(/(application\/json, text\/plain)/g)) { // /(application\/json, text\/plain)/g je aby to bylo jen z axios (ten acceptuje jen plain text nebo json)
        const { page, search = "", stype = "" } = req.query
        const searchInput = search.trim()
        let find = {};
        if (stype === "title" || !stype.length) {
            find = {
                title: { $in: new RegExp(searchInput, "i") }
            }
        } else if (stype === "location") {
            find = {
                location: { $in: new RegExp(searchInput, "i") }
            }
        }

        const campgrounds = await Campground.paginate(find, {
            page,
            sort: {
                _id: "descending",
            },
            populate: 'reviews',
            limit: 13,
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            return res.status(200).json(result)
        })
    } else if (req.query.search) {
        const { search = "", stype = "" } = req.query
        const searchInput = search.trim()
        let find;
        if (stype === "title" || !stype.length) {
            find = {
                title: { $in: new RegExp(searchInput, "i") }
            }
        } else if (stype === "location") {
            find = {
                location: { $in: new RegExp(searchInput, "i") }
            }
        }

        const campgrounds = await Campground.paginate(find, {
            sort: {
                _id: "descending",
            },
            populate: 'reviews',
            limit: 13,
        }, function (err, result) {
            if (err) {
                req.flash('error', `Something went wrong with looking for campground ${searchInput}`)
                return res.redirect('/campgrounds');
            }
            return res.render('campgrounds/index', { campgrounds: result, searchInput, stype });
        })
    } else {
        res.status(400).redirect('/campgrounds')
    }
};

module.exports.getNew = async function (req, res) {
    res.render('campgrounds/new');
};

module.exports.postNew = async function (req, res, next) {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename, author: req.user._id }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async function (req, res) {
    try {
        var campground = await Campground.findById(req.params.id)
            .populate({ path: 'reviews', populate: { path: 'author' } }) //druhý populate populuje autora v už populatnutým review
            .populate('author')
            .populate({ path: 'comments', populate: { path: 'author' } })
        if (campground.images.length < 1) { // když tam není žádná obrázek
            campground.images.push({ url: 'https://res.cloudinary.com/dnzagaln5/image/upload/w_700/v1669613670/YelpCamp/tent_camping_night_191593_1280x720_b6pg3p.jpg' })
        }
        campground.reviews.reverse();
        campground.comments.reverse();
        res.render('campgrounds/show', { campground });
    }
    catch (e) {
        req.flash('error', `Campground "${req.params.id}" was not found`);
        return res.redirect('/campgrounds')
    }
};

module.exports.edit = async function (req, res) {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        req.flash('error', `Campground "${req.params.id}" was not found`);
        res.redirect('/campgrounds')
    }
};

module.exports.putEdit = async function (req, res) {
    const { id } = req.params;
    const oldCamp = await Campground.findById(id);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename, author: req.user._id })); // protože .map nám vytvoří array, ale mongo chce objekty, tak musíme v dalším řádku spread imgs
    campground.images.push(...imgs); // .push, protože to je array obrázků ('...' nám z array imgs vytáhne jednotlivý objekty)
    await campground.save();
    if (req.body.deleteImages) {
        const filenames = [];
        for (let filename of req.body.deleteImages) {
            if (isImgsAuthor(oldCamp.images, filename)) { // ZJIŠTĚNÍ JESTLI VŮBEC JE TEN OBRÁZEK SOUČÁSTÍ TOHO CAMPGROUNDU - jiní by mohli smazat obrázek campgroundu, který nevlastní
                await cloudinary.uploader.destroy(filename);
                filenames.push(filename);
            }
        }
        if (filenames.length) {
            await campground.updateOne({ $pull: { images: { filename: { $in: filenames } } } })
        }
    }
    req.flash('success', 'Successfully updated a campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async function (req, res) {
    const campground = await Campground.findByIdAndDelete(req.params.id).populate('comments');
    if (!campground) {
        req.flash('error', 'That campground was not found');
        res.redirect('/campgrounds')
    } else {
        if (campground.images.length > 0) {
            for (let img of campground.images) {
                await cloudinary.uploader.destroy(img.filename);
            }
        }
        if (campground.comments && campground.comments.length) {
            for (let comment of campground.comments) {
                await Reply.deleteMany({ _id: { $in: comment.replies } })
            }
        }
        req.flash('success', `Successfully deleted the campground "${campground.title}" with ${campground.reviews.length} reviews`);
        res.redirect('/campgrounds');
    }
};

module.exports.title = async function (req, res) {
    const title = req.body.title;
    const findCamp = await Campground.findOne({ title: title });
    if (findCamp) {
        const msg = 'NAME EXIST'
        return res.send(msg)
    }
    res.send('NAME DOESNT EXIST');
};

module.exports.mapdata = async function (req, res) {
    const { search = "", stype = "" } = req.query
    const searchInput = search.trim()
    let campgrounds;
    let find;
    if (stype === "title" || !stype.length) {
        find = {
            title: { $in: new RegExp(searchInput, "i") }
        }
    } else if (stype === "location") {
        find = {
            location: { $in: new RegExp(searchInput, "i") }
        }
    }

    if (searchInput && searchInput.length) {
        campgrounds = await Campground.find(find);
    } else {
        campgrounds = await Campground.find({});
    }

    const showedData = []
    for (let camp of campgrounds) {
        showedData.push({
            geometry: camp.geometry,
            properties: {
                title: camp.title,
                location: camp.location,
                _id: camp._id
            }
        })
    }
    res.send({ features: showedData }) // mapbox hledá features
};