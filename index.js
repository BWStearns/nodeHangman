var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


require('./config/passport')(passport); 


// Mongo Connection
mongoose.connect('mongodb://localhost/hangman');


// for debugging
app.use(morgan('dev')); // log every request to the console
//

// for passport stuff
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


// Main app stuff
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'jade');
app.use(require('body-parser')());
app.use(express.static(__dirname + '/static'));


// AUTH routes

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));


app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

// PATHS

require('./routes/routes.js')(app, passport);
require('./routes/gameApi.js')(app, passport);


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});