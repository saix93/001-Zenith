'use strict';

angular.module('myApp.inicio', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/inicio', {
        templateUrl: 'inicio/inicio.html',
        controller: 'InicioCtrl'
    });
}])

.controller('InicioCtrl', ['$scope', '$location', 'CommonFunctions', 'Data', function($scope, $location, CommonFunctions, Data) {
    $scope.$watch(function () { return window.location.href; }, function(newV, oldV) {
        if(newV != oldV){
            console.log("CAMBIO: " + newV);
        } else {
            console.log("IGUAL - NUEVO: " + newV);
            console.log("IGUAL - viejo: " + oldV);
        }
    });

    if (Data.getUrl() == '' || typeof(Data.getUrl()) == 'undefined') {
        Data.setUrl(window.location.href);
    }
}]);