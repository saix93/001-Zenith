'use strict';

angular.module('myApp.salas', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/salas', {
        templateUrl: 'salas/salas.html',
        controller: 'SalasCtrl'
    });
}])

.controller('SalasCtrl', ['$scope', '$location', 'CommonFunctions', 'Data', function($scope, $location, CommonFunctions, Data) {
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