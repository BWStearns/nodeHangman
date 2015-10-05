var mongoose = require('mongoose');

var guessSchema = new mongoose.Schema({
	letter: {type: String, lowercase: true, match: /^[A-z]$/},
	time: { type: Date, default: Date.now }
});


var gameSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	start_time: { type: Date, default: Date.now },
	answer: String,
	guesses: {type: [guessSchema], default: []},
});

gameSchema.methods.displayState = function() {
	// returns string to represent the player's current knowledge of the answer
	// How to handle spaces? Break up more?
	var is_alpha = /^[A-z]$/
	var answer = this.answer;
	var guesses = this.guesses.map(
		function (guess) {
			guess.letter;
		}
	);

	return answer.split("").map(function (letter) {
		if ((!is_alpha.test(letter)) ||  guesses.indexOf(letter)+1) { 
			return letter;
		} else {
			return "_";
		}
	});
};

gameSchema.methods.gameRepr = function () {
	// a convenience method
	var repr = {
		state: this.displayState,
		guesses: this.guesses.map( function (g) { return g.letter })
	};

	return repr
};

gameSchema.methods.gameStatusCode = function () {
	if (this.displayState == answer) {
		// Win
		return 1;
	} else if (this.guesses.length == 10) {
		// Lose
		return -1;
	} else {
		// Ongoing
		return 0;
	}
}

gameSchema.methods.isOngoing = function () {
	return this.gameStatusCode() == 0
}

gameSchema.statics.randomWord = function () {
	// Needs more entropy
	return "foobar"
}


module.exports = mongoose.model('Game', gameSchema);
module.exports = mongoose.model('Guess', guessSchema);