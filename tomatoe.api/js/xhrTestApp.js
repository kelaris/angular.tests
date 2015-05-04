var rottenTomatoesAPIKey = "6n63ccmvb2vrkewaay4pf9q2";
var delayInMs = 200;
var timeoutPromise, request;

var xhrTestApp = angular.module('xhrTest', []);

xhrTestApp.controller("searchController", function ($scope, $timeout, rottenTomatoesDataFactory) {

    $scope.error_text = "";

    $scope.search_results = [];

    $scope.clearSearchText = function () {
        $scope.search_text = '';
    };
    
    $scope.$watch('search_text', function (newValue) {

        $scope.error_text = "";
        $timeout.cancel(timeoutPromise);
        if (request) {
            request.cancel("User cancelled");
        }

        if (typeof newValue != "undefined" && newValue && newValue.length > 2) {

            timeoutPromise = $timeout(function() {
                //Using timeout for prevent many requests to the server while user is typing
                request = rottenTomatoesDataFactory.search(newValue);

                request.promise.then(function (result) {
                    $scope.search_results = result.movies;
                }, function (reason) {
                    if (status != 0) { //if not canceled  
                        $scope.error_text = "Http Error code: " + reason.status;
                    }
                    console.log(reason);
                });

            }, delayInMs);

        } else {
            $scope.search_results = [];
        }
    });
});

xhrTestApp.factory("rottenTomatoesDataFactory", function ($http, $q) {

    var search = function (query) {
        var canceller = $q.defer();

        var cancel = function (reason) {
            canceller.resolve(reason);
        };

        var promise =
            $http.jsonp('http://209.237.233.58/api/public/v1.0/movies.json', {
                params: {
                    page_limit: 6,
                    page: 1,
                    q: query,
                    apikey: rottenTomatoesAPIKey,
                    callback: 'JSON_CALLBACK'
                },
                timeout: canceller.promise
            }).then(function (response) {
                return response.data;
            });

        return {
            promise: promise,
            cancel: cancel
        };
    };

    return {
        search: search
    };

});