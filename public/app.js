 // set the dimensions and margins of the graph
 var margin = {
 		top: 150,
 		right: 30,
 		bottom: 30,
 		left: 60
 	},
 	width = 460 - margin.left - margin.right,
 	height = 400 - margin.top - margin.bottom;

 function drawFirstVis() {
	d3.select("svg").remove();

 	// append the svg object to the body of the page
 	var svg = d3.select("#canvas")
 		.append("svg")
 		.attr("width", width + margin.left + margin.right)
 		.attr("height", height + margin.top + margin.bottom)
 		.append("g")
 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		

	//add Title, Subtitle and Axis Labels for Visualization
	addTitle(svg, "Amount of published Games over the Years");
	addSubtitle(svg);
	addAxisTitle(svg, "Years", "Amount") 

 	//Read the data
 	d3.json("/boardgames_40.json").then(function(data) {
 		data = processBoardGameData(data);
		data_long = longTemporalProcessing(data);
		data_medium = mediumTemporalProcessing(data);
		data_short = shortTemporalProcessing(data);

 		// scale x values
 		const x = ScaleX(data_long);

 		// create and append x Axis
 		getXAxis(svg, data_long);

 		// scale y values
 		const y = ScaleY(data_long);

 		// create and append x Axis
 		getYAxis(svg, data_long);

		// getLegend(svg, ['Short Games (0-60min)','Medium Games (61-90min)','Long Games (>90min)'], ['green','red','steelblue']);

		if(document.getElementById("cbShort").checked){
			// Add the line short
			svg.append("path")
			.datum(data_short)
			.attr("fill", "none")
			.attr("stroke", "rgb(160, 213, 104)")
			.attr("stroke-width", 1.5)
			.attr("d", d3.line()
				.x(function(d) {
					return x(d.year)
				})
				.y(function(d) {
					return y(d.amount)
				})
			)
		}

 		
		if(document.getElementById("cbMedium").checked){
			// Add the line medium
		svg.append("path")
		.datum(data_medium)
		.attr("fill", "none")
		.attr("stroke", "rgb(79, 193, 232)")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) {
				return x(d.year)
			})
			.y(function(d) {
				return y(d.amount)
			})
		)
		}	
		
		if(document.getElementById("cbLong").checked){
			// Add the line long
		svg.append("path")
		.datum(data_long)
		.attr("fill", "none")
		.attr("stroke", "rgb(237, 85, 100)")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) {
				return x(d.year)
			})
			.y(function(d) {
				return y(d.amount)
			})
		)
		}
		
 	})
 }

 // function for scaling x
 function ScaleX(data) {
 	var x = d3.scaleTime()
	 .domain(d3.extent(data, function(d) { return d.year; }))
	 .range([ 0, width +400]);

 	return x
 }

 // function for scaling y
 function ScaleY(data) {
 	var y = d3.scaleLinear()
 		.domain([0, d3.max(data, function(d) {
 			return +d.amount
 		})])
 		.range([height + 380, 0]);
 	return y;
 }

 // function for creating the x Axis
 function getXAxis(svg, data) {
 	let x = ScaleX(data)
 	var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
 	svg.append("g")
 		.attr("transform", `translate(0, 600)`)
 		.call(xAxis)
 }

 // function for creating the y Axis
 function getYAxis(svg, data) {
 	let y = ScaleY(data)
 	var yAxis = d3.axisLeft(y)
 	svg.append("g")
 		.call(yAxis)
 }

 // function for adding axis labels
 function addAxisTitle(svg, xLabel, yLabel) {
	// x Axis label
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width +400)
    .attr("y", height +425)
    .text(xLabel);

	// y Axis label
	svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -35)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(yLabel);
}

// function for appending legend
function getLegend(svg, textArray, colorArray){
	
	for (let i = 0; i< textArray.length; i++){
		svg.append("circle").attr("cx",2*width+100).attr("cy",130+i*30).attr("r", 6).style("fill", colorArray[i])
		svg.append("text").attr("x", 2*width+120).attr("y", 130+ i*30).text(textArray[i]).style("font-size", "15px").attr("alignment-baseline","middle")
	}
	
}

// function for adding a title for the visualization in the svg
function addTitle(svg, title){
    const subtitle = document.createElement('h7');
    subtitle.style.fontFamily = "inherit";
    subtitle.style.textAlign = "left";
    subtitle.textContent = "Imke Schwenke, 16. Januar 2023";
    svg.append("text")
		.attr("x", (width / 2))             
		.attr("y", 0 - (margin.top / 2)+25)
		.attr("text-anchor", "middle")  
		.style("font-size", "16px") 
		.style("text-decoration", "underline")  
		.text(title);
}

