window[appName].controller('sdn_switch_info_controller', function ($rootScope, $scope, $state, $stateParams, $http, $window, $location, $q, $filter) {

    console.log("Called");

    if ($scope.logged_in == undefined || $scope.logged_in == "") {
        window.location = "index.html";
    }

    $scope.itemperpage = 10;
    $scope.sw_pagination = {};
    $scope.sw_pagination.current = 1;

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

        if(response["authentication"]==false)
        {
            window.location="index.html";
        }

        switch (action) {


            case 'get_switch':

                $scope.switch_detail = response["rows"][0]["id"];

                alert(response["rows"][0]["id"]);

                alert(response["rows"][1]["id"]);

                break;

            case 'get_switch_info':

                $scope.switch_info = response;
                $scope.flow_info = response["rows"][1]["value"]["data"]["flows"];
                break;

            case 'delete_flow':
                if (response["ok"]) {
                    bootbox.alert("Flow deleted successfully!");


                }
                else {
                    bootbox.alert("Delete Flow failed!");
                }

                break;

        }

    }


    $scope.flow_delete = function (id, rev) {

        var param = {"cancel": true};

        bootbox.confirm("Are you sure you want to delete the flow " + id + "?", function (result) {
            if (result) {
                param = {"id": id, "rev": rev};
                HttpRequest('post', 'delete_flow', window.flaskURL + 'delete_flow', param);
            }
        });

    }
    $scope.itemperpage = 10;
    $scope.sw_pagination = {};
    $scope.sw_pagination.current = 1;
    $scope.switch_post = function () {
        param = {"page": $scope.sw_pagination.current, "size": parseInt($scope.itemperpage)};
        HttpRequest('post', 'get_switch_info', window.flaskURL + 'get_switch_info', param);
    }
    $scope.sw_pageChanged = function (pagenumber) {
        $scope.sw_pagination.current = pagenumber;
        $scope.switch_post();

    }
    $scope.switch_post();


});
