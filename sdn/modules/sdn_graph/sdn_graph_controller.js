window[appName].controller('sdn_graph_controller',function($rootScope,$scope,$state,$stateParams,$http,$window,$location,$q,$filter)	{

	console.log("Called");
var mousex = 0;
var mousey = 0;

var w = 1280,
    h = 800,
    node,
    link,
    root;

var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return d._rows ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._rows ? 100 : 200; })
    .size([w, h - 160]);

var vis = d3.select("#visual").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json(window.flaskURL+'get_toplogy', function(json) {
  root = json;
  root.rows = root.rows;

  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2 - 80;
  update();
});


function update()
        {
                var nodes = flatten(root),
                links = d3.layout.tree().links(nodes);

          // Restart the force layout.
                force
                      .nodes(nodes)
                      .links(links)
                      .start();

          // Update the links…
                link = vis.selectAll("line.link")
                      .data(links, function(d) { return d.target.id; });

          // Enter any new links.
                link.enter().insert("svg:line", ".node")
                      .attr("class", "link")
                      .attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });

          // Exit any old links.
                link.exit().remove();

          // Update the nodes…
                node = vis.selectAll("circle.node")
                      .data(nodes, function(d) { return d.id; })
                      .style("fill", color);

                node.transition()
                      .attr("r", function(d) { return 10; });

          // Enter any new nodes.
                node.enter().append("svg:circle")
                      .attr("class", "node")
                      .attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; })
                      .attr("r", function(d) { return 10; })
                      .style("fill", color)
                      .on("click", click)
                      //.on("mouseenter",function(d){ Tooltip(d);})
                      //.on("mouseleave",function(d){ TooltipRemove(d);})
                      .call(force.drag);

          // Exit any old nodes.
                node.exit().remove();
        }



function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Color leaf nodes orange, and packages white or blue.
        function color(d)
        {
                if(d.rows==undefined)
                {
                        return "green"
                }

                return "red";

        }


// Toggle rows on click.
        function click(d)
        {
            console.log(d.id);
            HttpRequest('post','get_flow_info',window.flaskURL+'get_flow_info',{"flow_id": d.id});

            if (d.rows)
                {
                    HttpRequest('post','get_flow_info',window.flaskURL+'get_flow_info',{"flow_id": d.id});
                        d._rows = d.rows;
                        d.rows = null;
                }
                else
                {
                        d.rows = d._rows;
                        d._rows = null;
                }
                update();

        }


// Returns a list of all nodes under the root.
function flatten(root)
        {
                var nodes = [], i = 0;

                function recurse(node)
                {
                        if (node.rows) node.size = node.rows.reduce(function(p, v) { return p + recurse(v); }, 0);
                        if (!node.id) node.id = ++i;
                        nodes.push(node);
                        return node.size;
                }

                root.size = recurse(root);
                return nodes;
        }



       function Tooltip(data){
                d3.select("#tooltip")
                        .attr("class","hover")
                        .style("x",(mousex+40)+'px')
                        .style("y",(mousey-60)+"px")
                        .style("left",(mousex+40)+'px')
                        .style("top",(mousey-60)+"px")
                        .text(TooltipContent(data));
        }


        function TooltipRemove(data)
        {
            d3.select("#tooltip").attr("class","").text("");
        }

        function TooltipContent(data)
        {
                console.log(data.toSource());
                var htmlstr="<table>";
                htmlstr=htmlstr+"<tr><td>";
                htmlstr=htmlstr+"Tooltip";
                htmlstr=htmlstr+"</td></tr>";
                htmlstr=htmlstr+"</table>";
                return htmlstr;
        }


	if($scope.logged_in==undefined || $scope.logged_in=="")
	{
		window.location = "index.html";
	}

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


			case 'get_switch':

				$scope.switch_detail = response["rows"][1]["id"];

				break;

			case 'get_switch_info':
				$scope.switch_info = response;
				$scope.flow_info = response["rows"];
				break;

            case 'get_flow_info':
                alert(response.toSource());
                break;
		}

	}

	HttpRequest('get','get_switch',window.flaskURL+'get_switch','');

	HttpRequest('get','get_switch_info',window.flaskURL+'get_switch_info','');
	//HttpRequest('get','get_flow',window.flaskURL+'get_all_flows','');

});
