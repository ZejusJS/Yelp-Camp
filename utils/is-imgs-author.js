const Campground = require('../models/campground');
const User = require('../models/user');

module.exports.isImgsAuthor = function (images, deleteImage) {
    for (let img of images) {
        console.log(img)
        if (img.filename === deleteImage) {
            return true
        }
    }
    return false
}
