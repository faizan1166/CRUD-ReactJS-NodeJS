const userModel = require('../model/user');
const OTP = require("../helper/common");
const mail = require('../helper/common');
const loginSchema = require("../model/LoginSchema");
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken");

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
                    loginSchema.findOne({id:req.body.id},(err,res)=>{
                        if(res){
                            userModel.uid=res._id
                        }
                    })
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
                    // loginSchema.findOne({id:req.body.id},(err,res)=>{
                    //     if(res){
                            const loginUid = req.body.id.toString(); 
                            let filteredUsers = result.filter(item => item.uid === loginUid);
                            console.log(filteredUsers,loginUid);
                        // }
                        return res.status(200).send({ responseMessage: "All Users Deatils: ", responseCode: 200, result: filteredUsers })

                    // })
                }
            })
        } catch (error) {
            return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
        }
    },

    register: async (req, res)  =>{
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
        }

        const oldUser = await loginSchema.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        encryptedPassword = await bcrypt.hash(password, 10);
    
        const user = await loginSchema.create({
          first_name,
          last_name,
          email: email.toLowerCase(), 
          password: encryptedPassword,
        });
   
        const token = jwt.sign(
          { user_id: loginSchema._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        loginSchema.token = token;
        res.status(201).json({ user, token });
      } catch (err) {
        console.log(err);
      }
    },

    login: async (req, res) => {
        try {
          const { email, password } = req.body;
      
          if (!(email && password)) {
            return res.status(400).send("All input is required");
          }
      
          const user = await loginSchema.findOne({ email });
      
          if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );
      
            res.status(200).json({ user, token }); // Send user and token in the response
          } else {
            res.status(400).send("Invalid Credentials"); // User not found or incorrect password
          }
        } catch (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
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