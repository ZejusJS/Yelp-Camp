const mongoose = require('mongoose');
const Review = require('./review');
const Comment = require('./comment');
const Reply = require('./reply');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const comment = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        minLength: 1,
        maxLength: 1000,
        required: true
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ],
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
    }
}, { timestamps: true });

comment.post('findOneAndDelete', async function (doc) {
    if (doc.replies.length) {
        await Reply.deleteMany({ _id: { $in: doc.replies } })
    }
    // if (doc.images.length) {
    //     doc.images.forEach(async function (m) {
    //         await cloudinary.uploader.destroy(m.filename);
    //     })
    // }
});

module.exports = mongoose.model('Comment', comment);