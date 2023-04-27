 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 60},
 width = 460 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;
 
function draw() {
   

    // append the svg object to the body of the page
    var svg = d3.select("#canvas")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    
    //Read the data
    d3.json("/boardgames_40.json").then(function(data) {
        console.log(data);
    
        // scale x values
        const x = ScaleX(data);

        // create and append x Axis
        getXAxis(svg, data);

        // scale y values
        const y = ScaleY(data);

        // create and append x Axis
        getYAxis(svg, data);
        
    // format variables:
        // function(d){
        //     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
        // },


  //Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { 
        console.log(d.year)
        return x(d.year) })
      .y(function(d) { 
        console.log(d['rating']['rating']);
        return y(d['rating']['rating']) })
      )
})}

function ScaleX(data) {
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([0, width+200]);

    return x
}

function ScaleY(data) {
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d){ return +d['rating']['rating']})])
        .range([ height + 240 , 0]);
    return y;
}

function getXAxis(svg, data) {
    
    // Initialize the X axis
    let x = ScaleX(data)
    var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))

    svg.append("g")
        .attr("transform", `translate(0, 600)`)
        .call(xAxis)
}

function getYAxis(svg, data) {
    
    // Initialize the Y axis
    let y = ScaleY(data)
    var yAxis = d3.axisLeft(y)

    svg.append("g")
        .call(yAxis)
}