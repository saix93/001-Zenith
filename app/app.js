'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.inicio',
    'myApp.salas',
    'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/inicio'});
}])
.factory("CommonFunctions", [function() {
    var commonFunctions = {};

    commonFunctions.init = function(scope){

    };

    commonFunctions.goTo = function(){

    };

    return commonFunctions;
}])
.factory("Data", [function() {
    var data = {
        url: ''
    };

    return {
        getUrl: function() {
            return data.url;
        },
        setUrl: function(url) {
            data.url = url;
        }
    };
}]);