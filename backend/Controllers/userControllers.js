const mongoose = require('mongoose');
const User = require('../models/User');
const { Validator } = require('node-input-validator');
const bcrypt = require('bcryptjs')

module.exports = {
    get_Users: async function (req, resp, next) {
        try {
            const startIndex = parseInt(req.body.startIndex) || 0;
            const limit = parseInt(req.body.limit) || 9;
            const sortDirection = req.body.sort === 'asc' ? 1 : -1;

            const users = await User.find()
                .sort({ createdAt: sortDirection })
                .skip(startIndex)
                .limit(limit);

            const usersWithoutPassword = users.map((user) => {
                const { password, ...rest } = user._doc;
                return rest;
            });

            const totalUsers = await User.countDocuments();

            const now = new Date();

            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            );
            const lastMonthUsers = await User.countDocuments({
                createdAt: { $gte: oneMonthAgo },
            });
            return resp.status(200).send({
                status: 'success',
                users: usersWithoutPassword,
                total_user_count: totalUsers,
                last_month_user_count: lastMonthUsers,
            });

        } catch (e) {
            return resp.status(200).send({
                status: 'error',
                message: e?.message ?? 'something went wrong'
            })
        }
    },
    update_user_details: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                id: 'required'
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: "Validation error",
                    val_msg: v.errors
                })
            }
            if (req.authId !== req.body.id) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'you are not allowed to update the user'
                })
            }
            let doc = {};
            if (req.body.username) {
                if (req.body.username.length < 7 || req.body.username.length > 20) {
                    return resp.status(400).send({
                        status: 'error',
                        message: 'Username must be between 7 and 20 characters'
                    })
                }
                if (req.body.username.includes(' ')) {
                    return resp.status(400).send({
                        status: 'error',
                        message: 'Username cannot contain spaces'
                    })
                }
                if (req.body.username !== req.body.username.toLowerCase()) {
                    return resp.status(400).send({
                        status: 'error',
                        message: 'Username must be lowercase'
                    })
                }
                if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                    return resp.status(400).send({
                        status: 'error',
                        message: 'Username can only contain letters and numbers'
                    })
                }
                doc.username = req.body.username
            }

            if (req.body.email) {
                doc.email = req.body.email
            }
            if (req.body.profilepic) {
                doc.profilepic = req.body.profilepic
            }
            if (req.body.password) {
                if (req.body.password.length >= 8 || req.body.password.length < 20) {

                    doc.password = await bcrypt.hash(req.body.password, 10);
                } else {

                    return resp.status(400).send({
                        status: 'error',
                        message: 'password should be between 8 to 20 characters'
                    })
                }
            }


            const data = await User.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.body.id) },
                { $set: doc },
                { new: true }
            ).select('-password');
            // const {password , ...rest} = data;
            // console.log(data)
            return resp.status(200).send({
                status: 'success',
                message: 'User details updated successfully.',
                user_data: data
            })

        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong!'
            })
        }
    },
    delete_user: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                id: 'required'
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const data = await User.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) })
            if ((!req.authData.isAdmin && req.authId.toString() !== req.body.id.toString()) || data.isAdmin) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'you are not authorized to delete this user'
                })
            }
            //one admin can not delete other admin also..only super admin has all access
            // await User.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(req.body.id) });
            return resp.status(200).send({
                status: 'success',
                message: 'User deleted successfully!'
            })
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong!'
            })
        }
    },
    get_User: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                id: 'required'
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: 'validation error',
                    error: v.errors
                })
            }
            const data = await User.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) })
            if (!data) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'user not found'
                })
            }
            return resp.status(200).send({
                status: 'success',
                message: 'user found!',
                data: data
            })
        } catch (e) {
            return resp.status(200).send({
                status: 'success',
                message: e?.message ?? 'something went wrong!'
            })
        }
    },
}