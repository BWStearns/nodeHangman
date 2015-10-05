var hangMan = angular.module('hangMan', []);

function mainController($scope, $http) {


	$scope.signIn = function($scope) {
		event.preventDefault();
		var username = $scope.username;
		var password = $scope.password;

		$http.post('/login')
			.success(function(data){
				$scope.getUser();
			})
			.error(function(data){
				console.log("ERROR");
			});
	};

	$scope.getGameList = function() {
		$http.get('/games')
			.success(function(data){
				$scope.games = data;
				console.log(data);
			})
			.error(function(data){
				$scope.games = [];
				console.log("ERROR: " + data);
			});
	};

	$scope.getUser = function() {
		$http.get('/whoami')
			.success(function(data){
				var noUser = (data == "null");
				$scope.loggedIn = (!noUser);
				$scope.user = noUser ? null : data;
			})
			.error(function(data){
				$scope.user = null;
				$scope.loggedIn = false;
				console.log("ERROR: " + data);
		})
	};


	$scope.formData = {};
	$scope.getUser();
	$scope.getGameList();

};

// function playController($scope, $http) {

// };