const mongoose = require('mongoose');
const Review = require('./review');
const Comment = require('./comment');
const Reply = require('./reply');
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    }],
    price: {
        type: Number,
        required: true,
        min: 0,
        minLength: 1
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 1000
    },
    geometry: {
        type: {
            type: "String",
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: 'String',
        minLength: 4,
        maxLength: 60,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true });

CampGroundSchema.plugin(mongoosePaginate);



const { cloudinary } = require('../cloudinary/index')
const { storageCampImg } = require('../cloudinary/index')
const multer = require('multer') // multer je middleware pro files
const uploadCampImg = multer({ storage: storageCampImg, limits: { fileSize: 10000000, files: 7 } }).array('image') //jak se campgrounds images ukládají

CampGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc.reviews && doc.reviews.length) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
    if (doc.images && doc.images.length) {
        doc.images.forEach(async function (m) {
            await cloudinary.uploader.destroy(m.filename);
        })
    }
    if (doc.comments && doc.comments.length) {
        await Comment.deleteMany({ _id: { $in: doc.comments } })
    }
});

// vitruals:
CampGroundSchema.path('images').schema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload/', '/upload/w_200/');
});

CampGroundSchema.virtual('avgRating').get(function () {
    let ratingSum = 0
    const reviews = this.reviews
    reviews.forEach(r => ratingSum += r.rating)
    return ratingSum ? ratingSum / reviews.length : 0;
})
//

module.exports = mongoose.model('Campground', CampGroundSchema);