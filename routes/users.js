
// Importing required packages
const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require("../models/user");
const passport = require("passport");


// Server side validation

// registration form

router.get("/register", (req, res) => {
    res.render("users/register");
})

// add new user

router.post("/register", catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    res.send(registeredUser);

}));

// login form
router.get("/login", (req, res) => {
    res.render("users/login");
})

// login existing user

router.post("/login", passport.authenticate('local', { failureRedirect: "/login" }), catchAsync(async (req, res) => {

    res.redirect("/campgrounds");
}));


// // Delete existing review
// router.delete("/:reviewId", catchAsync(async (req, res) => {

// }));

module.exports = router;
