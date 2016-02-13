'use strict';

// Declare app level module which depends on views, and components
angular.module('zenith', [
    'ngRoute',
    'zenith.inicio',
    'zenith.salas',
    'zenith.version'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/inicio'});
}])

// Funciones comunes para mas de un controller
.factory("CommonFunctions", [function() {
    var commonFunctions = {};

	commonFunctions.saveData = function(data){
		localStorage.setItem('zenithData', JSON.stringify(data));
    };

	commonFunctions.loadData = function(){
		return JSON.parse(localStorage.getItem('zenithData'));
    };

    return commonFunctions;
}])
.factory("Data", [function() {
    var data = {};

    return {
        getData: function() {
            return data;
        },
        setData: function(newData) {
            data = newData;
        }
    };
}]);
