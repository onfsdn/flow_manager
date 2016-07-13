window[appName].controller('sdn_user_list_controller', function ($rootScope, $scope, $state, $stateParams, $http, $window, $location, $q, $filter) {

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

            case 'get_all_users':

                $scope.user_list = response["rows"];

                console.log($scope.user_list);

                //console.log(response);

                break;

            case 'get_switch_info':
                $scope.switch_info = response;
                $scope.flow_info = response["rows"][1]["value"]["data"]["flows"];
                break;

            case 'delete_flow':

                $scope.del_info = response;
                HttpRequest('get', 'get_all_users', window.flaskURL + 'get_all_users', '');
                alert("Successfully Deleted")
                break;

            case 'delete_user':

                if (response["ok"]) {
                    bootbox.alert("User deleted successfully!");


                }
                else {
                    bootbox.alert("Delete user failed!");
                }
                console.log(response);
                break;

        }

    }


    $scope.flow_delete = function (id, rev) {

        var param = {"cancel": true};

        bootbox.confirm("Are you sure you want to delete the user", function (result) {
            if (result) {
                param = {"id": id, "rev": rev};
                HttpRequest('post', 'delete_user', window.flaskURL + 'delete_user', param);
            }
        });

    }



    HttpRequest('get', 'get_all_users', window.flaskURL + 'get_all_users', '');


});
