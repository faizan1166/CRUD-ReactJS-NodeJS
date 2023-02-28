const nodemailer = require("nodemailer");
require("dotenv").config()
module.exports = {
    generateOTP() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    },

    mail(email, otp) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.DB_USER,
                pass: process.env.DB_PASSWORD
            }
        });
        
        var mailOptions = {
            from: process.env.DB_USER,
            to: email,
            subject: "One Time Password",
            text: `your one time verification code is ${otp} your email ID ${email}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
