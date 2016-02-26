'use strict';

angular.module('zenith.room', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/room', {
        templateUrl: '03_room/room.html',
        controller: 'RoomCtrl'
    });
}])

.controller('RoomCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
		var lsData = CommonFunctions.loadData();
		if (lsData != null) {
			$scope.data = lsData;
		}

        $scope.errorModel = {};

		var socket = io();

		socket.emit('chat message', $scope.data.username);
	}]);
