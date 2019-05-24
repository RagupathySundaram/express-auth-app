const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');

// TO DISPLAY HTML FORM (mailform.ejs)
router.get('/emailform', (request, response) => {
    response.render('mailform')
})

router.post('/sendemail', (request, response) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'xxxxx@gmail.com',
            pass: 'xxxxx'
        }
    });

    let mailOptions = {
        from: 'ragupathys26@gmail.com',
        to: request.body.to,
        subject: request.body.subject,
        text: request.body.body,
        html: '<h1>Node JS Email Nodemailer</h1>'
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Unable to push email', error);
        }
        response.render('index');
    })
})

module.exports = router;