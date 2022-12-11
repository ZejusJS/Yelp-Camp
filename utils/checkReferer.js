var os = require("os");

module.exports.isFromCampgroundsIndex = function (req, res, next) {
    console.log('OS name.....', os.hostname()) // jméno zařízení (hostu) 
    console.log('req.hostname.....', req.hostname) // jméno hostname (nyní je to localhost)
    console.log('Referer.....', req.headers.referer) // adresa ze které se requstuje (undefined pokud to není z js, který je na stránce)
    console.log('req.user.....', req.user)
    const accept = JSON.stringify(req.headers.accept)
    // if (req.headers.referer === "http://localhost:3000/campgrounds" || 'http://192.168.1.14:3000/campgrounds') {
    if (accept.match(/(application\/json)/g)) {
        return next()
    } else {
        res.redirect('/campgrounds')
    }
}