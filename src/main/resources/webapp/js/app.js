'use strict';

/* App Module */

var hadrianApp = angular.module('HadrianApp', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'hadrianDirectives',
    'hadrianControllers',
    'hadrianFilters',
    'hadrianServices'
]);

hadrianApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/Home', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                }).
                when('/Team/:teamId', {
                    templateUrl: 'partials/team.html',
                    controller: 'TeamCtrl'
                }).
                when('/Service/:serviceId', {
                    templateUrl: 'partials/service.html',
                    controller: 'ServiceCtrl'
                }).
                when('/Graph', {
                    templateUrl: 'partials/graph.html',
                    controller: 'GraphCtrl'
                }).
                when('/Parameters', {
                    templateUrl: 'partials/parameters.html',
                    controller: 'ParametersCtrl'
                }).
                when('/CrossService', {
                    templateUrl: 'partials/crossService.html',
                    controller: 'CrossServiceCtrl'
                }).
                when('/WorkItems', {
                    templateUrl: 'partials/workItems.html',
                    controller: 'WorkItemsCtrl'
                }).
                when('/Backfill', {
                    templateUrl: 'partials/backfill.html',
                    controller: 'BackfillCtrl'
                }).
                when('/Admin', {
                    templateUrl: 'partials/admin.html',
                    controller: 'AdminCtrl'
                }).
                when('/Help', {
                    templateUrl: 'partials/help.html',
                    controller: 'HelpCtrl'
                }).
                otherwise({
                    redirectTo: '/Home'
                });
    }]);
