'use strict';
const nodemailer = require('nodemailer');
let transporter;

exports.login = (host, port, user, pass) => {
    let secure = port == 465; // port为465 设为true

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        }
    });
};

exports.send = (user, to, tit, content, cb) => {
    // setup email data with unicode symbols
    let mailOptions = {
        from: user, // sender address
        to: to, // list of receivers
        subject: tit, // Subject line
        html: content,
    };
    return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            console.log(info);
            cb(info);
            resolve(info);
        });
    });
};