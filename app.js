var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var expressValidator = require('express-validator');

mongoose.Promise =global.Promise;
mongoose.connect('mongodb://localhost/etherfund');


var db=mongoose.connection;

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);


//mongodb://aminnagpure:<PASSWORD>@cluster0-shard-00-00-39uoa.mongodb.net:27017,cluster0-shard-00-01-39uoa.mongodb.net:27017,cluster0-shard-00-02-39uoa.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(function(req, res, next){
    res.io = io;
    next();
});

var index = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var contentmanage = require('./routes/contentmanage');
var wallet = require('./routes/wallet');

app.use('/', index);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/contentmanage', contentmanage);
app.use('/wallet', wallet);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


module.exports = {app: app, server: server};
