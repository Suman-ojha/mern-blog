const { Validator } = require("node-input-validator");
var mongoose = require('mongoose');
const Post = require("../models/Post");
module.exports = {
    create_post: async function (req, resp, next) {
        try {

            const v = new Validator(req.body, {
                title: 'required',
                content: 'required'
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            if (!req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to create a post'
                })
            }

            const slug = req.body.title
                .split(' ')
                .join('-')
                .toLowerCase()
                .replace(/[^a-zA-Z0-9-]/g, '');

            let doc = {
                userId: new mongoose.Types.ObjectId(req.authId),
                title: req.body.title,
                content: req.body.content,
                slug: slug,
            }
            if (req.body.image) {
                doc.image = req.body.image
            }
            if (req.body.category) {
                doc.category = req.body.category
            }

            const postData = await Post.create(doc);
            return resp.status(200).send({
                status: 'success',
                message: 'post created successfully!',
                data: postData
            })
        } catch (e) {
            console.log(e , "<<err");
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.!'
            })
        }
    },
    delete_post: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                id: 'required',
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            if (!req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to delete a post'
                })
            }
            // console.log(req.body);
            await Post.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(req.body.id) })
            return resp.status(200).send({
                status: 'success',
                message: 'Post deleted successfully!'
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.!'
            })
        }
    },
    update_post: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                id: 'required',
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            if (!req.authData.isAdmin) {
                return resp.status(403).send({
                    status: 'error',
                    message: 'You are not allowed to update a post'
                })
            }
            let postDetails = await Post.findOne({
                _id: new mongoose.Types.ObjectId(req.body.id)
            })
            let doc = {
                title: req.body.title ?? postDetails.title,
                content: req.body.content ?? postDetails.content,
                category: req.body.category ?? postDetails.category,
                image: req.body.image ?? postDetails.image,
            };

            const post = await Post.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.body.id) },
                { $set: doc },
                { new: true }
            )
            return resp.status(200).send({
                status: 'success',
                message: 'Post updated successfully!',
                data: post
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.!'
            })
        }
    },
    get_posts: async function (req, resp, next) {
        try {
           
            const startIndex = parseInt(req.body.startIndex) || 0;
            const limit = parseInt(req.body.limit) || 9;
            const sortDirection = req.body.order === 'asc' ? 1 : -1;
            // console.log(sortDirection)
            // console.log(req.body);
            const posts = await Post.find({
                ...(req.body.userId && { userId: new mongoose.Types.ObjectId(req.body.userId) }),//condition check using sprad operator
                ...(req.body.category && { category: req.body.category }),
                ...(req.body.slug && { slug: req.body.slug }),
                ...(req.body.postId && { _id: new mongoose.Types.ObjectId(req.body.postId) }),
                ...(req.body.searchKey && {
                    $or: [
                        { title: { $regex: req.body.searchKey, $options: 'i' } },
                        { content: { $regex: req.body.searchKey, $options: 'i' } },
                    ],
                }),
            })
                .sort({ updatedAt: sortDirection })
                .skip(startIndex)
                .limit(limit);
            // console.log(posts , "<post")
            const totalPosts = await Post.countDocuments();

            const now = new Date();

            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            );

            const lastMonthPosts = await Post.countDocuments({
                createdAt: { $gte: oneMonthAgo },
            });
            return resp.status(200).send({
                status: 'success',
                message: 'Posts fetched successfully!',
                posts,
                totalPosts,
                lastMonthPosts,
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.!'
            })
        }
    }
}