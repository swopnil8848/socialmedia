// sendEmail.js

const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "0298f9a8275b73",
          pass: "9d1f041e38a3ef"
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// const nodemailer = require('nodemailer');

// // sendEmail.js

// exports.sendEmail = async (options) => {
//     let testAccount = await nodemailer.createTestAccount();

//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 465,
//         secure: false,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass,
//         },
//     });

//     let message = {
//         from: '"Fred Foo 👻" <foo@example.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: "<b>change password.</b>",
//     };

//     try {
//         const info = await transporter.sendMail(message);
//         return {
//             msg: "You should receive an email",
//             info: info.messageId,
//             preview: nodemailer.getTestMessageUrl(info),
//         };
//     } catch (error) {
//         throw error;
//     }
// };
