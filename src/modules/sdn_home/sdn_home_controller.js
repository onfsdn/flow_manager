window[appName].controller('sdn_home_controller', function ($rootScope, $scope, $state, $stateParams, $http, $window, $location, $q, $filter) {

    console.log("Called");

    if ($scope.logged_in == undefined || $scope.logged_in == "") {
        window.location = "index.html";
    }

    function HttpRequest(method, action, URL, parameter) {

        $rootScope.showLoader = true;

        var $promise = '';
        if (method === "post") {
            $promise = $http.post(URL, parameter);
        } else {
            $promise = $http.get(URL, parameter);
        }
        $promise.then(function (response) {
            var result = angular.fromJson(response.data);
            processTheData(action, result);

            $rootScope.showLoader = false;

        });
    };

    function processTheData(action, response) {

        if (response["authentication"] == false) {
            window.location = "index.html";
        }

        switch (action) {


            case 'get_switch':

                $scope.switch_detail = response["rows"][1]["id"];
                console.log($scope.switch_detail);

                break;

            case 'get_switch_info':
                $scope.switch_info = response;
                $scope.flow_info = response["rows"];
                break;
        }

    }

    HttpRequest('get', 'get_switch', window.flaskURL + 'get_switch', '');


});
