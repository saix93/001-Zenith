'use strict';

angular.module('zenith.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: '01_login/login.html',
        controller: 'LoginCtrl'
    });
}])

.controller('LoginCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
		var lsData = CommonFunctions.loadData();
		if (lsData != null) {
			$scope.data = lsData;
		}

		// Funcion para cambiar de vista
		$scope.goTo = function(url) {
			var newData = {
				data: {
					username: $scope.data.username
				}
			};
			angular.extend($scope, newData);
			CommonFunctions.saveData($scope.data);
			$location.url(url);
		}
    }]);