// function for adding a subtitle for the visualization in the svg
function addSubtitle(svg){
	svg.append("text")
        .attr("x", 100)
        .attr("y",2*height+225)
        .style("text-anchor", "middle")
        .text("Cologne, May 2023");
}

 function processBoardGameData(boardGames) {
 	boardGamesProcessed = {};

 	years = getYearsForBoardGames(boardGames);

 	// add an entry for every for which there is boardgame data
 	for (const year of years) {

 		//boardGamesProcessed[year] = {"amountOfGames":0, "avg_rating": 0, "avg_num_of_reviews": 0, "avg_minplaytime": 0, "avg_maxplaytime" : 0};
 		boardGamesProcessed[year] = {};
 	}

 	// add difficulty array / barrier
 	for (var key in boardGames) {
 		boardGame = boardGames[key];

 		// average game duration is set as the middleground between the miniumm and maximum playtime
 		averageGameDuration = (boardGame["minplaytime"] + boardGame["maxplaytime"]) / 2;

 		// set the duration category according to the average game lenght
 		if (averageGameDuration <= 60) {
 			averageGameDuration = "short"


 			if (!boardGamesProcessed[boardGame["year"]].hasOwnProperty("short")) {
 				boardGamesProcessed[boardGame["year"]]["short"] = {
 					"amountOfGames": 0,
 					"avg_rating": 0,
 					"avg_num_of_reviews": 0,
 					"avg_minplaytime": 0,
 					"avg_maxplaytime": 0
 				};

 			}
 		} else if (averageGameDuration <= 90) {
 			averageGameDuration = "medium"

 			if (!boardGamesProcessed[boardGame["year"]].hasOwnProperty("medium")) {
 				boardGamesProcessed[boardGame["year"]]["medium"] = {
 					"amountOfGames": 0,
 					"avg_rating": 0,
 					"avg_num_of_reviews": 0,
 					"avg_minplaytime": 0,
 					"avg_maxplaytime": 0
 				};

 			}
 		} else {
 			averageGameDuration = "long"

 			if (!boardGamesProcessed[boardGame["year"]].hasOwnProperty("long")) {
 				boardGamesProcessed[boardGame["year"]]["long"] = {
 					"amountOfGames": 0,
 					"avg_rating": 0,
 					"avg_num_of_reviews": 0,
 					"avg_minplaytime": 0,
 					"avg_maxplaytime": 0
 				};

 			}

 		}

 		// initialize values
 		// boardGamesProcessed[boardGame["year"]][averageGameDuration] = {"amountOfGames":0, "avg_rating": 0, "avg_num_of_reviews": 0, "avg_minplaytime": 0, "avg_maxplaytime" : 0};
 		entry = boardGamesProcessed[boardGame["year"]][averageGameDuration];

 		// increase the count for games for this year
 		entry["amountOfGames"] += 1;

 		// TODO: fix berechnung des ratings, s.d. das Rating mit Anzahl der Reviews gewichtet werden
 		entry["avg_rating"] = entry["avg_rating"] + ((boardGame["rating"]["rating"] - entry["avg_rating"]) / entry["amountOfGames"]);

 		entry["avg_minplaytime"] = entry["avg_minplaytime"] + ((boardGame["minplaytime"] - entry["avg_minplaytime"]) / entry["amountOfGames"]);
 		entry["avg_maxplaytime"] = entry["avg_maxplaytime"] + ((boardGame["maxplaytime"] - entry["avg_maxplaytime"]) / entry["amountOfGames"]);
 		entry["avg_num_of_reviews"] = entry["avg_num_of_reviews"] + ((boardGame["rating"]["num_of_reviews"] - entry["avg_num_of_reviews"]) / entry["amountOfGames"]);
 	}

 	//return JSON.stringify(boardGamesProcessed);
	return boardGamesProcessed;

 }

 // returns a list of years for the list of board games
 function getYearsForBoardGames(boardGames) {

 	years = [];

 	for (var key in boardGames) {
 		boardGame = boardGames[key];

 		// if the year of the current game is not included yet, add it
 		if (!years.includes(boardGame["year"])) {
 			years.push(boardGame["year"]);
 		}

 	}

 	// sort the years in ascending order, to ease handling later on
 	years.sort();
 	return years;
 }

 // function which continues the data processing for the line graph for long games
 function longTemporalProcessing(data){
	result=[];
	amount = 0;
	for (let i = 0; i < Object.keys(data).length; i++) {
		for(let j = 0; j < Object.keys(Object.values(data)[i]).length; j++){
			if(Object.keys(Object.values(data)[i])[j] == 'long'){
				let temp = Object.values(data)[i]['long'];
				amount += temp['amountOfGames'];
				result.push({year:Object.keys(data)[i], amount: amount})
			}

		}
	}
	return result
 }

