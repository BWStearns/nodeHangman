var Game = require("../models/games.js").db.models.Game;
var Guess = require("../models/games.js").db.models.Guess;

module.exports = function(app, passport) {

    // list games owned by user
    app.get('/games', function(req, res){
    	Game.find({user: req.user}, function(err, games){
    		if (err)
    			res.send(err);
    		res.json(games.map(function (g) { return g.gameRepr() }));
    	});
    });

    // Send game state
    app.get('/games/:game_id', ownsGame, function(req, res) {
        Game.findById(req.params.game_id, function (err, game){
        	if (err)
        		res.send(err);
        	res.json(game.gameRepr());
        });
    });

    // make move
	app.post('/games/:game_id', ownsGame, function(req, res) {
        Game.findById(req.params.game_id, function (err, game){
        	if (err || (game.guesses.length == 10))
        		res.send(err);
        	// Duplicate guesses are allowed. Stupid should hurt.
        	game.guesses.create({letter: req.body.guess})
        	res.json(game.gameRepr());
        });
    });

	// create new game
    app.post('/games/', isLoggedIn, function(req, res) {
    	var answer = req.body.answer ? req.body.answer : Game.randomWord()
    	var newGame = new Game(
    		{
    			answer: answer,
    			user: req.user
    		}
    	);
    	newGame.save();
    	res.json(game.gameRepr());
    })

};


function isLoggedIn(req, res, next) {
	// Yes it's c&p.....
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function ownsGame(req, res, next) {
	// Yes it's c&p.....
    // if user is authenticated in the session, carry on
    var requestedGame = null
    Game.findById(req.params.game_id, function (err, game){
        	if (err)
        		res.send(err);
        	var requestedGame = game;
		    
		    if (req.user == requestedGame.user)
		        return next();
        });

    // if they aren't owner, error
    res.send(err);
}