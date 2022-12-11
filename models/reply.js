const mongoose = require('mongoose');
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const reply = new Schema({
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
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reply', reply);