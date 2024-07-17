const { Validator } = require("node-input-validator")
const Comment = require("../models/Comment")
var mongoose = require('mongoose')
const Post = require("../models/Post")

module.exports = {
    create_comment: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                postId: "required",
                content: "required",
            })
            const matched = await v.check()
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            // if (req.body.userId !== req.authId) {
            if (!req.authId) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to comment on this post'
                })
            }
            let doc = {
                postId: new mongoose.Types.ObjectId(req.body.postId),
                userId: new mongoose.Types.ObjectId(req.authId),
                content: req.body.content,
                likes : []
            }
            let comment = await Comment.create(doc)
            return resp.status(200).send({
                status: 'success',
                message: 'Comment created on post successfully!',
                comment: comment
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    edit_comment: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                comment_id: "required",
                content: "required",
            })
            const matched = await v.check()
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const comment = await Comment.findById(req.body.comment_id);
            if (!comment) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'Comment not found'
                })
            }
            //which user made that comment & admin can edit that .
            if (comment.userId !== req.authId) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to edit this comment'
                })
            }
            let doc = {
                content: req.body.content,
            }
            const editedComment = await Comment.findByIdAndUpdate(
                {_id : new mongoose.Types.ObjectId( req.body.comment_id)},
                { $set: doc },
                { new: true }
            );
            return resp.status(200).send({
                status: 'success',
                message: 'Comment edited successfully!',
                data: editedComment
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    delete_comment: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                comment_id: "required",
            })
            const matched = await v.check()
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const comment = await Comment.findById(req.body.comment_id);
            if ((comment.userId === req.authId) || req.authData.isAdmin) {
                await Comment.findByIdAndDelete({_id: new mongoose.Types.ObjectId(req.body.comment_id)});
                return resp.status(200).send({
                    status:'success',
                    message :'comment deleted successfully!'
                })
            }
           
            return resp.status(403).send({
                status: 'error',
                message: 'You are not allowed to delete this comment'
            })
        } catch (e) {
            console.log(e)
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    liked_comment: async function (req, resp, next) {
        //functionality need to be complte(new feature--> multi concurrent comment support)
        try {
            const v = new Validator(req.body, {
                comment_id: "required",
            })
            const matched = await v.check()
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const comment = await Comment.findOne({_id: new mongoose.Types.ObjectId(req.body.comment_id)});
            let doc = {
                userId: new mongoose.Types.ObjectId(req.authId),
                username : req.authData.username ?? ''
            }
            // if(comment.likedUsers.includes(doc.userId)){
            // console.log(doc , "<<comment");
            if (!req.authId) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed'
                })
            }
            if (!comment) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'Comment not found!'
                })
            }
            // const userIndex = comment.likes.findIndex(like => like.userId === req.authId);
            const userIndex = comment.likes.findIndex(like => like.userId.toString() === req.authId.toString());
            // console.log(userIndex,"ins")

            if (userIndex === -1) {
              // User has not liked the comment
              comment.numberOfLikes += 1;
              comment.likes.push(doc);
            } else {
              // User has already liked the commen
              
              comment.numberOfLikes -= 1;
              comment.likes.splice(userIndex, 1);
            }
            
            // Save the updated comment
            if(comment){

                await comment.save();
            }
            return  resp.status(200).send({
                status: 'success',
                message: 'Comment liked successfully',
                comment: comment
            })
        } catch (e) {
            // console.log(e);
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    fetch_comments: async function (req, resp, next) {
        try {
            if (!req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to get all comments'
                })
            }
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 9;
            const sortDirection = req.query.sort === 'desc' ? -1 : 1;
            const comments = await Comment.find()
                .sort({ createdAt: sortDirection })
                .skip(startIndex)
                .limit(limit);
            
            const totalComments = await Comment.countDocuments();

            let now = new Date();
            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            )

            const lastMonthComments = await Comment.countDocuments({
                createdAt: { $gte: oneMonthAgo },
            })

            return resp.status(200).send({
                status: 'success',
                comments,
                lastMonthComments,
                totalComments,
            })

        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    fetch_post_comments: async function (req, resp, next) {
        // console.log('herte');
        try {
            const v = new Validator(req.body, {
                post_id: "required",
            })
            const matched = await v.check()
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const comments = await Comment.find({ postId: new mongoose.Types.ObjectId(req.body.post_id) }).sort({
                createdAt: -1,
            });
            // console.log(comments,"<<")
            if (!comments) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'Comment on this post not found'
                })
            }
            return resp.status(200).send({
                status: 'success',
                message :'comments on this post fetched successfully',
                data : comments
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
}