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

		referenceSvc.getReferences().then(function (result) {
		    vm.items = result.Default
		    vm.categories = result.Categories;
		    vm.appResources = result.AppResources[0];
		});

		vm.referenceFilter = function (reference) {
		    if (vm.activeCategory == 'all')
		        return true;
			var matches = $filter('filter')(reference.Category, { "Title": vm.activeCategory }, true);
			return matches.length > 0;
		};

		$scope.$on('$routeChangeSuccess', function () {
			vm.activeCategory = $route.current.params.category;
			window.previousCategory = vm.activeCategory;
			$window.document.title = vm.activeCategory + " | " + originalPageTitle;
		});

		vm.getMetaDescription = function () {
		    var currentCategory = $filter('filter')(vm.categories, { "Title": vm.activeCategory }, true)[0];
		    return currentCategory != null ? currentCategory.MetaDescription : null;
		};

	};
	
}());
