/**
 * Created by hariharaselvam on 7/12/16.
 */
window[appName].controller('sdn_edit_flow_controller',function($rootScope,$scope,$state,$stateParams,$http,$window,$location,$q,$filter)	{

	console.log("Called");

	if($scope.logged_in==undefined || $scope.logged_in=="")
	{
		window.location = "index.html";
	}
    $scope.id = $stateParams.id;

	$scope.itemperpage = 10;
	$scope.sw_pagination = {};
	$scope.sw_pagination.current = 1;

	function HttpRequest(method,action, URL, parameter) {

		$rootScope.showLoader = true;

		var $promise = '';
		if(method==="post") {
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

		switch (action) {




			case 'update_flow':

				console.log(response);
				break;

            case 'get_flow_info':
                $scope.flow = response.toSource();
                break;

		}

	}


	$scope.flow_delete = function(id,rev) {

		var param = {"cancel":true};

		bootbox.confirm("Are you sure you want to delete the flow "+id+ "?" , function (result) {
            if (result) {
				param = {"id":id,"rev":rev};
                HttpRequest('post','delete_flow',window.flaskURL+'delete_flow',param);
            }
        });

	}

    HttpRequest('post','get_flow_info',window.flaskURL+'get_flow_info',{"flow_id": $scope.id});

    $scope.edit_flow=function()
    {
        HttpRequest('post','update_flow',window.flaskURL+'update_flow',JSON.parse($scope.flow));
    }






});

