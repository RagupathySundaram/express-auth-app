const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    console.log('req ##############', req.session.token);
    const secret = require('../config/keys').JWT_SECRET;
    console.log('req ##############', req.session.token);
    try {
        jwt.verify(req.session.token, secret, (err, decoded) => {
            console.log('decoded', decoded);
            console.log('err', err);
            if (err) {
                // req.session.error = 'Token Expired, Please login Again !!!';
                // req.flash('message', 'Token Expired, Please login Again !')
                res.redirect(`${req.baseUrl}/login`);
            } else {
                next();
            }
        });
    } catch (err) {
        console.log('errerrerrerr', err);
        res.status(400).send(err);
    }

}

router.post('/register', (request, response) => {
    const { name, email, password, password2 } = request.body;
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                // User Exists
                response.render('register', {
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    })
                    // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // set password to hashed
                        newUser.password = hash;

                        // Save the User                    
                        newUser.save()
                            .then(post => {
                                response.redirect('/user/login')
                            })
                            .catch(err => {
                                console.log('err', err);
                            });
                    })
                })
            }
        });

})


router.get('/', (request, response) => {
        const { baseUrl } = request;
        console.log('baseUrl', baseUrl);
        response.render('user', { baseUrl });
    }),

    router.get('/login', (request, response) => {
        const { baseUrl } = request;
        response.render('login', { baseUrl })
    }),

    router.get('/register', (request, response) => {
        const { baseUrl } = request;
        response.render('register', { baseUrl })
    }),

    router.get('/dashboard', validateToken, (request, response) => {
        const { baseUrl, session } = request;
        console.log('token', session.token);
        // response.render('dashboard', { baseUrl, users: ['Test'], token: 'XXXXXXXXXX' })
        User.find().then(users => {
                // console.log('users', users);
                response.render('dashboard', { baseUrl, users, token: session.token })
            })
            .catch(err => {
                console.log('err', err);
            })
    })

module.exports = router;