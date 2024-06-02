const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            ref:'users'
        },
        otp_for: {
            type: String,
            enum: ["email", "mobile"],
            required: true,
        },
        otp: {
            type: String,
            required: true,
            expires: "5m",
            index: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "deleted"],
            required: true,
            default: "active",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Otp = mongoose.model("otp", otpSchema);
module.exports = Otp;
