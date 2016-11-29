/**
 * Definition of the references app
 */
(function () {
    'use strict';
    angular.module("references")
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/cat/:category?', {
                controller: "ReferencesController",
                controllerAs: "vm",
                templateUrl: "referenceList.html"
            })
            .when('/reference/:name', {
                controller: "ReferenceDetailController",
                controllerAs: "vm",
                templateUrl: "referenceDetail.html"
            })
            .otherwise({ redirectTo: '/cat/all' });

    }])
    .constant('originalPageTitle', document.title);
})();