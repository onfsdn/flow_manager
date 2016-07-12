window.appName = 'SDN';

//window[appName] = angular.module(appName, ['ui.router','ngValidator','highcharts-ng','ngSanitize','angularUtils.directives.dirPagination']);

window[appName] = angular.module(appName, ['ui.router', 'ngValidator', 'ngSanitize','highcharts-ng','angularUtils.directives.dirPagination','ngAnimate', 'ui.bootstrap']);

var host = location.hostname;

var port = location.port;

window.flaskURL = "http://" + host + ":" + port + "/";

window[appName].config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');


    $stateProvider
        .state('sdn_home', {
            url: '/',
            templateUrl: 'modules/sdn_home/sdn_home.html',
            controller: 'sdn_home_controller',
        });

    $stateProvider
        .state('sdn_graph', {
            url: '/sdn_graph',
            templateUrl: 'modules/sdn_graph/sdn_graph.html',
            controller: 'sdn_graph_controller',
        });


    $stateProvider
        .state('sdn_flow_info', {
            url: '/sdn_flow_info/:flow_id',
            templateUrl: 'modules/sdn_flow_info/sdn_flow_info.html',
            controller: 'sdn_flow_info_controller',
        });

    $stateProvider
        .state('sdn_switch_info', {
            url: '/sdn_switch_info',
            templateUrl: 'modules/sdn_switch_info/sdn_switch_info.html',
            controller: 'sdn_switch_info_controller',
        });

     $stateProvider
        .state('sdn_register', {
            url: '/sdn_register',
            templateUrl: 'modules/sdn_register/sdn_register.html',
            controller: 'sdn_register_controller',
        });

    $stateProvider
        .state('sdn_user_list', {
            url: '/sdn_user_list',
            templateUrl: 'modules/sdn_user_list/sdn_user_list.html',
            controller: 'sdn_user_list_controller',
        });



});


window[appName].factory('loginService', function ($http, $location) {
    return {

        islogged: function () {

            var $checkSessionServer = $http.post('/check_session_data');

            return $checkSessionServer;

        }

    }

});


window[appName].factory('sessionService', function () {
    return {
        set: function (key, value) {
            return sessionStorage.setItem(key, value);
        },
        get: function () {
            return sessionStorage.getItem(key);
        },
        destroy: function () {
            return sessionStorage.removeItem(key);
        }
    };
})


window[appName].run(function ($rootScope, $window, $location, loginService, sessionService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

         console.log('toState.name: '+toState.name);

        $rootScope.navigation.menu_item = toState.name;

        var connected = loginService.islogged();

        connected.then(function (msg) {

            if (msg.data == 1) {

                //$window.location.replace("index.html")

            } else if (msg.data == 0) {

                if (sessionStorage.getItem('uid') == null) {

                    //$window.location.replace("index.html")

                }

            }


        });

    });

});


window[appName].controller('sdn_controller', function ($rootScope, $scope, $state, $http) {

    var date = new Date();

    $scope.current_year = date.getFullYear();

    $scope.previous_year = parseInt($scope.current_year) - 1;

    $scope.logged_in = sessionStorage.getItem("name");

    $scope.role = sessionStorage.getItem("role");

    $rootScope.navigation = {};

    $rootScope.navigation.menu_item = 'kumo_dashboard';

    $rootScope.load_div = false;


    $scope.logout = function () {

        $rootScope.load_div = true;

        sessionStorage.clear();

        $http.post('/logout').success(function (data, status, headers, config) {

            $rootScope.load_div = false;

            window.location = "index.html"

        }).error(function (data, status, headers, config) {


        });


    }


});
