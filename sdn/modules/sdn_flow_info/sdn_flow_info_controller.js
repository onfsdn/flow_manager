window[appName].controller('sdn_flow_info_controller',function($rootScope,$scope,$state,$stateParams,$http,$window,$location,$q,$filter)	{

	 $scope.flow_id = $stateParams.flow_id;

	var param = {"flow_id":$scope.flow_id};

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

			case 'get_flow_info':
				$scope.flow_info = response;
				break;

		}

	}

	HttpRequest('post','get_flow_info',window.flaskURL+'get_flow_info',param);
	//HttpRequest('get','get_flow',window.flaskURL+'get_all_flows','');

});
