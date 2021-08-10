var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//comments new
router.get('/new', middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Please Login before!");
            console.log(error);
        } else{
            res.render('comments/new', {campground: campground});
        }
    })    
})


//coments create

router.post('/',middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(error);
            res.redirect('/campgrounds');
        } else{
            Comment.create(req.body.comments, function(err, comment){
                if(err){
                    console.log(err);
                    
                } else{
                    //add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully!");
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })

    
})

//Edit Comment 
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Something Went Wrong!");
            res.redirect("back");
        } else{
            
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        }
    })
})

//Update Comment Route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment edited successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete Comment Route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("error", "Deleted Comment!");
            res.redirect("/campgrounds/" + req.params.id)
        };
    })
})




module.exports = router;