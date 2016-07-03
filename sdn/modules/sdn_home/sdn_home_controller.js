window[appName].controller('sdn_home_controller',function($rootScope,$scope,$state,$stateParams,$http,$window,$location,$q,$filter)	{

	console.log("Called");

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
				root = response;
				//update();



				$(function (response) {

					//root = $scope.mesh_data
					//update();

					var div = d3.select("body").append("div")
						.attr("class", "tooltip")
						.style("display", 'none');

					var mousex = 0;
					var mousey = 0;
					$( document ).on( "mousemove", function( event ) {
						mousex = event.pageX;
						mousey = event.pageY;
					});

					var g = {
						data: null,
						force:null
					};




					var w = 1324,
						h = 650,
						r=6,
					//color = d3.scale.category10(),
						node,
						link,
						node1,
						root,prev_clicked_data='';

					var force = d3.layout.force()
						.on("tick", tick)
						.charge(-300)
						.gravity(0.11)
						//.charge(function(d) { return d._children ? -d.size / -300 : -30; })
						.linkDistance(function(d) { return d.target._children ? 50 : 30; })
						//.linkDistance(70)
						.size([w, h - 160]);

					var zoom = d3.behavior.zoom().on("zoom", redraw);

					var vis = d3.select("#visulization").append("svg:svg")
						.attr("width", w)
						.attr("height", h)
						.append('svg:g')
						//    .call(zoom)
						//    .on("mousewheel.zoom", null)
						.append('svg:g');

					vis.append('svg:rect')
						.attr('width', w)
						.attr('height', h)
						.attr('fill', 'transparent');
					//.call(zoom);






					var trans=[10,10];
					var scale=1;

					var root=response;
					filename="";

					//d3.json(filename, function(){
					//	root = $scope.mesh_data;
					//	root.fixed = true;
					//	root.x = w / 2;
					//	root.y = h / 2;
						//g.data = root;
						//g.data = data;
					//	update();
					//});

					//var root = response;
					update();

					function redraw() {
						console.log("zoom", d3.event.translate, d3.event.scale);
						vis.attr("transform",
							"translate(" + d3.event.translate + ")"
							+ " scale(" + d3.event.scale + ")");
					}



					function update() {

					console.log("update");
					console.log(root.toSource());

						var nodes = flatten(root),
							links = d3.layout.tree().links(nodes);

						var nodes = flatten(root),
							links = d3.layout.tree().links(nodes);

						// Restart the force layout.
						force
							.nodes(nodes)
							.links(links)
							.start();

						// Update the links
						link = vis.selectAll("line.link")
							.data(links, function(d) { return d.target.id; });

						// Enter any new links.
						link.enter().insert("svg:line", ".node")
							.attr("class", "link")
							.style("stroke-dasharray", function(d){if(d.target["Mesh Role"]=="MESH AP"){return ("3,3");}})
							.style("stroke-opacity", function(d){if(d.target["Mesh Role"]=="MESH AP"){return "1";}})
							.style("stroke-width", function(d){if(d.target["Mesh Role"]=="MESH AP"){return "1px";}})
							.style("stroke", function(d){if(d.target["Mesh Role"]=="MESH AP" && d.target["status"]=="connected"){return "#999";}else if(d.target["status"]=="disconnected"){return "#CF000A"}})
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						// Exit any old links.
						link.exit().remove();

						// Update the nodes
						node = vis.selectAll("circle.node")
							.data(nodes, function(d) { return d.id; })
							.style("fill", color);

						node.transition()
							.attr("r", function(d) { return ((d.children && d.children!='')||d["Mesh Role"]=="ROOT AP")  ? 10 : 7; });


						// Enter any new nodes.
						var nod=node.enter().append("svg:circle")
							.attr("class", "node")
							.style("stroke","#CF000A")
							.classed("nodeclicked",false)
							.classed("disconnodeclick",false)
							.attr("cx", function(d) { return d.x; })
							.attr("cy", function(d) { return d.y; })
							.attr("r", function(d) { return (d.children && d.children!='') ? 10 : 7; })
							.style("fill", color)
							.classed("disconnodeclick",false)
							.on("click", click)

							.on("mouseenter",function(d){ Tooltip(d);})
							.on("mouseleave",function(d){TooltipRemove(d);})
							.call(force.drag);

						node.exit().remove();






					}



					function flatten(root) {
						var nodes = [], i = 0;

						function recurse(node) {
							if (node.children) node.size = node.children.reduce(function(p, v) {
								//model=v["Model/Serial Num"] temp=model.split("\/");
								return p + recurse(v); }, 0);
							if (!node.id) node.id = ++i;
							nodes.push(node);
							return node.size;
						}

						root.size = recurse(root);
						return nodes;
					}


					function color(d) {
						return d._children ? "#3182bd" // collapsed package
							:
							d.children ? "#c6dbef" // expanded package
								:
								"#fd8d3c"; // leaf node
					}






// Toggle children on click by switching around values on _children and children.
					function click(d) {
						if (d3.event.defaultPrevented) return; // ignore drag
						if (d.children) {
							d._children = d.children;
							d.children = null;
						} else {
							d.children = d._children;
							d._children = null;
						}
						//
						update();
					}

					function Tooltip(data){
						console.log(data.x);
						console.log(data.y);
						d3.select("#tooltip")
							.attr("class","hover")
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px")

							.html(TooltipContent(data));
					}

					function TooltipRemove(data){

						d3.select("#tooltip").attr("class","").text("");
					}

					function TooltipContent(data){
						console.log(data);
						return "<table id='tooltip'><tr><td>"+data["APMAC"]+"<td></tr></table>"

					}

					function tick() {
						link.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });


						node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
							.attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y));  });



					}



				});

				break;

		}

	}

	HttpRequest('get','getdocs',window.flaskURL+'getdocs','');
	HttpRequest('get','get_switch_info',window.flaskURL+'get_switch_info','');
	//HttpRequest('get','get_flow',window.flaskURL+'get_all_flows','');

});
