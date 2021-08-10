var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
        req.flash("error", "Please Login before!");
        res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "Please Login before!");
                    res.redirect("back");
                }
                
            }
        });
    } else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Please Login before!");
                res.redirect("back");
            } else {
                //does user own the campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "Please Login before!");
                    res.redirect("back");
                }
                
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = middlewareObj;

