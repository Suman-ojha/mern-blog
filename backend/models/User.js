const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum :["active" , "inactive" , "delete"],
        default :'active'
    },
    profilepic: {
        type: String,
        default:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

userSchema.plugin(aggregatePaginate);
const User = mongoose.model('user', userSchema);

module.exports = User;
