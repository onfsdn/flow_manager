window[appName].controller('sdn_home_controller',function($rootScope,$scope,$state,$stateParams,$http,$window,$location,$q,$filter)	{

	console.log("Called");
	console.log($scope.logged_in);
	if($scope.logged_in==undefined || $scope.logged_in=="")
	{
		window.location = "index.html";
	}



	//Constants for the SVG



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


			case 'get_switch_info':
				$scope.switch_info = response;
				$scope.flow_info = response["rows"][0]["value"]["flows"]
				break;

			case 'getdocs':

				$scope.mesh_data = response;

				break;

		}

	}

	HttpRequest('get','getdocs',window.flaskURL+'getdocs','');
	HttpRequest('get','get_switch_info',window.flaskURL+'get_switch_info','');
	//HttpRequest('get','get_flow',window.flaskURL+'get_all_flows','');

});
