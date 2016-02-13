'use strict';

angular.module('zenith.inicio', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/inicio', {
        templateUrl: 'inicio/inicio.html',
        controller: 'InicioCtrl'
    });
}])

.controller('InicioCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
		var lsData = CommonFunctions.loadData();
		if (lsData != null) {
			$scope.data = lsData;
		}

        $http.get('/api/lista')
            .success(function(data){
                $scope.elementos = data.elementos;
            });

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
