window[appName].controller('sdn_register_controller', function ($rootScope, $scope, $state, $stateParams, $http, $window, $location, $q, $filter) {


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

                break;

            case 'get_switch_info':
                $scope.switch_info = response;
                $scope.flow_info = response["rows"];
                console.log($scope.flow_info);
                break;

            case 'register_user':
                if (response["ok"]) {
                    bootbox.alert("User added successfully!");


                }
                else {
                    bootbox.alert("Add User failed!");
                }
                console.log(response);

                break;
        }

    }

    $scope.user_register = function () {

        if ($scope.regsiter_user.isValid()) {

            var data = {"username": $scope.username, "password": $scope.password, "role": $scope.role};

            HttpRequest('post', 'register_user', window.flaskURL + 'register_user', data);


        }
    }

});
