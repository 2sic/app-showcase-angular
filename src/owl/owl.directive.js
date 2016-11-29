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