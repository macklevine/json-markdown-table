angular.module('input.inputServices', [])
	.factory('InputService', function ($http, $q){
		var sendInputData = function(data){
			return $http.post('/sendfields', data)
				.then(function(response){
					//get the response string here.
					console.log(response.data);
					return $q.resolve(response);
				},
				function(rejection){
					console.log(rejection.data);
					return $q.reject(rejection);
				});
		}
		return {
			sendInputData : sendInputData
		}
	});