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
