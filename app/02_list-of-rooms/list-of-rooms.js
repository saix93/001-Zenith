'use strict';

angular.module('zenith.list-of-rooms', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list-of-rooms', {
        templateUrl: '02_list-of-rooms/list-of-rooms.html',
        controller: 'ListOFRoomsCtrl'
    });
}])

.controller('ListOFRoomsCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
		var lsData = CommonFunctions.loadData();
		if (lsData != null) {
			$scope.data = lsData;
		}

        $scope.errorModel = {};

        $http.get('/api/list-of-rooms')
            .success(function(data){
                $scope.rooms = data.rooms;
            });

		// Funcion para agregar una sala
        $scope.addRoom = function (newId, newText) {
            var newData = {};
            newData.id = newId;
            newData.text = newText;
            $scope.errorModel = {};

            $http.post('/api/list-of-rooms', newData).success(function(data){
                $scope.rooms = data.rooms;
            }).error(function(data){
                $scope.errorModel.roomError = data;
            });
        };

        $scope.focusElement = function (input) {
            document.getElementById(input).focus();
        };

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
