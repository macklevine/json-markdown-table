angular.module('input.inputServices', [])
	.factory('InputService', function ($http, $q){
		var sendInputData = function(data){
			return $http.post('/sendfields', data)
				.then(function(response){
					//get the response string here.
					return $q.resolve(response)
				},
				function(rejection){
					return $q.reject(rejection)
				});
		}
		return {
			sendInputData : sendInputData
		}
	});