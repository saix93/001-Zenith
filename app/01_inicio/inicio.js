'use strict';

angular.module('zenith.inicio', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/inicio', {
        templateUrl: '01_inicio/inicio.html',
        controller: 'InicioCtrl'
    });
}])

.controller('InicioCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
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
