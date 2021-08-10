var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    }

    Campground.create({name: name,price: price, image: image, description: description, author: author} , function(err, newlyCreated){
        if(err)
         {console.log(err);
         } else{

             console.log(newlyCreated);
             res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCampground")
});

//SHOW - SHOWS MORE INFO ABOUT CAMPGROUNDS!

router.get("/:id", function(req, res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else{
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
    
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    
    });
});


//update campoground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(error);
            req.flash("error", "Please Login before!");
            res.redirect('/campground');
        } else{
            req.flash("success", "Campground added successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


//DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            req.flash("error", "Deleted Campground!");
            res.redirect('/campgrounds');
        }
    })
})





module.exports = router;