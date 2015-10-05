module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.sendfile('views/index.html');
    });

    app.get('/login', function(req, res) {

        res.render('login.jade', { message: req.flash('loginMessage') }); 
    });

    app.get('/signup', function(req, res) {

        res.render('signup.jade', { message: req.flash('signupMessage') });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.jade', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/whoami', function(req, res) {
        if (req.user) {
            res.json({username: req.user.username})
        } else {
            res.json(null)
        }
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}