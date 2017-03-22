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
        vm.appResources = {};
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

            vm.appResources = result.AppResources[0];
        });
    };

}());