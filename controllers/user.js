const userModel = require('../model/user');
const OTP = require("../helper/common");
const mail = require('../helper/common');

module.exports = {
    saveuser: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err })
                }
                else if (res1) {
                    return res.status(200).send({ responseMesssage: "email already exists", responseCode: 409, error: err })
                }
                else {
                    let currtime = new Date()
                    currtime.setMinutes(currtime.getMinutes() + 3)
                    let time = new Date(currtime)
                    req.body.time = time
                    let otp = OTP.generateOTP()
                    req.body.otp = otp
                    userModel(req.body).save((err1, result) => {
                        if (err1) {
                            return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err1 })
                        }
                        else {
                            mail.mail(result.email, result.otp)
                            return res.status(200).send({ responseMessage: "User saved successfully to our Database", responseCode: 200, res: result })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },
    otpverify: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res2) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal Server Error", responseCode: 500, err: err })
                }
                else if (res2) {
                    let time = new Date()
                    time.setMinutes(time.getMinutes() + 0)
                    let OTP = req.body.OTP
                    console.log(res2.otp, res2.time, time, OTP)
                    if (OTP == res2.otp) {
                        if (time > res2.time) {
                            return res.status(500).send({ responseMessage: "OTP Expired" })
                        }
                        else {
                            return res.status(200).send({ responseMessage: "OTP verified" })
                        }
                    }
                    else {
                        return res.status(501).send({ responseMessage: "OTP Doesn't Match", responseCode: 501 })
                    }
                }
            })
        } catch (error) {
            return res.status(200).send({ responseMessage: "something went wrong", responseCode: 501, error: error })
        }
    },

    getuser: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err })
                }
                else if (res1) {
                    return res.status(200).send({ responseMessage: "Details", responseCode: 409, res1: res1 })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    updateuser: (req, res) => {
        try {
            userModel.findById({ _id: req.params.id }, (err, response) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 500, error: err })
                }
                else if (response) {
                    userModel.updateMany({ name: req.body.name, email: req.body.email, mobileNumber: req.body.mobileNumber }, (err1, res1) => {
                        console.log(res1)
                        if (err1) {
                            return res.status(500).send({ responseMessage: "internal server error", responseCode: 500, error: err1 })
                        }
                        else if (res1) {
                            userModel.findOne({ _id: req.params.id }, (err2, res2) => {
                                if (err2) {
                                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err2 })
                                }
                                else if (res2) {
                                    return res.status(200).send({ responseMessage: "Updated Successfully", responseCode: 409, res1: res2 })
                                }
                            })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },
    // updateuser: (req, res) => {
    //     try {
    //         userModel.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name, email: req.body.email, mobileNumber: req.body.mobileNumber }, (err, response) => {
    //             if (err) {
    //                 return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err })
    //             }
    //             else if (response) {
    //                 return res.status(200).send({ responseMessage: "User Updated Successfully", responseCode: 200, response: response })
    //             }
    //         })
    //     } catch (error) {
    //         return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
    //     }
    // },

    deleteuser: (req, res) => {
        try {
            userModel.findByIdAndDelete({ _id: req.params.id }, (err, result1) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err })
                }
                else if (result1) {
                    return res.status(200).send({ responseMessage: "Deleted Successfully", responseCode: 200, result1: result1 })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    getallusers: (req, res) => {
        try {
            userModel.find((err, result) => {
                if (err) {
                    return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err })
                }
                else if (result) {
                    return res.status(200).send({ responseMessage: "All Users Deatils: ", responseCode: 200, result: result })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    mail: (req, res) => {
        var transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
                user: process.env.DB_USER,
                pass: process.env.DB_PASSWORD
            }
        })

        var mailOptions = {
            from: process.env.DB_USER,
            to: req.body.email,
            subject: req.body.subject,
            text: req.body.text
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Email Send successfully', info.response)
            }
        })
    }
}
