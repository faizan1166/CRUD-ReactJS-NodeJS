const { Types, Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    mobileNumber: { type: Number },
    time: { type: Number },
    otp: { type: Number },
    uid:{type:String}
});

// const loginSchema = new Schema({
//     first_name: { type: String, default: null },
//     last_name: { type: String, default: null },
//     email: { type: String, unique: true },
//     password: { type: String },
//     token: { type: String },
// });

module.exports = model('User', userSchema); 
// module.exports = model('LoginSchema', loginSchema); 
