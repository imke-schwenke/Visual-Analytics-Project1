 // set the dimensions and margins of the graph
 var margin = {
 		top: 10,
 		right: 30,
 		bottom: 30,
 		left: 60
 	},
 	width = 460 - margin.left - margin.right,
 	height = 400 - margin.top - margin.bottom;

 function draw() {


 	// append the svg object to the body of the page
 	var svg = d3.select("#canvas")
 		.append("svg")
 		.attr("width", width + margin.left + margin.right)
 		.attr("height", height + margin.top + margin.bottom)
 		.append("g")
 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


 	//Read the data
 	d3.json("/boardgames_40.json").then(function(data) {
 		data = processBoardGameData(data);
 		//console.log(data);

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
 					return x(d.year)
 				})
 				.y(function(d) {
 					console.log(d['rating']['rating']);
 					return y(d['rating']['rating'])
 				})
 			)
 	})
 }

 function ScaleX(data) {
 	var x = d3.scaleTime()
 		.domain(d3.extent(data, function(d) {
 			return d.year;
 		}))
 		.range([0, width + 200]);

 	return x
 }

 function ScaleY(data) {
 	var y = d3.scaleLinear()
 		.domain([0, d3.max(data, function(d) {
 			return +d['rating']['rating']
 		})])
 		.range([height + 240, 0]);
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


 	return JSON.stringify(boardGamesProcessed);

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
