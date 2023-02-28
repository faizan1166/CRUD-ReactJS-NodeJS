const { Types, Schema, model } = require('mongoose')

const user = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    time: {
        type: Number
    },
    otp: {
        type: Number
    }

})

module.exports = model('user', user)
