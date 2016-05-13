/**
 * Main AngularJS Web Application
 */
(function () {
    var app = angular.module('MYLCApp', ['ngRoute', 'ui.bootstrap']);

    /**
     * Configure the Routes
     */
    app.config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "partials/home.html"
            })
            .when("/about", {
                templateUrl: "partials/about.html",
            })
            .when("/notnow", {
                templateUrl: "partials/notnow.html",
            })
            .when("/nxtlttr", {
                templateUrl: "partials/nextlttr.html",
            })
            .when("/resources", {
                templateUrl: "partials/resources.html"
            })
            .when("/support", {
                templateUrl: "partials/support.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    }

    /**
     * Directive for the scroll position
     */
    app.directive("scroll", function ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                scope.scrollPos = this.pageYOffset;
                scope.$apply();
            });
        };
    });

    /**
     * Controller for the pages
     */

    app.controller('PageCtrl', pageCtrl);

    function pageCtrl($scope, $location, $http, $sce) {

        $scope.scrollPos = 0;

        //render html code
        $scope.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        }

        //show or hide the jumbotron
        $scope.checkURl = function () {
            if ($location.url() == '/' || $location.url().indexOf('/#') > -1) return true;
            return false;
        }


        $scope.$on('$locationChangeStart', function(event) {
            $scope.checkbg = ! $scope.checkURl();
            //navigation highlight
            $scope.location = $location.url();
        });


        //accordion
        $scope.status = {
            isFirstOpen: true,
            isSecondOpen: false,
            isThirdOpen: false
        };

        //form: learnFm supFm stoFm
        $scope.EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;


        $scope.submitFm = function (usr) {
            console.log(usr);
            $http.post("https://crucore.com/api.php", usr)
                .success(function (res) {
                    if (res.success) {
                        if(usr.post_actions == "joinacts") $scope.msg = res.msg;
                        if(usr.post_actions == "support") $scope.supmsg = res.msg;
                        if(usr.post_actions == "story") $scope.stomsg = res.msg;
                    } else {
                        alert("You are at Failure");
                    }
                });

        };



    }

})();