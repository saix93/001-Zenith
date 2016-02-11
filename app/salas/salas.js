'use strict';

angular.module('zenith.salas', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/salas', {
        templateUrl: 'salas/salas.html',
        controller: 'SalasCtrl'
    });
}])

.controller('SalasCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
        // Inicializacion del controlador

            $scope.errorModel = {};

            $http.get('/api/lista')
                .success(function(data){
                    $scope.elementos = data.elementos;
                });

        // Funciones llamadas desde plantilla

            $scope.addRoom = function (newId, newText) {
                var newData = {};
                newData.id = newId;
                newData.text = newText;
                $scope.errorModel = {};

                $http.post('/api/lista', newData).success(function(data){
                    $scope.elementos = data.elementos;
                }).error(function(data){
                    $scope.errorModel.roomError = data;
                });
            };

            $scope.focusElement = function (input) {
                document.getElementById(input).focus();
            };
    }]);