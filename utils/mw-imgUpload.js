const path = require('path');
// ukládání souborů
const { storageCampImg } = require('../cloudinary/index')

const multer = require('multer') // multer je middleware pro files
const uploadCampImg = multer({
    storage: storageCampImg,
    limits: { fileSize: 10000000, files: 7 },
    fileFilter: function (req, file, cb) {
        var typeArray = file.mimetype.split('/');
        var fileType = typeArray[1];
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
            cb(null, true);
        } else {
            req.flash('error', 'Only image formats ".png", ".jpg" and ".jpeg" are allowed. Disallowed images have been deleted.');
            cb(null, false);
        }
    }
}).array('image') //jak se campgrounds images ukládají

// middle ware pro ukládání camp images s error callback
const mwUploadCampImg = (req, res, next) => {
    uploadCampImg(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // error od multer
            if (err.message === "File too large") {
                err.message = "Please upload images only with size less than 10MB"
            }
            req.flash('error', `${err.message}`);
            res.redirect('/campgrounds');
        } else if (err) {
            // error který multer neočekává
            const sliceUrl = req.originalUrl.substring(0, req.originalUrl.indexOf('?'));
            req.flash('error', `${err.message}`);
            res.redirect(sliceUrl || '/campgrounds');
        } else {
            // Everything went fine.
            next();
        }
    });
}
//

module.exports = {
    mwUploadCampImg
}