var os = require("os");

module.exports.isFromCampgroundsIndex = function (req, res, next) {
    console.log('OS name.....', os.hostname()) // jméno zařízení (hostu) 
    console.log('req.hostname.....', req.hostname) // jméno hostname (nyní je to localhost)
    console.log('Referer.....', req.headers.referer) // adresa ze které se requstuje (undefined pokud to není z js, který je na stránce)
    console.log('req.user.....', req.user)
    // console.log(req)
    const accept = JSON.stringify(req.headers.accept)
    if (req.headers.referer.match(/(https:\/\/yelp-camp-a1dk\.onrender\.com\/campgrounds)/g)
        || req.hostname === "localhost" && req.headers.referer.match(/(http:\/\/localhost:3000\/campgrounds)/g)) { // || req.hostname === "localhost" && req.headers.referer === "http://localhost:3000/campgrounds"
        if (accept.match(/(application\/json)/g)) {
            return next()
        } else {
            res.redirect('/campgrounds')
        }
    } else {
        res.redirect('/campgrounds')
    }
}

module.exports.isFromCampgroundsIndexInRoute = function (req, res) {
    console.log('OS name.....', os.hostname()) // jméno zařízení (hostu) 
    console.log('req.hostname.....', req.hostname) // jméno hostname (nyní je to localhost)
    console.log('Referer.....', req.headers.referer) // adresa ze které se requstuje (undefined pokud to není z js, který je na stránce)
    console.log('req.user.....', req.user)
    // console.log(req)
    const accept = JSON.stringify(req.headers.accept)
    if (req.headers.referer.match(/(https:\/\/yelp-camp-a1dk\.onrender\.com\/campgrounds)/g)
        || req.hostname === "localhost" && req.headers.referer.match(/(http:\/\/localhost:3000\/campgrounds)/g)) { // || req.hostname === "localhost" && req.headers.referer === "http://localhost:3000/campgrounds"
        return true
    } else {
        return false
    }
}

module.exports.isFromUserRoute = function (req, res) {
    console.log('OS name.....', os.hostname()) // jméno zařízení (hostu) 
    console.log('req.hostname.....', req.hostname) // jméno hostname (nyní je to localhost)
    console.log('Referer.....', req.headers.referer) // adresa ze které se requstuje (undefined pokud to není z js, který je na stránce)
    console.log('req.user.....', req.user)
    // console.log(req)
    const accept = JSON.stringify(req.headers.accept)
    console.log(accept)
    if (req.headers.referer.match(/(https:\/\/yelp-camp-a1dk\.onrender\.com\/user)/g)
        || req.hostname === "localhost" && req.headers.referer.match(/(http:\/\/localhost:3000\/user)/g)) { // || req.hostname === "localhost" && req.headers.referer === "http://localhost:3000/campgrounds"
        if (accept.match(/(application\/json)/g)) {
            return next()
        } else {
            res.redirect('/campgrounds')
        }
    } else {
        res.redirect('/campgrounds')
    }
}