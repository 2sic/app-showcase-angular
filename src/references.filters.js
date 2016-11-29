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