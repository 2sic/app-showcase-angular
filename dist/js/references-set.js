/**
 * Definition of the references app
 */
(function () {
    'use strict';
    angular.module("references", [
        '2sxc4ng',
        'ngRoute',
        'owl.carousel',
        'updateMeta']);
})();
/**
 * The controller function for the references app
 */
(function () {
    'use strict';

    angular.module("references")
		.controller("ReferenceDetailController", ReferenceDetailController);

    function ReferenceDetailController($route, referenceSvc, $filter, $sce, $window, $location, originalPageTitle) {
        var vm = this;
        vm.previousCategory = window.previousCategory;
        vm.r = null;
        vm.owlOptions = {
            items: 1,
            itemsDesktop: false,
            itemsDesktopSmall: false,
            itemsTablet: false,
            itemsMobile: false,
            lazyLoad: true,
            navigationText: ["", ""],
            pagination: true,
            theme: "owl-2sic",
            autoPlay: false,
            autoHeight: false,
            rewindSpeed: 500,
            rewindNav: false,
            navigation: true
        };

        // referenceSvc caches results, so there are no additional request when switching list / detail view
        referenceSvc.getReferences().then(function (result) {
            vm.r = $filter('filter')(result.Default, { UrlPath: $route.current.params.name }, true)[0];
            
            referenceSvc.getImages(vm.r.Id).then(function (result) {
                vm.images = result;
            });

            if (vm.previousCategory == null)
                vm.previousCategory = $filter('filter')(result.Categories, { Id:  vm.r.Category[0].Id }, true)[0];

            if (vm.r === undefined)
                $location.path('/');
            else {
                vm.r.trustedDescription = $sce.trustAsHtml(vm.r.Description);
                vm.r.trustedLinks = $sce.trustAsHtml(vm.r.Links);

                window.scrollTo(0, 0);
                $window.document.title = vm.r.Title + " | " + vm.r.Category.map(function (c) { return c.Title }).join(', ') + " | " + originalPageTitle;
            }
        });
    };

}());
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
/**
 * The controller function for the references app
 */
(function () {
    'use strict';
	
	window.previousCategory = null;

	angular.module("references")
		.controller("ReferencesController", ReferencesController);

	function ReferencesController($scope, referenceSvc, $location, $route, $routeParams, $filter, $sce, $window, originalPageTitle) {
		var vm = this;
		vm.items = [];
		vm.categories = [];
		vm.activeCategory = null;
		vm.appResources = {};

		var loadedPromise = referenceSvc.getReferences().then(function (result) {
		    vm.items = result.Default
		    vm.categories = result.Categories;
		    vm.appResources = result.AppResources[0];
		});

		$scope.$on('$routeChangeSuccess', function () {
			loadedPromise.then(function() {
				var categoryPath = $route.current.params.category;

				if(categoryPath == 'all') {
					vm.activeCategory = null;
					$window.document.title = originalPageTitle;
				}
				else {
					vm.activeCategory = $filter('filter')(vm.categories, { "UrlPath": categoryPath }, true)[0];
					window.previousCategory = vm.activeCategory;
					$window.document.title = vm.activeCategory.Title + " | " + originalPageTitle;
				}
			});
		});

		vm.referenceFilter = function (reference) {
		    if (vm.activeCategory == null)
		        return true;
			var matches = $filter('filter')(reference.Category, { "Id": vm.activeCategory.Id }, true);
			return matches.length > 0;
		};

	};
	
}());

(function () {
    'use strict';
    angular.module('references')
    .filter('cropText', [function cropText() {
        return function (str, maxLength) {
            if (typeof str !== "string") {
                return str;
            }
            if (str.length > maxLength) {
                str = str.substring(0, maxLength - 3).trim() + "...";
            }
            return str;
        };
    }])

    .filter('htmlToPlainText', [function htmlToPlainText() {
        return function (str, maxLength) {
            return String(str).replace(/<[^>]+>/gm, "")
                .replace(/&uuml;/g, "ü")
                .replace(/&Uuml;/g, "Ü")
                .replace(/&ouml;/g, "ö")
                .replace(/&Ouml;/g, "Ö")
                .replace(/&auml;/g, "ä")
                .replace(/&Auml;/g, "Ä")
                .replace(/&amp;/g, "&");
        };
    }]);
})();
(function () {
    'use strict';
    angular.module('references')
    .factory('referenceSvc', ['$http', 'content', '$q', 'query', function referenceSvc($http, content, $q, query) {
        var svc = {};

        var cache = null;
        svc.getReferences = function getReferences() {
            var deferred = $q.defer();
            if (cache !== null)
                deferred.resolve(cache);
            else
                query('References').get().then(function (result) {
                    cache = result.data;
                    deferred.resolve(cache);
                });

            return deferred.promise;
        };

        svc.getImages = function getImages(entityId) {
            return $http.get('app-api/References/GetImages', {
                params: {
                    entityId: entityId
                }
            }).then(function (result) {
                return result.data;
            });
        };

        return svc;
    }]);
})();
/**
 * OWL carousel directive from http://stackoverflow.com/a/29158076
 */
(function () {
    'use strict';
    angular.module('owl.carousel', [])
    .directive('owlCarousel', [function () {
        return {
            restrict: 'E',
            scope: {
                owlOptions: '='
            },
            controller: function ($scope) {
                this.scope = $scope;
            },
            link: function (scope, element, attrs) {
                scope.initCarousel = function () {
                    //$(element).find("a[owl-carousel-item-lightbox]").fancybox({ padding: 0 });
                    $(element).owlCarousel(scope.owlOptions);
                };
            }
        }
    }])
    .directive('owlCarouselItem', [function () {
        return {
            restrict: 'A',
            require: '^owlCarousel',
            link: function (scope, element, attrs, owlCarouselController) {
                if (scope.$last) {
                    owlCarouselController.scope.initCarousel();
                }
            }
        };
    }
    ]);

})();