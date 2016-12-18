var width = 720;
var height = 600;

var svg = d3.select("svg");

svg.style("width", width);
svg.style("height", height);

//var circle = svg.selectAll("circle").data([32, 57, 112, 293]);

//var circleEnter = circle.enter().append("circle");

//circleEnter.attr("cy", 60);
//circleEnter.attr("cx", function(d, i) { return i * 100 + 30; });
//circleEnter.attr("r", function(d) { return Math.sqrt(d); });

var minDistance = 10;
var k = 30;

function drawPoints(data) {
    console.log(data)

    var circle = svg.selectAll("circle")
        .data(data);

    console.log("data", circle.data())

    var circleEnter = circle.enter().append("circle");

    circleEnter.attr("cx", function(d) {
        console.log(d)
        return d[0];
    });
    circleEnter.attr("cy", function(d) { return d[1]; });
    circleEnter.attr("r", function(d, i) { return 4 * (i+1); });

    circleEnter.merge(circle)

    circle.exit().remove()
}


var initX = d3.randomUniform(50, width - 50)();
var initY = d3.randomUniform(20, height- 20)();

var pData = [[initX, initY]]
drawPoints(pData)
var initX = d3.randomUniform(50, width - 50)();
var initY = d3.randomUniform(20, height- 20)();
var pData = [[initX, initY]]
drawPoints(pData)

//var arc = svg.selectAll("circle").data([[initX, initY]])

//
initRandDist = d3.randomUniform(minDistance, minDistance * 2)()
initRandArch = d3.randomUniform(0, Math.PI * 2)

var lineFunction = d3.line().x(function(d) { return d[0]; } ).y(function(d) { return d[1]; } )

//var arc = d3.arc().innerRadius(minDistance).outerRadius(minDistance * 2).startAngle(0).endAngle(2 * Math.PI)

//var arcG = svg.append("g").attr("transform", "translate(" + initX + "," + initY + ")")
//arcG.append("path").attr("class", "arc").attr("d", arc)

//var arcEnter = arc.enter().append("circle");
//
//
var pData = [[initX, initY], [200, 200]]

drawPoints(pData)
