const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { check, validationResult } = require('express-validator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/game.html'));
});

app.get('/tutorial.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/tutorial.html'));
});

app.get('/signUp.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/signUp.html'));
});

app.post('/submit-signup', [
    check('username').isString(),
    check('password').isLength({min: 6}),
    check('confirmPassword').isLength({min: 6})
] ,(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    if(req.body.password !== req.body.confirmPassword) {
      res.render('error', {message: "Password mismatch!",
                            error: {status: 404, stack: "asd"}
      });
    }
    let user = {
        username: req.body.username,
        password: req.body.password
    };
    res.redirect('index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
