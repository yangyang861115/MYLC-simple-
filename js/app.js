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
            .when("/message/:type", {
                templateUrl: "partials/message.html",
                controller: "MessageController",
                controllerAs: "model"
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
    app.controller('MessageController', messageController);

    function pageCtrl($scope, $location,$window, $anchorScroll, $http, $sce) {

        $scope.scrollPos = 0;
        //scroll to section_id
        //$scope.scrollTo = function(id) {
        //    var old = $location.hash();
        //    $location.hash(id);
        //    $anchorScroll();
        //    //reset to old to keep any additional routing logic from kicking in
        //    $location.hash(old);
        //};

        $scope.scrollTo = function(eID) {
                // This scrolling function
                // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

                var startY = currentYPosition();
                var stopY = elmYPosition(eID);
                var distance = stopY > startY ? stopY - startY : startY - stopY;
                if (distance < 100) {
                    scrollTo(0, stopY); return;
                }
                var speed = Math.round(distance / 100);
                if (speed >= 20) speed = 20;
                var step = Math.round(distance / 25);
                var leapY = stopY > startY ? startY + step : startY - step;
                var timer = 0;
                if (stopY > startY) {
                    for ( var i=startY; i<stopY; i+=step ) {
                        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                    } return;
                }
                for ( var i=startY; i>stopY; i-=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
                }

                function currentYPosition() {
                    // Firefox, Chrome, Opera, Safari
                    if (self.pageYOffset) return self.pageYOffset;
                    // Internet Explorer 6 - standards mode
                    if (document.documentElement && document.documentElement.scrollTop)
                        return document.documentElement.scrollTop;
                    // Internet Explorer 6, 7 and 8
                    if (document.body.scrollTop) return document.body.scrollTop;
                    return 0;
                }

                function elmYPosition(eID) {
                    var elm = document.getElementById(eID);
                    var y = elm.offsetTop;
                    var node = elm;
                    while (node.offsetParent && node.offsetParent != document.body) {
                        node = node.offsetParent;
                        y += node.offsetTop;
                    } return y;
                }

        };


        //render html code
        $scope.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        };

        //show or hide the jumbotron
        $scope.checkURl = function () {
            if ($location.url() == '/' || $location.url().indexOf('/#') > -1) return true;
            return false;
        };

        //footer class
        $scope.checkURlForFooter = function(){
            console.log($window);
            if($location.url().indexOf('message') > -1 && $window.innerWidth > 450) return true;
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

    function messageController($routeParams) {
        var vm = this;
        vm.type = $routeParams.type;
        console.log(vm.type)
    }

})();