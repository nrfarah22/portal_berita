var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var flash = require('req-flash');

var app = express();

app.set('views', path.join(__dirname, '../frontend/src/pages'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// // view engine setup - using EJS
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// session setup
app.use(session({
  secret: 'iniadalahkeyrahasiamu',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(flash());

app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});

// serving static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var indexRouter = require('./routes/index');
var sessionRouter = require('./routes/session');
const loginRouter = require('./routes/user/login');
const registerRouter = require('./routes/user/register');
const loginAdminRouter = require('./routes/admin/loginAdmin');
const registerAdminRouter = require('./routes/admin/registerAdmin');
const profileRouter = require('./routes/user/profile');
const beritaRouter = require('./routes/admin/berita');

app.use('/', indexRouter);
app.use('/session', sessionRouter);
app.use('/login', loginRouter);
app.use('/loginAdmin', loginAdminRouter);
app.use('/register', registerRouter);
app.use('/registerAdmin', registerAdminRouter);
app.use('/profile', profileRouter);
app.use('/berita', beritaRouter);

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
