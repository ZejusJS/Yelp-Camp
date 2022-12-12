const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const ExpressError = require('../utils/ExpressError');

const db = mongoose.connection;

const maxConsPointsComment = 1;
const maxConsPointsIp = 90;
const maxConsPointsDelete = 5;

const opts = {
    storeClient: db,
    points: maxConsPointsComment, // Number of points
    duration: 7, // Per second(s)
    blockDuration: 15, // Per second(s)
    keyPrefix: 'request_once',
};

const opts2 = {
    storeClient: db,
    points: maxConsPointsIp, // Number of points
    duration: 15, // Per second(s)
    blockDuration: 10, // Per second(s)
    keyPrefix: 'request_once',
};

const opts3 = {
    storeClient: db,
    points: maxConsPointsDelete, // Number of points
    duration: 2, // Per second(s)
    blockDuration: 7, // Per second(s)
    keyPrefix: 'request_once',
};



module.exports.limitPost = catchAsync(async function (req, res, next) {
    try {
        const rateLimiterComments = new RateLimiterMongo(opts);

        const userId = req.user._id
        const userPoint = await rateLimiterComments.get(userId)

        if (userId && userPoint && userPoint.consumedPoints > maxConsPointsComment) {
            req.flash('error', 'Too many requests !!!')
            res.redirect('/campgrounds')
        } else {
            await rateLimiterComments.consume(userId, 1);
            next()
        }
    } catch (e) {
        if (e.remainingPoints === 0) {
            req.flash('error', 'Too many requests !!!')
            res.redirect('/')
        } else {
            const err = new ExpressError(500, 'Internal Server Error while limiting requests. Try limit your number of requests on this website.')
            next(err)
        }
    }
})

module.exports.limitIp = catchAsync(async function (req, res, next) {
    try {
        const rateLimiterIp = new RateLimiterMongo(opts2);

        const user = req.ip
        console.log(user)
        const userPoint = await rateLimiterIp.get(user)

        if (user && userPoint && userPoint.consumedPoints > maxConsPointsIp) {
            const err = new ExpressError(429, 'Too many requests!!! Try limiting your number of requests on this website. To access page again please refresh.')
            next(err)
        } else {
            await rateLimiterIp.consume(user, 1);
            next()
        }
    } catch (e) {
        if (e.remainingPoints === 0) {
            const err = new ExpressError(429, 'Too many requests!!! Try limiting your number of requests on this website. To access page again please refresh.')
            next(err)
        } else {
            const err = new ExpressError(500, 'Internal Server Error while limiting requests. Try limiting your number of requests on this website.')
            next(err)
        }
    }
})

module.exports.limitDelete = catchAsync(async function (req, res, next) {
    try {
        const rateLimiterDeletes = new RateLimiterMongo(opts3);

        const userId = req.user._id
        const userPoint = await rateLimiterDeletes.get(userId)

        if (userId && userPoint && userPoint.consumedPoints > maxConsPointsDelete) {
            req.flash('error', 'Too many requests !!!')
            res.redirect('/')
        } else {
            await rateLimiterDeletes.consume(userId, 1);
            next()
        }
    } catch (e) {
        if (e.remainingPoints === 0) {
            req.flash('error', 'Too many requests !!!')
            res.redirect('/')
        } else {
            const err = new ExpressError(500, 'Internal Server Error while limiting requests. Try limit your number of requests on this website.')
            next(err)
        }
    }
})

module.exports.isSuspended = catchAsync(async function (req, res, next) {
    try {
        const rateLimiterComments = new RateLimiterMongo(opts);

        const userId = req.user._id
        const userPoint = await rateLimiterComments.get(userId)
        console.log('--------', userId)
        console.log(userPoint)

        if (userId && userPoint && userPoint.consumedPoints >= maxConsPointsComment) {
            res.status(200).send('TOO MANY REQUESTS')
        } else {
            res.status(200).send('YEP')
        }
    } catch (e) {
        if (e.remainingPoints === 0) {
            res.status(200).send('TOO MANY REQUESTS')
        } else {
            res.status(200).send('TOO MANY REQUESTS')
        }
    }
})