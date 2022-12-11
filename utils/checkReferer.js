var os = require("os");

module.exports.isFromCampgroundsIndex = function (req, res, next) {
    console.log('OS name.....', os.hostname()) // jméno zařízení (hostu) 
    console.log('req.hostname.....', req.hostname) // jméno hostname (nyní je to localhost)
    console.log('Referer.....', req.headers.referer) // adresa ze které se requstuje (undefined pokud to není z js, který je na stránce)
    console.log('req.user.....', req.user)
    const accept = JSON.stringify(req.headers.accept)
    if (req.headers.referer.match(/(https:\/\/yelp-camp-a1dk\.onrender\.com\/campgrounds(?=\?search|\?stype))/g)
        || req.headers.referer.match(/(https:\/\/yelp-camp-a1dk\.onrender\.com\/campgrounds(?!\/|\?))/g)
        || req.hostname === "localhost" && req.headers.referer.match(/(http:\/\/localhost:3000\/campgrounds(?=\?search|\?stype))/g)
        || req.hostname === "localhost" && req.headers.referer.match(/(http:\/\/localhost:3000\/campgrounds(?!\/|\?))/g)) { // || req.hostname === "localhost" && req.headers.referer === "http://localhost:3000/campgrounds"
        if (accept.match(/(application\/json)/g)) {
            return next()
        } else {
            res.redirect('/campgrounds')
        }
    } else {
        res.redirect('/campgrounds')
    }
}