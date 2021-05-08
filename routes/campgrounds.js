
// Importing required packages
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require("../models/review");
const Joi = require("joi");
const {isLoggedIn}=require("../middleware")



// Server side validation

const validateCampground = function (req, re, next) {

    const campgroundSchema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    })

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        let msg = "";

        for (let err of error.details) {
            msg += err.message + "\n";
        }
        throw new ExpressError(msg, 400);
    } else next();

}


// show all campgrounds
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/campgrounds", { campgrounds });
}));

// add new campgrounds
router.get("/new",isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body);
    await campground.save();
    req.flash("success","Successfully made a new campground");

    res.redirect(`/campgrounds/${campground._id}`);
}));



// show detail of a particular campground
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/details", { campground });
}));

// update existing campground
router.get("/:id/update", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/update", { campground });

}));

router.put("/:id", validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body);
    req.flash('success','Successfully updated the campground');
   
    console.log("from camp.js");
    console.log(req.flash("success"));

    res.redirect(`/campgrounds/${id}`)
}));

// delete a campground
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    for (let rid of camp.reviews) {
        await Review.findByIdAndDelete(rid);
    }
    await Campground.findByIdAndDelete(id);

    res.redirect("/campgrounds");
}));

module.exports = router;