// function which continues the data processing for the line graph for long games
function mediumTemporalProcessing(data){
	result=[];
	amount = 0;
	for (let i = 0; i < Object.keys(data).length; i++) {
		for(let j = 0; j < Object.keys(Object.values(data)[i]).length; j++){
			if(Object.keys(Object.values(data)[i])[j] == 'medium'){
				let temp = Object.values(data)[i]['medium'];
				amount += temp['amountOfGames'];
				result.push({year:Object.keys(data)[i], amount: amount})
			}

		}
	}
	return result
 }

// function which continues the data processing for the line graph for short games
function shortTemporalProcessing(data){
	result=[];
	amount = 0;
	for (let i = 0; i < Object.keys(data).length; i++) {
		for(let j = 0; j < Object.keys(Object.values(data)[i]).length; j++){
			if(Object.keys(Object.values(data)[i])[j] == 'short'){
				let temp = Object.values(data)[i]['short'];
				amount += temp['amountOfGames'];
				result.push({year:Object.keys(data)[i], amount: amount})
			}

		}
	}
	return result
}

// function which continues the data processing for the line graph
function ratingProcessing(data){
	rating_long = 0;
	rating_medium = 0;
	rating_short = 0;
	index_long = 0;
	index_medium = 0;
	index_short = 0;

	for (let i = 0; i < Object.keys(data).length; i++) {
		for(let j = 0; j < Object.keys(Object.values(data)[i]).length; j++){
			if(Object.keys(Object.values(data)[i])[j] == 'long'){
				let temp = Object.values(data)[i]['long'];
				rating_long += temp['avg_rating'];
				index_long++;
			}
			if(Object.keys(Object.values(data)[i])[j] == 'medium'){
				let temp = Object.values(data)[i]['medium'];
				rating_medium += temp['avg_rating'];
				index_medium++;
			}
			if(Object.keys(Object.values(data)[i])[j] == 'short'){
				let temp = Object.values(data)[i]['short'];
				rating_short += temp['avg_rating'];
				index_short++;
			}

		}
	}
	result = [{duration: 'Short Duration (0-60min)', rating: rating_short / index_short},
				{duration: 'Medium Duration (61-90min)', rating: rating_medium / index_medium},
				{duration: 'Long Duration (>90min)', rating: rating_long / index_long}]
	return result
}

function drawSecondVis(){
  	// append the svg object to the body of the page
 	var svg = d3.select("#canvas2")
	 .append("svg")
	 .attr("width", width + margin.left + margin.right)
	 .attr("height", height + margin.top + margin.bottom)
	 .append("g")
	 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//add Title, Subtitle and Axis Labels for Visualization
	addTitle(svg, "Average Rating per Duration");
	addSubtitle(svg);
	addAxisTitle(svg, "Duration", "Rating");

	//Read the data
	 d3.json("/boardgames_40.json").then(function(data) {
		data = processBoardGameData(data);
		data = ratingProcessing(data)
   
		// scale x values
		//var subgroups = Object.keys(data[0]).slice(0)
		const x2 = d3.scaleBand()
			.range([ 0, width +400])
			.domain(data.map(function(d) { return d.duration; }))
	 			
		// create and append x Axis
		var xAxis = d3.axisBottom(x2)
		svg.append("g")
			.attr("transform", `translate(0, 600)`)
			.call(xAxis);
   
		// scale y values
		var y = d3.scaleLinear()
 			.domain([0, d3.max(data, function(d) {return d.rating; })])
 			.range([height + 380, 0]);
   
		// create and append y Axis
		var yAxis = d3.axisLeft(y)
 			svg.append("g")
 				.call(yAxis)
   
		// getLegend(svg, ['Short Games (0-60min)','Medium Games (61-90min)','Long Games (>90min)'], ['green','red','steelblue']);

		var color = d3.scaleOrdinal()
		 .domain(data.map(function(d) { return d.duration; }))
		 .range(['rgb(160, 213, 104)', 'rgb(79, 193, 232)','rgb(237, 85, 100)'])
		
		// Bars
		svg.selectAll("mybar")
			.data(data)
			.enter()
			.append("rect")
  			.attr("x", function(d) { return x2(d.duration)+25; })
  			.attr("y", function(d) { return y(d.rating); })
  			.attr("width", x2.bandwidth()-50)
  			.attr("height", function(d) { return y(0)-y(d.rating); })
			.attr("fill", function (d) { return color(d.duration); })

		svg.selectAll("mybar")
			.data(data)
			.enter()
			.append("text")
			.attr("x", function(d) { return x2(d.duration) + 35; })
			.attr("y", function(d) { return y(d.rating) +25 ; })
        	.attr('width', 20)
        	.style("font-size", "20px")
        	.text(function (d) { return d.rating.toFixed(2)})

	})	
}

