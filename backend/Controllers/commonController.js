

const mongoose = require('mongoose');
const User = require('../models/User');
const { Validator } = require('node-input-validator');
const bcrypt = require('bcryptjs');
const site_helpers = require('../helpers/site_helpers');
const EmailHelper = require('../helpers/email_helper')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
module.exports = {
    forgetPassword: async function (req, resp, next) {
        try {
            const v = new Validator(req.body, {
                email: 'required|email',
            })
            const matched = await v.check();
            if (!matched) {
                return resp.status(404).send({
                    status: 'val_error',
                    message: "Validation error",
                    val_msg: v.errors
                })
            }
            const user_details = await User.findOne({ email: req.body.email })
            if (!user_details) {
                return resp.status(404).send({
                    status: 'error',
                    message: 'User not found.'
                })
            }

            let payload = {
                id: user_details._id,
            }
            const token = await site_helpers.generateToken(payload, '10m');
            let smtp_data = null;
            smtp_data = {
                smtp_name: 'System Smtp Credentials',
                host_address: SMTPHOST,
                username: SMTPUSERNAME,
                from_email_address: SMTPFROMMAIL,
                password: SMTPPASSWORD,
                method: SMTPMETHOD,
                port: SMTPPORT
            };
            let subject = "Reset Password";

            let msg_body = `<h3>Reset Your Password</h3>
            <p>Click on the following link to reset your password:</p>
            <a href="${APP_URL}/reset-password/${token}">${APP_URL}/reset-password/${token}</a>
            <p>The link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`;

            // let msg_body =`${APP_URL}/reset-password/${token}`;
            // console.log(user_details?.email)
            let sendemail_resetToken = await EmailHelper.send_email(smtp_data, user_details?.email, subject, msg_body);
            // console.log(sendemail_resetToken,'email response')
            if (sendemail_resetToken) {
                return resp.status(200).send({
                    status: 'success',
                    message: 'Reset password link sent to email.'
                })
            } else {
                return resp.status(400).send({
                    status: 'error',
                    message: 'Email not send'
                })
            }
            // let hash_password = await bcrypt.hash(req.body.password, 10);
        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.'
            })
        }
    },
    resetPassword: async function (req, resp, next) {
        try {
            const token = req.body.token;
            // console.log(token)
            const decodedData = await site_helpers.decryptToken(token);
            // console.log(decodedData.status,"docodeData")
            // If the token is invalid, return an error
            if (decodedData.status === 'false') {
                return resp.status(401).send({
                    status: 'error',
                    message: "Please generate new link , it has expired! "
                });
            }

            // find the user with the id from the token
            const user = await User.findOne({ _id: new mongoose.Types.ObjectId(decodedData.id) });
            if (!user) {
                return resp.status(401).send({
                    status: 'error',
                    message: "no user found"
                });
            }
            // Hash the new password
            // const salt = await bcrypt.genSalt(10);
            let checked_password = await bcrypt.compare(req.body.password, user.password);
            if (checked_password) {
                return resp.status(401).send({
                    status: 'error',
                    message: "please don't repeat same credential!"
                })
            }
            let newPassword = await bcrypt.hash(req.body.password, 10);

            // Update user's password, clear reset token and expiration time
            user.password = newPassword;
            await user.save();

            // Send success response
            return resp.status(200).send({
                status: 'success',
                message: "Credential updated successfully!"
            });

        } catch (e) {
            return resp.status(500).send({
                status: 'error',
                message: e?.message ?? 'something went wrong.'
            })
        }
    },
    create_stripe_payment_checkout_session: async function (req, resp, next) {
        try {
            const { product } = req.body;
            // console.log(product,'pri')
            const lineItems = {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: 1,
            };
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [lineItems],
                phone_number_collection: {
                    enabled: true,
                },
                mode: 'payment',
                allow_promotion_codes: true,
                success_url: `${APP_URL}/success`,
                cancel_url: `${APP_URL}/cancel`,
            });
            // console.log(session, "sessoin")
            return resp.send({ id: session.id, message: 'payment session id created.' });
        } catch (error) {
            // console.log(error, "<<err");
            return resp.status(500).send({
                status: 'error',
                message: error?.message ?? 'something went wrong.'
            })
        }
    },
  


}