const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
// const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');

// Mongo DB Connection
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log(`Mongo DB Connected`))
    .catch(err => console.log(`Error in Connection: ${err}`));

const app = express();
const {
    PORT = 3000,
        SESSION_TIMEOUT = 5000,
        NODE_ENV = 'dev',
        SESSION_NAME = 'SID',
        SESSION_SECRET = 'SECRETEKEY'

} = process.env;

const IN_PROD = NODE_ENV === 'prod'

// EJS Template Engine
app.set('views', __dirname + '/public')
    // app.use(express.static(__dirname + '../public'));
    // app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
    // app.render('index', (error, html) => {
    //     console.log(html);
    // });

// Morgan Logger
app.use(morgan('dev'));

// Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Express Session
app.use(session({
    secret: SESSION_SECRET,
    resave: false, // default true
    saveUninitialized: false, // default true
    name: SESSION_NAME,
    cookie: {
        sameSite: true,
        maxAge: SESSION_TIMEOUT,
        secure: IN_PROD // default is true
    }
}))

// Connect Flash
// app.use(flash())

// MIDDLEWARE FUNCTION 
// TYPES # App level, Router level, err handling, built in , thirdparty 
// app.use((req, res, next) => {
//     console.log('Req Session', req.session);
//     const error = new Error('Not Found ! :(');
//     error.status = 404;
//     next(error);
// })

// Routes
app.use('/apps', require('./routes/routes'));

app.use('/user', require('./routes/templateRoutes'), require('./routes/userRoutes'));
app.use('/jwtuser', require('./routes/templateRoutes'), require('./routes/jwtuserroutes'));
app.use('/oauth2user', require('./routes/templateRoutes'), require('./routes/oauth2userroutes'));


app.get('/', (request, response) => {
    // console.log('request', request);
    // response.send('Hello World Got GET METHOD');
    // response.sendFile(path.join(__dirname + '/public/index.html'));
    response.render('index')
})

let upload = multer({ dest: 'uploads/', mimetype: 'png' }).array('avatar', 1);

app.post('/:id', (request, response) => {
    console.log('POST request body: \n', request.body);
    console.log('POST request params:', request.params);
    console.log('POST request query:', request.query);
    console.log('POST request headers:', request.headers);
    response.send('Hello World Got POST METHOD == REQUEST BODY DATA' + JSON.stringify(request.body));
})

app.post('/fileupload', (request, response) => {
    console.log('request.files', request.file);
    upload(request, response, (error) => {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log('error MulterErro: ', error.message);
            response.json(`OOPS Error Occured While Uploading ! ${error.message}`);
        } else if (error) {
            // An unknown error occurred when uploading.
            console.log('error unknown: ', error);
            response.json(`OOPS Error Occured While Uploading ! ${error}`);
        } else {
            console.log('SUCCESSFULLY UPLOADED !!!!');
            response.json('SUCCESSFULLY UPLOADED !!!!!');
        }
    })

})

app.put('/', (request, response) => {
    // console.log('request', request);
    response.send('Hello World Got PUT METHOD');
})

app.delete('/', (request, response) => {
    // console.log('request', request);
    response.send('Hello World Got DELETE METHOD');
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})

// app.use(express.static('./public'));
// app.use('/static', express.static('public'));
// console.log('__dirname', __dirname);
// app.use('/static', express.static(path.join(__dirname), 'public'));



// Error handling middleware 
app.use((error, request, response, next) => {
    console.log('Error', error);
    response.status(500).send(' 500 -- Something went Wrong !!!')
    response.status(404).send('404 -- Sorry Cant Find the PATH')
    response.json({
        error: { message: error.message }
    })
})