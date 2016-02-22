'use strict';

angular.module('zenith.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: '01_index/index.html',
        controller: 'indexCtrl'
    });
}])

.controller('indexCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
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
