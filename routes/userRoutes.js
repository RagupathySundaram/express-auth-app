const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');

const redirectLogin = (req, res, next) => {
    console.log('**********', req.session.id);
    if (!req.session.id) {
        res.redirect(`${request.baseUrl}/login`);
    } else {
        next()
    }
}

const redirectHome = (req, res, next) => {
    console.log('forwardAuthenticated', req.session.id);
    if (!req.session.id) {
        next();
    }
    res.redirect(`${request.baseUrl}/login`);
}

router.post('/logout', (request, response) => {
    console.log('Logout #############', request.session);
    request.session.destroy((err) => {
        if (err) res.redirect('/dashboard');
        response.clearCookie(process.env.SESSION_NAME);
        response.redirect(`${request.baseUrl}/login`);
    })
})


router.post('/login', (request, response) => {
    console.log('Login SESSSIOn ');
    const { email, password } = request.body;
    if (email, password) {
        User.findOne({ email }).then((user) => {
            if (!user) {
                response.status(400).json({ error: 'User/Email  not found in DB' });
            }
            bcrypt.compare(password, user.password).then(isMatch => {
                const userExist = (email === user.email && isMatch);
                if (userExist) {
                    request.session.id = user._id;
                    response.redirect(`${request.baseUrl}/dashboard`);
                } else {
                    console.log('Unable to Login !');
                    response.send('Unable to Login ! :) ')
                }
            });
        });
    }
    response.send('Unable to Login ! :) Input Error ');

})

module.exports = router;