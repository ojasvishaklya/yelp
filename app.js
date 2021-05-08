
// Importing required packages

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const app = express();
const Campground = require("./models/campground")
const User = require("./models/user")
const Review = require("./models/review")
const ejsMate = require("ejs-mate");
const session = require("express-session");
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const ExpressError = require('./utils/ExpressError');


// Setting basic app settings

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static("public"));


console.log("-----------------------------------------------");

// Connecting express with mongoDB using mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("connected to MongoDB");
    }).catch((e) => {
        console.error(e);
    })

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

// serializing to store the user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Home route    
app.get("/", (req, res) => {
    res.send("Yelp Camp...");
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    console.log("*******************************************");
    console.log(err.statusCode);
    console.log(err.message);
    console.log("*******************************************");

    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { error: err })
})


// App listening to port 9000
app.listen(9000, () => {
    console.log("listening to 9000");
})


