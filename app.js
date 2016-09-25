var app = angular.module('appname', ['backand', 'ngRoute', 'dndLists']);

app.config(function (BackandProvider, $routeProvider) {
    BackandProvider.setAppName('lunchsurvey');
    BackandProvider.setSignUpToken('edea9ef1-405d-49c5-87eb-18ee54a99aff');
    BackandProvider.setAnonymousToken('343c57ad-5be0-4f26-80e4-18c1c66f19d3');
    BackandProvider.runSocket(true);

    $routeProvider
        .when('/', {
            template   : '<food-list-directive></food-list-directive>',
            controller: function($location, UserService) {
                if (UserService &&  UserService.user && UserService.user.hasVoted) {
                    $location.path("submit");
                }
            }
        })
        .when('/submit', {
            template: '<results-directive></results-directive>',
            controller: function() {
                console.log("hello world!!!!")
            }
        })
        .otherwise({redirectTo:'/'});
})