function drawThirdVis(){

	// append the svg object to the body of the page
	var svg = d3.select("#canvas3")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
	//reading in the data
	d3.json("boardgames_100.json").then(function(data) {
	  //console.log(data)
	  // let's checkout fantasy games
	  var processedData = preprocessData100(data)
	  var top_25 = processedData[0]
	  var top_50 = processedData[1]
	  var top_100 = processedData[2]
	  //console.log(top_25)
	  //console.log(top_50)
	  //console.log(top_100)
	
  
	  // graph
  
	  // Add X axis
	  var x = d3.scaleLinear()
	  .domain([0, d3.max(data, function(d) {
		return d.minage
		})])
	  .range([ 0, width ]);
	  svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x));
  
	  // Add Y axis
	  var y = d3.scaleLinear()
	  
		.domain([0, d3.max(data, function(d) {
		  return d.minplaytime
		  })])
	  .range([ height, 0]);
	  svg.append("g")
	  .call(d3.axisLeft(y));
  
	  // Add dots
	  svg.append('g')
	  .selectAll("dot")
	  .data(top_25)
	  .enter()
	  .append("circle")
		.attr("cx", function (d) { return x(d.minage); } )
		.attr("cy", function (d) { return y(d.minplaytime); } )
		.attr("r", 1.5)
		.style("fill", "#69b3a2")
  
	  
	  // Add dots
	  svg.append('g')
	  .selectAll("dot")
	  .data(top_50)
	  .enter()
	  .append("circle")
		.attr("cx", function (d) { return x(d.minage); } )
		.attr("cy", function (d) { return y(d.minplaytime); } )
		.attr("r", 1.5)
		.style("fill", "red")
  
		// Add dots
	  svg.append('g')
	  .selectAll("dot")
	  .data(top_100)
	  .enter()
	  .append("circle")
		.attr("cx", function (d) { return x(d.minage); } )
		.attr("cy", function (d) { return y(d.minplaytime); } )
		.attr("r", 1.5)
		.style("fill", "green")
  
	  })
	
  }

function drawClusterVis(){

	// append the svg object to the body of the page
	var svg = d3.select("#canvas4")
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  	addTitle(svg, "Clustering of Gamest for min-, and max playtime");
	//reading in the data
	d3.json("boardgames_100.json").then(function(data) {
		data = preprocessClusters(data, 3);
		console.log(data);
	
  
	    var x = d3.scaleLinear()
	// for normalized values
   // .domain([0, 1])
	    // for non noramlized values
	.domain([0, 180])
    .range([ 0, width ]);
 	svg.append("g")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
  	// for normalized values
   // .domain([0, 1])
  	// for non normalized values
    .domain([0, 300])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  // Add dots
    	svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 35)
    .text("minplaytime");

// Y axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+ 15)
    .attr("x", 0)
    .text("maxplaytime")


  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 3)
     .style('fill', 
     	//"green")
     	function(d) {
     	switch(d.centroid_index) {
     		case 0:
     			//console.log("Color: green, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
	        	return "#D81B60"

	        case 1:
     			//console.log("Color: red, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
	        	return "#FFC107"

	        case 2:
     			//console.log("Color: blue, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
	        	return "#1E88E5"
	      }

	     })
});
     // .style("fill", "green")

	  //})
  }

function preprocessData100(data){
	top_25= []
	top_50 = []
	top_100 = []
	for(let i=0; i<data.length; i++){
	  if(data[i].rank <26){
		top_25.push(data[i]);
	  }
	  else if(data[i].rank <51){
		top_50.push(data[i]);
	  }
	  else top_100.push(data[i]);
	}
	
	return [top_25, top_50, top_100]
}
// draw visualizations
drawFirstVis();
drawSecondVis();
drawThirdVis();
drawClusterVis();

// switch canvas
function changeInfo(evt, info) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(info).style.display = "block";
    evt.currentTarget.className += " active";

    // dont show filter
	if(info == "Details" || info == "Details3"){
		document.getElementById("cbShort").checked = true;
      document.getElementById("cbMedium").checked = true;
      document.getElementById("cbLong").checked = true;

	  document.getElementById("legend").style.visibility = "hidden";
	} else {
		document.getElementById("cbShort").disabled = false;
      document.getElementById("cbMedium").disabled = false;
      document.getElementById("cbLong").disabled = false;

	  document.getElementById("legend").style.visibility = "visible";

	}

	

	  // draw visualizations
drawFirstVis();
drawSecondVis();
}


