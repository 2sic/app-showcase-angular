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