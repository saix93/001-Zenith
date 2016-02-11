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
        // Inicializacion del controlador

            $http.get('/api/lista')
                .success(function(data){
                    $scope.elementos = data.elementos;
                })
                .error(function(data){

                });

        // Funciones llamadas desde plantilla

            $scope.login = function() {
                if ($scope.username != "Arich") {
                    $location.url('salas');
                } else {
                    $scope.errorModel.nameError = true;
                }
            };
    }]);