if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const { RateLimiterMongo } = require('rate-limiter-flexible');
var os = require("os");
const { cloudinary } = require('./cloudinary/index')
const { storageCampImg } = require('./cloudinary/index')
const multer = require('multer') // multer je middleware pro files

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const dbUrl = process.env.DB_URL  // 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});
mongoose.set('strictQuery', true);

// ----


// ----

const sessionStore = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 60 * 60 * 10, // v SEKUNDÁCH!!!!!!
    crypto: {
        secret: process.env.SECRET
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true) // pro získání reálné IP adresy z req.ip
app.engine('ejs', ejsMate);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('method-override'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: sessionStore,
    name: "yelp-camp",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 5
    }
}));
// app.use(mongoSanitize());    // má to nová verze mongoose už v sobě... stačí: mongoose.set('strictQuery', true);



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/",
    "https://res.cloudinary.com/dnzagaln5/",
    "https://unpkg.com/infinite-scroll@4/dist/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/",
    "https://res.cloudinary.com/dnzagaln5/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/",
    "https://res.cloudinary.com/dnzagaln5/"
];
const fontSrcUrls = [];
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnzagaln5/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




// Passport:
const User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//


const validateCampground = require('./utils/mw-validateCampground');
const validateReview = require('./utils/mw-validateReview');
const { limitPost, limitIp, limitDelete } = require('./utils/post-limit')

const Campground = require('./models/campground');
const Review = require('./models/review');

const { campgroundSchema } = require('./models/joi-schemas');
const { reviewSchema } = require('./models/joi-schemas');

app.use(function (req, res, next) {
    // console.log(req.session)
    res.locals.currentUser = req.user; // Každá ejs stránka má přístup k informaci o uživateli (použit např. v navbar)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ----------

const campgroundRout = require('./routes/campgrounds-route');
const reviewRout = require('./routes/reviews-route');
const authRout = require('./routes/users-route');
const tryRout = require('./routes/try-route');
const commentRout = require('./routes/comment-route');

app.use('/campgrounds', campgroundRout);
app.use('/campgrounds/:campId/reviews', reviewRout);
app.use('/user', authRout);
app.use('/comments', commentRout)
app.use('/', tryRout);
app.get('/about', function (req, res) {
    res.render('mix/about')
})

const { isFromCampgroundsIndex } = require('./utils/checkReferer')
const campgrounds = require('./controllers/campgrounds')
app.get('/campgrounds_map_data', isFromCampgroundsIndex, limitIp, catchAsync(campgrounds.mapdata))

// ----------

app.get('/', catchAsync(async function (req, res, next) {
    const campCount = await Campground.countDocuments({}); // .countDocument je k zobrazení počtu dokumentů v kolekci
    res.render('homepage', { campCount });
}));

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use(async (err, req, res, next) => {
    try {
        const { status = 500 } = err;
        if (!err.message) err.message = 'Internal Server Error';
        console.log(err);

        if (req.files && req.files.length) { // pro odstranění souborů, který zbyly po erroru
            images = req.files.map(f => ({ url: f.path, filename: f.filename }));
            for (let img of images) {
                await cloudinary.uploader.destroy(img.filename);
            }
        }

        res.status(status).render('templates/error', { err });
    } catch (e) {
        console.log('FATAL ERROR!!!!!!!!!!!!!', e)
        res.redirect('/')
    }
});

app.listen(port, () => {
    console.log('LISTENNING ON PORT:', port);
});

