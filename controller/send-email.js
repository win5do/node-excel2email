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

exports.send = (user, to, tit, content) => {
    // setup email data with unicode symbols
    let mailOptions = {
        from: user, // sender address
        to: to, // list of receivers
        subject: tit, // Subject line
        html: content,
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};