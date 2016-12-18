var width = 1000;
var height = 1000;
var gridWidth = width / 10;
var gridHeight = height / 10;

var gridX = d3.scaleLinear().domain([0, gridWidth]).range([0, width]);
var gridY = d3.scaleLinear().domain([0, gridHeight]).range([0, height]);

var svg = d3.select("svg");

svg.style("width", width);
svg.style("height", height);

var lineFunc = d3.line().x(function(d) {return d[0]; }).y(function(d) {return d[1]; })
function drawGrid() {
    for (var x = 0; x < gridWidth; x = x+1) {
        svg.append("path").attr("d",
                lineFunc([[gridX(x), 0], [gridX(x), height]])).attr("stroke", "blue")
        console.log(x)

    }
    for (var y = 0; y < gridHeight; y = y+1) {
        svg.append("path").attr("d",
                lineFunc([[0, gridY(y)], [width, gridY(y)]])).attr("stroke", "blue")
        console.log(x)

    }
}
drawGrid()


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

    //circle.exit().remove()
}


var initX = d3.randomUniform(50, width - 50)();
var initY = d3.randomUniform(20, height- 20)();

var pData = [[initX, initY]]
drawPoints(pData)

//var arc = svg.selectAll("circle").data([[initX, initY]])

//
initRandDist = d3.randomUniform(minDistance, minDistance * 2)()
initRandArch = d3.randomUniform(0, Math.PI * 2)

var lineFunction = d3.line().x(function(d) { return d[0]; } ).y(function(d) { return d[1]; } )

var arc = d3.arc().innerRadius(minDistance).outerRadius(minDistance * 2).startAngle(0).endAngle(2 * Math.PI)

var arcG = svg.append("g").attr("transform", "translate(" + initX + "," + initY + ")")
arcG.append("path").attr("class", "arc").attr("d", arc)

//var arcEnter = arcG.enter().append("circle");
var pData = [[initX, initY], [200, 200]]


var backgroundGrid = [];
for (var i = 0; i < gridWidth; i = i + 1) {
    backgroundGrid[i] = []
}
console.log(backgroundGrid)
