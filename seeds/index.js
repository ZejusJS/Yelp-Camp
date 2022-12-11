const port = 3000;
const mongoose = require('mongoose');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const pickFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const cemp = new Campground({
            author: '637a1b952974e78867d6f321',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            title: `${pickFromArray(descriptors)} ${pickFromArray(places)}`,
            price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur eaque minus soluta voluptate aperiam officia, officiis doloribus? Facere illo nulla tenetur, accusamus quis est ipsum animi fugit! Error, ducimus!',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'somefielname'
                },
                {
                    url: 'https://images.unsplash.com/photo-1618526640189-81726d5dd707?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'somefielname'
                }
            ]
        });
        await cemp.save();
    };
}

seedDB().then(() =>
    mongoose.connection.close()
);