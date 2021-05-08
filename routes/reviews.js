
// Importing required packages
const express = require("express");
const router=express.Router({mergeParams:true});
const Review = require("../models/review")
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Joi = require("joi");


// Server side validation

const validateReview = function (req, re, next) {

    const reviewSchema = Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    })


    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = "";

        for (let err of error.details) {
            msg += err.message + "\n";
        }
        throw new ExpressError(msg, 400);
    } else next();

}

// add new review
router.post("/", validateReview, catchAsync(async (req, res) => {
    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);

}));

// Delete existing review
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
