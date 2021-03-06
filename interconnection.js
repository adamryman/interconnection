var width = 500;
var height = 500;
var minDistance = 25;
var gridWidth = width / (minDistance/Math.sqrt(2));
var gridHeight = height / (minDistance/Math.sqrt(2));
var dotSize = 3;

// from actual xy to gridxy
var gridX = d3.scaleLinear().domain([0, width]).range([0, gridWidth]);
var gridY = d3.scaleLinear().domain([0, height]).range([0, gridHeight]);

// from gridxy to actualxy
var actualX = d3.scaleLinear().domain([0, gridWidth]).range([0, width]);
var actualY  = d3.scaleLinear().domain([0, gridHeight]).range([0, height]);

var svg = d3.select("svg");

svg.style("width", width);
svg.style("height", height);

var lineFunc = d3.line().x(function(d) {return d[0]; }).y(function(d) {return d[1]; })

function drawGrid() {
    for (var x = 0; x < gridWidth; x = x+1) {
        svg.append("path")
            .attr("d", lineFunc([[actualX(x), 0], [actualX(x), height]]))
            .attr("stroke", "blue")
    }
    for (var y = 0; y < gridHeight; y = y+1) {
        svg.append("path")
            .attr("d",lineFunc([[0, actualY(y)], [width, actualY(y)]]))
            .attr("stroke", "blue")
    }
}
//drawGrid()


//var circle = svg.selectAll("circle").data([32, 57, 112, 293]);

//var circleEnter = circle.enter().append("circle");

//circleEnter.attr("cy", 60);
//circleEnter.attr("cx", function(d, i) { return i * 100 + 30; });
//circleEnter.attr("r", function(d) { return Math.sqrt(d); });

var k = 30;

function drawPoints(data) {
    var t = d3.transition().delay(200)

    var circle = svg.selectAll("circle")
        .data(data);


    circle.exit().transition(t).attr("r", 0).remove()

    circle.transition(t).attr("style", "fill:red")

    circle.enter().append("circle")
        .attr("cx", function(d) { return d[0]; })
        .attr("cy", function(d) { return d[1]; })
        .attr("r", dotSize)
        .attr("style", function(d, i) {
            if (d[2] == 1) {
                return "fill:red"
            }
            return "fill:green"
    }).merge(circle);
}


var initX = d3.randomUniform(50, width - 50)();
var initY = d3.randomUniform(20, height- 20)();
//var initX = 200;
//var initY = 20;

var pData = [[initX, initY, 1]];
drawPoints(pData);

//var arc = svg.selectAll("circle").data([[initX, initY]])

//
initRandDist = d3.randomUniform(minDistance, minDistance * 2)();
initRandArch = d3.randomUniform(0, Math.PI * 2);

var lineFunction = d3.line().x(function(d) { return d[0]; } ).y(function(d) { return d[1]; } )

var backgroundGrid = [];
for (var x = 0; x < gridWidth; x = x + 1) {
    backgroundGrid[x] = []
    for (var y = 0; y < gridHeight; y = y + 1) {
        backgroundGrid[x][y] = -1
    }
}
console.log(backgroundGrid)

function RandomPoint(inXY) {
    var r = d3.randomUniform(minDistance, 2 * minDistance)();
    var theta = d3.randomUniform(0, 2 * Math.PI)();

    var x = r * Math.cos(theta)
    var y = r * Math.sin(theta)

    x = inXY[0] + x
    y = inXY[1] + y

    while (x < 0 || x > width || y < 0 || y > height) {
        r = d3.randomUniform(minDistance, 2 * minDistance)();
        theta = d3.randomUniform(0, 2 * Math.PI)();

        x = r * Math.cos(theta)
        y = r * Math.sin(theta)

        x = inXY[0] + x
        y = inXY[1] + y
    }

    return [x, y]
}



function PointToGrid(inXY) {
    return [Math.floor(gridX(inXY[0])), Math.floor(gridY(inXY[1]))];
}

initXY = PointToGrid(pData[0]);
console.log(initXY[0]);
backgroundGrid[initXY[0]][initXY[1]] = 0
console.log("background", backgroundGrid)
var list = []
var activeList = []
list.push(pData[0])
activeList.push(0)

var arc = d3.arc().innerRadius(minDistance).outerRadius(minDistance * 2).startAngle(0).endAngle(2 * Math.PI)

var arcG = svg.append("g")
arcG.append("path").attr("class", "arc").attr("stroke", "red").attr("fill", "none").attr("d", arc)

var arcEnter = arcG.enter().append("circle");

function testCanidates(inXY, callback) {
    for (var i = 0; i < k; i++) {
        //console.log("Canidate ", i)
        var xy = RandomPoint(inXY);

        if (validateCanidate(xy)) {
            callback(true, xy)
            return
        }
    }
    callback(false)
}


function validateCanidate(xy) {
    var gridXY = PointToGrid(xy);
    if (backgroundGrid[gridXY[0]][gridXY[1]] > -1) {
        //console.log( "Someone is home already");
        //console.log("Bad canidate");
        return false
    }
    for (var x = -1; x < 2; x++ ){
        for(var y = -1; y < 2; y++){
            var px = gridXY[0] + x;
            var py = gridXY[1] + y;
            //console.log("checking", px, py)
            if (px > -1 && py > -1 && px < gridWidth && py < gridHeight) {
                n = backgroundGrid[px][py];
                if (n > -1) {
                    //console.log("Neighbor found")
                    neigh = list[n];
                    diffX = Math.abs(neigh[0] - xy[0])
                    diffY = Math.abs(neigh[1] - xy[1])
                    dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
                    //console.log("distance:", dist)
                    if (dist < minDistance) {
                        //console.log("Bad canidate")
                        return false
                    }
                }
            }
        }
    }
    //console.log("Good canidate")
    //console.log("Canidate postion", xy)
    //console.log()
    //console.log("Anyone home?", backgroundGrid[gridXY[0]][gridXY[1]])
    //console.log()
    backgroundGrid[gridXY[0]][gridXY[1]] = list.length
    return true
}

function Next() {
    if (activeList.length < 1) {
        console.log("Active List Empty")
        console.log("Done")
        arcG.remove()
        return
    }
    var next = Math.floor(Math.random() * activeList.length);
    nextXY = list[activeList[next]];
    arcG.attr("transform", "translate(" + nextXY[0] + "," + nextXY[1] + ")");
    //console.log("Checking:", nextXY)
    testCanidates(nextXY, function(valid, position) {
            if (valid) {
                svg.append("path")
                    .attr("d",lineFunc([[nextXY[0], nextXY[1]], [position[0], position[1]]]))
                    .attr("stroke", "blue")
                list.push(position)
                activeList.push(list.length - 1)
                pData.push(position)
            } else {
                //console.log("Removing", list[activeList[next]])
                activeList.splice(next - 1, 1);
                //console.log("Total:", list.length, "Active:", activeList.length)
            }
            drawPoints(pData)
            window.setTimeout(Next, 2000 / list.length)
    });
}

//for(var i = 0; i < 50000; i++) {
    Next()
//}
