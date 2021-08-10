var express = require('express');
var app = express();
const port = 8080;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
app.locals.moment = require('moment');
var passport = require('passport');
LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
User = require('./models/user');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');


mongoose.connect("mongodb://localhost:27017/letscamp",{useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));
// seedDB(); //seeds the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Straight",
    resave: false,
    saveuninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(('/'), indexRoutes);
app.use(('/campgrounds') ,campgroundRoutes);
app.use(('/campgrounds/:id/comments')  ,commentRoutes);



// Campground.create(
//     {
//         name: "Niagra Falls",
//         image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/e3/a0/6a.jpg",
//         description: "This is the most beautiful waterfall you'll ever see.!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("new campsite!");
//             console.log(campground);
//         }
//     });





app.listen(port, function(){
    console.log("Lets Go Camping <3")
});