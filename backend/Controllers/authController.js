const express = require('express');
const {Validator} = require('node-input-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const siteHelper = require('../helpers/site_helpers')

module.exports ={
    register : async function (req , resp){
        try {

            const v = new Validator(req.body , {
                username :'required',
                email :'required|email',
                password: 'required|length:20,8',
                cpassword: 'required|same:password',
            })
            const matched = await v.check();
            if(!matched){
                return resp.status(404).send({
                    status :'val_error',
                    message: "Validation error", 
                    val_msg: v.errors 
                })
            }
            const user_details =  await User.findOne({username:req.body.username ,email:req.body.email})
            if(user_details){
                return resp.status(404).send({
                    status :'error',
                    message :'User already exits.'
                })
            }
            let hash_password =await bcrypt.hash(req.body.password ,10);
            let doc ={
                username: req.body.username,
                email: req.body.email,
                password: hash_password,
                profilepic: req.body.profilepic,
                isAdmin: req.body.isAdmin ,
            }
            // console.log(doc  , "doc")
            const data = await User.create(doc);
            return resp.status(200).send({
                status:"success",
                message:"User has been registered successfully!",
                data :data ?? []
            })
        } catch (e) {
            return resp.status(200).send({
                status :'error',
                message : e?.message ?? 'something went wrong.'
            })
        }
    },
    signin : async function (req , resp){
        try {

            const v = new Validator(req.body , {
                email :'required|email',
                password: 'required|length:20,8',
            })
            const matched = await v.check();
            if(!matched){
                return resp.status(404).send({
                    status :'val_error',
                    message: "Validation error", 
                    val_msg: v.errors 
                })
            }
            const user_details =  await User.findOne({email:req.body.email})
            if(!user_details){
                return resp.status(404).send({
                    status :'error',
                    message :'User not found.'
                })
            }
            let checked_password =await bcrypt.compare(req.body.password ,user_details.password);
            if(!checked_password){
                return resp.status(404).send({
                    status :'error',
                    message :'Wrong Credential.'
                })
            }

            let payload ={
                id : user_details._id,
                username : user_details.username,
                email :user_details.email,
                isAdmin : user_details.isAdmin,
                status :user_details.status
            }
            
            const token = await siteHelper.generateToken(payload);

            return resp.status(200).send({
                status:"success",
                message:"Loggedin successfully.!",
                token:token,
                user_data: user_details,
            })
        } catch (e) {
            return resp.status(200).send({
                status :'error',
                message : e?.message ?? 'something went wrong.'
            })
        }
    },
};