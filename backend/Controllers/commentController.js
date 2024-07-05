const { Validator } = require("node-input-validator")
const Comment = require("../models/Comment")

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
            if (req.body.userId !== req.authId) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to create a post'
                })
            }
            let doc = {
                postId: req.body.postId,
                userId: req.authId,
                content: req.body.content,
            }
            let comment = await Comment.create(doc)
            return resp.status(200).send({
                status: 'success',
                message: 'Comment created on post successfully!',
                data: comment
            })
        } catch (error) {
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
            if ((comment.userId !== req.authId) && !req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to edit this comment'
                })
            }
            let doc = {
                content: req.body.content,
            }
            const editedComment = await Comment.findByIdAndUpdate(
                req.body.comment_id,
                { $set: doc },
                { new: true }
            );
            return resp.status(200).send({
                status: 'success',
                message: 'Comment updated on this post successfully!',
                data: editedComment
            })
        } catch (error) {
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
            const comment = await Comment.findById(req.params.comment_id);
            if ((comment.userId !== req.authId) && !req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to delete this comment'
                })
            }
            await Comment.findByIdAndDelete(req.params.comment_id);
        } catch (error) {
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
            const comment = await Comment.findById(req.params.comment_id);
            if ((comment.userId !== req.authId) && !req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to delete this comment'
                })
            }
            if (!comment) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'Comment not found!'
                })
            }
        } catch (error) {
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

        } catch (error) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
    fetch_post_comments: async function (req, resp, next) {
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
            const comments = await Comment.findById({ postId: req.body.post_id }).sort({
                createdAt: -1,
            });
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
        } catch (error) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'Something went wrong!'
            })
        }
    },
}