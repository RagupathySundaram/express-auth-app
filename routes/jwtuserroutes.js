const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/logout', (request, response) => {
    console.log('Logout #############', request.baseUrl);
    if (request.session) {
        // delete session object
        request.session.destroy((err) => {
          if(err) {
            next(err);
          } else {
            response.redirect(`${request.baseUrl}/login`);
          }
        });
      }

})

router.post('/login', (request, response) => {
    console.log('login JWT');
    const { email, password } = request.body;
    if (email, password) {
        User.findOne({ email }).then((user) => {
            if (!user) {
                response.status(400).json({ error: 'User/Email  not found in DB' });
            }
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = { user: user.name };
                    const options = { expiresIn: '30s', issuer: 'https://scotch.io' };
                    const secret = require('../config/keys').JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                    request.session.token = token;
                    request.session.loggedInUser = user;
                    // response.status(200).send(token);
                    const { baseUrl } = request;
                    response.redirect(`${baseUrl}/dashboard`);
                    return false;
                } else {
                    console.log('Unable to Login !');
                    response.send('Unable to Login ! :) ');
                }
            });
        });
    }
    // response.send('Unable to Login ! :) Input Error ');

})

module.exports = router;