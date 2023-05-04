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

		getLegend(svg, ['Short Games','Medium Games','Long Games'], ['green','red','steelblue']);

 		// Add the line
 		svg.append("path")
 			.datum(data_short)
 			.attr("fill", "none")
 			.attr("stroke", "green")
 			.attr("stroke-width", 1.5)
 			.attr("d", d3.line()
 				.x(function(d) {
 					return x(d.year)
 				})
 				.y(function(d) {
 					return y(d.amount)
 				})
 			)
		// Add the line
		svg.append("path")
		.datum(data_medium)
		.attr("fill", "none")
		.attr("stroke", "red")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) {
				return x(d.year)
			})
			.y(function(d) {
				return y(d.amount)
			})
		)

		// Add the line
		svg.append("path")
		.datum(data_long)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) {
				return x(d.year)
			})
			.y(function(d) {
				return y(d.amount)
			})
		)
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

 // on init the first visualization is rendered
 drawFirstVis();
