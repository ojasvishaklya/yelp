const mongoose = require("mongoose");

// To avoid repeatedly writting mongoose.Schema
const Schema = mongoose.Schema;


const CampgroundSchema = Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});





// Returning the campground collection to be saved in yelp-camp database
module.exports = mongoose.model('Campground', CampgroundSchema);