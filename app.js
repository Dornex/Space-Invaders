const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');

const uri = "mongodb+srv://dornex:wOZUjiirZmojS814@website-db-gl5ab.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        server: {
            socketOptions: {
                keepAlive:300000,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive:300000,
                connectTimeoutMS: 30000
            }
        }
    });
const app = express();

client.connect(err => {
    if(err) return console.log(err);
    let db = client.db('website-db');


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(session({
        secret: 'dog',
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000000000,
            secure: false}
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/public')));

    app.get('/', (req, res) => {
        if(req.session.sessionID !== undefined)
            res.render('index', {loggedIn: true});
        else res.render('index', {loggedIn: false});
    });

    app.post('/submitScore', async (req, res) => {
        console.log(`Got score ${req.body.score} from ${req.session.sessionID}`);
        let user = await db.collection('users').find({sessionID: req.session.sessionID}).toArray();
        let score = req.body.score;
        if(user.length > 0) {
            let userScore = user[0].score;
            if(req.body.score > userScore) {
                db.collection('users').updateOne({sessionID: req.session.sessionID}, {$set: {score: req.body.score}});
            }
        }
        res.send('OK');
    });

    app.get('/leaderboard.html', async (req, res) => {
        let users = await db.collection('users').find({}).toArray();
        let scoreArr = [];

        users.sort(function(a, b) {
            return -(parseInt(a.score) - parseInt(b.score));
        });
        for(let i = 0; i < users.length; i++)
            scoreArr.push({username: users[i].username, score: users[i].score});
        console.log(scoreArr);
        if(req.session.sessionID !== undefined)
            res.render('leaderboard', {loggedIn: true, users: scoreArr});
        else res.render('leaderboard', {loggedIn: false, users: scoreArr});
    });

    app.get('/index.html', (req, res) => {
        if(req.session.sessionID !== undefined)
            res.render('index', {loggedIn: true});
        else res.render('index', {loggedIn: false});
    });

    app.get('/game.html', (req, res) => {
        if(req.session.sessionID !== undefined)
            res.render('game', {loggedIn: true});
        else res.render('game', {loggedIn: false});
    });

    app.get('/tutorial.html', (req, res) => {
        if(req.session.sessionID !== undefined)
            res.render('tutorial', {loggedIn: true});
        else res.render('tutorial', {loggedIn: false});
    });

    app.get('/signUp.html', (req, res) => {
        res.render('signUp', {message1: "", message2: ""});
    });

    app.post('/submit-signup', [
        check('username').isString(),
        check('password').isLength({min: 6}),
        check('confirmPassword').isLength({min: 6})
    ] , async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        if(req.body.password !== req.body.confirmPassword) {
            res.render('signUp', {message1: "Password mismatch!", message2: ""});
        }
        else {
            let user = {
                username: req.body.username,
                password: req.body.password,
                score: 0
            };

            let result = await db.collection('users').find({"username": user.username}).toArray();
            if(result.length > 0) {
                res.render('signUp', {message1: "Username already in use!", message2: ""});
            }
            else {
                db.collection('users').insertOne(user, (err, result) => {
                    if(err) return console.log(err);
                    console.log(`saved user ${req.body.username} to database`);
                    res.render('signUp', {message1: "Registration succesful! Log in!", message2: ""});
                });
            }
        }
    });

    app.get('/signOut.html', (req, res) => {
        db.collection('users').updateOne({sessionID: req.session.sessionID}, {$unset: {sessionID: req.session.sessionID}});
        req.session.destroy();
        res.redirect('/index.html');
    });

    app.post('/submit-signin', [
        check('username').isString(),
        check('password').isLength({min: 6}),
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        let userArr = await db.collection('users').find({"username": req.body.username}).toArray();
        console.log(userArr);
        if(userArr.length > 0) {
            let user = userArr[0];
            if(user.password === req.body.password) {

                let sessionID;
                let notFound = 1;
                do {
                    sessionID = Math.floor(Math.random() * Math.floor(4000));
                    let dbSessionId = await db.collection('users').find({"sessionID": sessionID}).toArray();
                    if(dbSessionId.length === 0)
                        notFound = false;
                } while(notFound);

                db.collection('users').updateOne({"username": req.body.username}, {$set: {"sessionID": sessionID}});
                req.session.sessionID = sessionID;
                req.session.save(error => {
                    if(err)
                        console.log('could not save session!');
                    else
                        console.log(`${req.body.username} logged in with sessionID ${sessionID}!`);
                });
                res.redirect('index.html');
            }
            else
                res.render('signUp', {message2: "Username or password invalid!", message1: ""});
        }
        else {
            res.render('signUp', {message2: "Username or password invalid!", message1: ""});
        }
    });

    app.use(function(req, res) {
       res.status(404).render('error', {'message': "Error 404! Pagina nu exista!"});
    });
});

module.exports = app;
