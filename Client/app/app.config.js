'use strict';

angular.
  module('deputadoApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('');

      $routeProvider.
        when('/home', {
          template: '<home-page></home-page>'
        }).
        otherwise('/home');
    }
  ]);
