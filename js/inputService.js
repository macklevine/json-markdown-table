angular.module('inputService', [])
	.factory('inputService', function ($http, $q, $localStorage){
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

        // return $http.get(utils.getApi(`/agents/${$localStorage.authData.id}/contacts`), {params: data}).then(
        //     response => (response),
        //     rejection => {
        //         if ('404' === _.result(rejection, 'data.internalErrorCode', '').toString()) { //ignore error for no clients found.
        //             return $q.resolve();
        //         }
        //         return $q.reject(rejection);
        //     }
        // );