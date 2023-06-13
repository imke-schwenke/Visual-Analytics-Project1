var yScaleLowerBounds = 0; // 0-8.16
var lowerOverlap = 0;

// set the dimensions and margins of the graph
var margin = {
        top: 150,
        right: 30,
        bottom: 30,
        left: 60,
    },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function drawFirstVis() {
    // append the svg object to the body of the page
    var svg = d3
        .select('#canvas')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //add Title, Subtitle and Axis Labels for Visualization
    addTitle(svg, 'Amount of published Games over the Years');
    addSubtitle(svg);
    addAxisTitle(svg, 'Years', 'Amount');

    //Read the data
    d3.json('/boardgames_40.json').then(function (data) {
        data = processBoardGameData(data);
        data_long = longTemporalProcessing(data);
        data_medium = mediumTemporalProcessing(data);
        data_short = shortTemporalProcessing(data);

        var shortIsChecked = document.getElementById('cbShort').checked;
        var mediumIsChecked = document.getElementById('cbMedium').checked;
        var longIsChecked = document.getElementById('cbLong').checked;

        if (longIsChecked) {
            // scale x values
            var x = ScaleX(data_long);
            // create and append x Axis
            getXAxis(svg, data_long);
            // scale y values
            var y = ScaleY(data_long);
            // create and append x Axis
            getYAxis(svg, data_long);
        } else if (mediumIsChecked) {
            // scale x values
            var x = ScaleX(data_medium);
            // create and append x Axis
            getXAxis(svg, data_medium);
            // scale y values
            var y = ScaleY(data_medium);
            // create and append x Axis
            getYAxis(svg, data_medium);
        } else {
            // scale x values
            var x = ScaleX(data_short);
            // create and append x Axis
            getXAxis(svg, data_short);
            // scale y values
            var y = ScaleY(data_short);
            // create and append x Axis
            getYAxis(svg, data_short);
        }

        // getLegend(svg, ['Short Games (0-60min)','Medium Games (61-90min)','Long Games (>90min)'], ['green','red','steelblue']);

        if (document.getElementById('cbShort').checked) {
            // Add the line short
            svg.append('path')
                .datum(data_short)
                .attr('fill', 'none')
                .attr('stroke', '#FFC107')
                .attr('stroke-width', 1.5)
                .attr(
                    'd',
                    d3
                        .line()
                        .x(function (d) {
                            return x(d.year);
                        })
                        .y(function (d) {
                            return y(d.amount);
                        })
                );
        }

        if (document.getElementById('cbMedium').checked) {
            // Add the line medium
            svg.append('path')
                .datum(data_medium)
                .attr('fill', 'none')
                .attr('stroke', '#1E88E5')
                .attr('stroke-width', 1.5)
                .attr(
                    'd',
                    d3
                        .line()
                        .x(function (d) {
                            return x(d.year);
                        })
                        .y(function (d) {
                            return y(d.amount);
                        })
                );
        }

        if (document.getElementById('cbLong').checked) {
            // Add the line long
            svg.append('path')
                .datum(data_long)
                .attr('fill', 'none')
                .attr('stroke', '#D81B60')
                .attr('stroke-width', 1.5)
                .attr(
                    'd',
                    d3
                        .line()
                        .x(function (d) {
                            return x(d.year);
                        })
                        .y(function (d) {
                            return y(d.amount);
                        })
                );
        }
    });
}

// function for scaling x
function ScaleX(data) {
    var x = d3
        .scaleTime()
        .domain(
            d3.extent(data, function (d) {
                return d.year;
            })
        )
        .range([0, width + 400]);

    return x;
}

// function for scaling y
function ScaleY(data) {
    var y = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(data, function (d) {
                return +d.amount;
            }),
        ])
        .range([height + 380, 0]);
    return y;
}

// function for creating the x Axis
function getXAxis(svg, data) {
    let x = ScaleX(data);
    var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
    svg.append('g').attr('transform', `translate(0, 600)`).call(xAxis);
}

// function for creating the y Axis
function getYAxis(svg, data) {
    let y = ScaleY(data);
    var yAxis = d3.axisLeft(y);
    svg.append('g').call(yAxis);
}

// function for adding axis labels
function addAxisTitle(svg, xLabel, yLabel) {
    // x Axis label
    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width + 400)
        .attr('y', height + 425)
        .text(xLabel);

    // y Axis label
    svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', -35)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text(yLabel);
}

// function for appending legend
function getLegend(svg, textArray, colorArray) {
    for (let i = 0; i < textArray.length; i++) {
        svg.append('circle')
            .attr('cx', 2 * width + 100)
            .attr('cy', 130 + i * 30)
            .attr('r', 6)
            .style('fill', colorArray[i]);
        svg.append('text')
            .attr('x', 2 * width + 120)
            .attr('y', 130 + i * 30)
            .text(textArray[i])
            .style('font-size', '15px')
            .attr('alignment-baseline', 'middle');
    }
}

// function for adding a title for the visualization in the svg
function addTitle(svg, title) {
    const subtitle = document.createElement('h7');
    subtitle.style.fontFamily = 'inherit';
    subtitle.style.textAlign = 'left';
    subtitle.textContent = 'Imke Schwenke, 16. Januar 2023';
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2 + 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('text-decoration', 'underline')
        .text(title);
}

// function for adding a subtitle for the visualization in the svg
function addSubtitle(svg) {
    svg.append('text')
        .attr('x', 100)
        .attr('y', 2 * height + 225)
        .style('text-anchor', 'middle')
        .text('Cologne, May 2023');
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
        averageGameDuration =
            (boardGame['minplaytime'] + boardGame['maxplaytime']) / 2;

        // set the duration category according to the average game lenght
        if (averageGameDuration <= 60) {
            averageGameDuration = 'short';

            if (
                !boardGamesProcessed[boardGame['year']].hasOwnProperty('short')
            ) {
                boardGamesProcessed[boardGame['year']]['short'] = {
                    amountOfGames: 0,
                    avg_rating: 0,
                    avg_num_of_reviews: 0,
                    avg_minplaytime: 0,
                    avg_maxplaytime: 0,
                };
            }
        } else if (averageGameDuration <= 90) {
            averageGameDuration = 'medium';

            if (
                !boardGamesProcessed[boardGame['year']].hasOwnProperty('medium')
            ) {
                boardGamesProcessed[boardGame['year']]['medium'] = {
                    amountOfGames: 0,
                    avg_rating: 0,
                    avg_num_of_reviews: 0,
                    avg_minplaytime: 0,
                    avg_maxplaytime: 0,
                };
            }
        } else {
            averageGameDuration = 'long';

            if (
                !boardGamesProcessed[boardGame['year']].hasOwnProperty('long')
            ) {
                boardGamesProcessed[boardGame['year']]['long'] = {
                    amountOfGames: 0,
                    avg_rating: 0,
                    avg_num_of_reviews: 0,
                    avg_minplaytime: 0,
                    avg_maxplaytime: 0,
                };
            }
        }

        // initialize values
        // boardGamesProcessed[boardGame["year"]][averageGameDuration] = {"amountOfGames":0, "avg_rating": 0, "avg_num_of_reviews": 0, "avg_minplaytime": 0, "avg_maxplaytime" : 0};
        entry = boardGamesProcessed[boardGame['year']][averageGameDuration];

        // increase the count for games for this year
        entry['amountOfGames'] += 1;

        // TODO: fix berechnung des ratings, s.d. das Rating mit Anzahl der Reviews gewichtet werden
        entry['avg_rating'] =
            entry['avg_rating'] +
            (boardGame['rating']['rating'] - entry['avg_rating']) /
                entry['amountOfGames'];

        entry['avg_minplaytime'] =
            entry['avg_minplaytime'] +
            (boardGame['minplaytime'] - entry['avg_minplaytime']) /
                entry['amountOfGames'];
        entry['avg_maxplaytime'] =
            entry['avg_maxplaytime'] +
            (boardGame['maxplaytime'] - entry['avg_maxplaytime']) /
                entry['amountOfGames'];
        entry['avg_num_of_reviews'] =
            entry['avg_num_of_reviews'] +
            (boardGame['rating']['num_of_reviews'] -
                entry['avg_num_of_reviews']) /
                entry['amountOfGames'];
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
        if (!years.includes(boardGame['year'])) {
            years.push(boardGame['year']);
        }
    }

    // sort the years in ascending order, to ease handling later on
    years.sort();
    return years;
}

// function which continues the data processing for the line graph for long games
function longTemporalProcessing(data) {
    result = [];
    amount = 0;
    for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(data)[i]).length; j++) {
            if (Object.keys(Object.values(data)[i])[j] == 'long') {
                let temp = Object.values(data)[i]['long'];
                amount += temp['amountOfGames'];
                result.push({ year: Object.keys(data)[i], amount: amount });
            }
        }
    }
    return result;
}

// function which continues the data processing for the line graph for long games
function mediumTemporalProcessing(data) {
    result = [];
    amount = 0;
    for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(data)[i]).length; j++) {
            if (Object.keys(Object.values(data)[i])[j] == 'medium') {
                let temp = Object.values(data)[i]['medium'];
                amount += temp['amountOfGames'];
                result.push({ year: Object.keys(data)[i], amount: amount });
            }
        }
    }
    return result;
}

// function which continues the data processing for the line graph for short games
function shortTemporalProcessing(data) {
    result = [];
    amount = 0;
    for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(data)[i]).length; j++) {
            if (Object.keys(Object.values(data)[i])[j] == 'short') {
                let temp = Object.values(data)[i]['short'];
                amount += temp['amountOfGames'];
                result.push({ year: Object.keys(data)[i], amount: amount });
            }
        }
    }
    return result;
}

// function which continues the data processing for the line graph
function ratingProcessing(data) {
    rating_long = 0;
    rating_medium = 0;
    rating_short = 0;
    index_long = 0;
    index_medium = 0;
    index_short = 0;

    for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(data)[i]).length; j++) {
            if (Object.keys(Object.values(data)[i])[j] == 'long') {
                let temp = Object.values(data)[i]['long'];
                rating_long += temp['avg_rating'];
                index_long++;
            }
            if (Object.keys(Object.values(data)[i])[j] == 'medium') {
                let temp = Object.values(data)[i]['medium'];
                rating_medium += temp['avg_rating'];
                index_medium++;
            }
            if (Object.keys(Object.values(data)[i])[j] == 'short') {
                let temp = Object.values(data)[i]['short'];
                rating_short += temp['avg_rating'];
                index_short++;
            }
        }
    }
    result = [
        {
            duration: 'Short Duration (0-60min)',
            rating: rating_short / index_short,
        },
        {
            duration: 'Medium Duration (61-90min)',
            rating: rating_medium / index_medium,
        },
        {
            duration: 'Long Duration (>90min)',
            rating: rating_long / index_long,
        },
    ];
    return result;
}

function drawSecondVis() {
    // append the svg object to the body of the page
    var svg = d3
        .select('#canvas2')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //add Title, Subtitle and Axis Labels for Visualization
    addTitle(svg, 'Average Rating per Duration');

    //Read the data
    d3.json('/boardgames_40.json').then(function (data) {
        data = processBoardGameData(data);
        data = ratingProcessing(data);

        // scale x values
        //var subgroups = Object.keys(data[0]).slice(0)
        const x2 = d3
            .scaleBand()
            .range([0, width + 400])
            .domain(
                data.map(function (d) {
                    return d.duration;
                })
            );

        // scale y values
        var y = d3
            .scaleLinear(2)
            .domain([
                yScaleLowerBounds,
                d3.max(data, function (d) {
                    return d.rating;
                }),
            ])
            .range([height + 380, 0]);

        // create and append y Axis
        var yAxis = d3.axisLeft(y);
        svg.append('g').call(yAxis);

        // getLegend(svg, ['Short Games (0-60min)','Medium Games (61-90min)','Long Games (>90min)'], ['green','red','steelblue']);

        var color = d3
            .scaleOrdinal()
            .domain(
                data.map(function (d) {
                    return d.duration;
                })
            )
            .range(['#FFC107', '#1E88E5', '#D81B60']);

        // Bars
        svg.selectAll('mybar')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return x2(d.duration) + 25;
            })
            .attr('y', function (d) {
                return y(d.rating);
            })
            .attr('width', x2.bandwidth() - 50)
            .attr('height', function (d) {
                return y(0) - y(d.rating) - lowerOverlap;
            })
            .attr('fill', function (d) {
                return color(d.duration);
            });

        svg.selectAll('mybar')
            .data(data)
            .enter()
            .append('text')
            .attr('x', function (d) {
                return x2(d.duration) + 35;
            })
            .attr('y', function (d) {
                return y(d.rating) + 25;
            })
            .attr('width', 20)
            .style('font-size', '20px')
            .text(function (d) {
                return d.rating.toFixed(2);
            });

        svg.append('rect')
            .attr('x', 0)
            .attr('y', 600)
            .attr('width', width + 400)
            .attr('height', 200)
            .attr('fill', 'white');

        addSubtitle(svg);
        addAxisTitle(svg, 'Duration', 'Rating');

        // create and append x Axis
        var xAxis = d3.axisBottom(x2);
        svg.append('g').attr('transform', `translate(0, 600)`).call(xAxis);
    });
}
function drawClusterVis() {
    // Tooltip to be shown on mouse hover
    var tooltip = d3
        .select('#canvas4')
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px');

    // append the svg object to the body of the page
    var svg = d3
        .select('#canvas4')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    addTitle(svg, 'Clustering of Games for Minimum and Maximum Playtime');
    //reading in the data
    d3.json('boardgames_100.json').then(function (data) {
        data = preprocessClusters(data, 3);
        //console.log(data);

        var x = d3
            .scaleLinear()
            // for normalized values
            // .domain([0, 1])
            // for non noramlized values
            .domain([0, 180])
            .range([0, width + 400]);
        svg.append('g')
            .attr('transform', `translate(0, 600)`)
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
            .scaleLinear()
            // for normalized values
            // .domain([0, 1])
            // for non normalized values
            .domain([0, 300])
            .range([height + 380, 0]);
        svg.append('g').call(d3.axisLeft(y));
        // X axis label
        svg.append('text')
            .attr('text-anchor', 'end')
            .attr('x', width)
            .attr('y', height + 420)
            .text('Minimum Playtime');

        // Y axis label:
        svg.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 15)
            .attr('x', 0)
            .text('Maximum Playtime');

        //add dots
        svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                tooltip.html(d.x);
                return x(d.x);
            })
            .attr('cy', function (d) {
                // console.log('Y: ' + d.y);
                return y(d.y);
            })
            .attr('r', 3)
            .style(
                'fill',
                //"green")
                function (d) {
                    // console.log(d);
                    switch (d.centroid_index) {
                        case 0:
                            //console.log("Color: green, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
                            return '#D81B60';

                        case 1:
                            //console.log("Color: red, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
                            return '#FFC107';

                        case 2:
                            //console.log("Color: blue, Index: " + d.centroid_index + ", X: " + d.x + ", Y: " + d.y);
                            return '#1E88E5';
                    }
                }
            )
            // tooltip mouse hover events
            .on('mouseover', function (d, i) {
                d3.select(this).attr('r', 6);
                tooltip
                    .style('visibility', 'visible')
                    .html(`Min Playtime: ${i.x} <br/> Max. Playtime: ${i.y}`)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 15 + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.style('visibility', 'hidden');
                d3.select(this).attr('r', 3);
            });
    });
    // .style("fill", "green")

    //})
}

function LDA() {
    // Tooltip to be shown on mouse hover
    var tooltip = d3
        .select('#canvas3')
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px');

    // append the svg object to the body of the page
    var svg = d3
        .select('#canvas3')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //add Title, Subtitle and Axis Labels for Visualization
    addTitle(svg, 'LDA for the Top 25 Games and Top 100 Games');
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', width + 400)
        .attr('y', height + 425)
        .text('Used Dimesions: minplaytime, maxplayers, minage');
    addSubtitle(svg);
    getLegend(svg, ['Top 25 Games', 'Top 100 Games'], ['#D81B60', '#FFC107']);

    //reading in the data
    d3.json('boardgames_100.json').then(function (data) {
        // data processing
        data = preprocessLDAData(data);
        var top_25 = data.slice(0, 25);
        var top_100 = data.slice(25, 100);

        // Add X axis
        var x = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function (d) {
                    return d.x;
                }),
            ])
            .range([0, width + 400]);
        svg.append('g')
            .attr('transform', `translate(0, 0)`)
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
            .scaleLinear()

            .domain([
                d3.min(data, function (d) {
                    return d.y;
                }),
                0,
            ])
            .range([height + 380, 0]);
        svg.append('g').call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll('dot')
            .data(top_25)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(d.x);
            })
            .attr('cy', function (d) {
                return y(d.y);
            })
            .attr('r', 3)
            .style('fill', '#D81B60')
            // tooltip mouse hover events
            .on('mouseover', function (d, i) {
                d3.select(this).attr('r', 6);
                tooltip
                    .style('visibility', 'visible')
                    .html(`x: ${i.x.toFixed(2)} <br/> y: ${i.y.toFixed(2)}`)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 15 + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.style('visibility', 'hidden');
                d3.select(this).attr('r', 3);
            });

        // Add dots
        svg.append('g')
            .selectAll('dot')
            .data(top_100)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return x(d.x);
            })
            .attr('cy', function (d) {
                return y(d.y);
            })
            .attr('r', 3)
            .style('fill', '#FFC107')
            // tooltip mouse hover events
            .on('mouseover', function (d, i) {
                d3.select(this).attr('r', 6);
                tooltip
                    .style('visibility', 'visible')
                    .html(`x: ${i.x.toFixed(2)} <br/> y: ${i.y.toFixed(2)}`)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 15 + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.style('visibility', 'hidden');
                d3.select(this).attr('r', 3);
            });
    });
}

function preprocessLDAData(data) {
    var matrix = data.map((a) => [a.minplaytime, a.maxplayers, a.minage]);
    var classes = [];
    var counter = 0;
    while (counter < 25) {
        classes.push('Top 25');
        counter += 1;
    }
    while (counter < 100) {
        classes.push('Top 100');
        counter += 1;
    }
    const X = druid.Matrix.from(matrix); // X is the data as object of the Matrix class.
    const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }); //2 dimensions, can use more.
    const result = reductionLDA.transform();
    var result_array = result.to2dArray;
    result_array = result_array.map((a) => [a[0], a[1]]);
    var obj_result = [];
    for (var i = 0; i < result_array.length; i++) {
        obj_result.push({ x: result_array[i][0], y: result_array[i][1] });
    }
    return obj_result;
}

// draw visualizations
drawFirstVis();
drawSecondVis();
drawClusterVis();
LDA();

// switch canvas
function changeInfo(evt, info) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(info).style.display = 'block';
    evt.currentTarget.className += ' active';

    if (info == 'Details') {
        document.getElementById('legend').style.visibility = 'hidden';
        document.getElementById('zoomButtons').style.visibility = 'visible';

        updateVisualization(2);
    } else if (info == 'Details2') {
        document.getElementById('legend').style.visibility = 'hidden';
        document.getElementById('zoomButtons').style.visibility = 'hidden';

        updateVisualization(3);
    } else if (info == 'Details3') {
        document.getElementById('legend').style.visibility = 'hidden';
        document.getElementById('zoomButtons').style.visibility = 'hidden';

        updateVisualization(4);
    } else if (info == 'PageRankTab') {
        document.getElementById('legend').style.visibility = 'hidden';
        document.getElementById('zoomButtons').style.visibility = 'hidden';

        updateVisualization(6);
    } else {
        document.getElementById('cbShort').checked = true;
        document.getElementById('cbMedium').checked = true;
        document.getElementById('cbLong').checked = true;

        document.getElementById('legend').style.visibility = 'visible';
        document.getElementById('zoomButtons').style.visibility = 'hidden';

        updateVisualization(1);
    }
}

function updateScale(zoomType) {
    d3.select('svg').remove();

    if (zoomType == -1) {
        if (yScaleLowerBounds > 0) {
            yScaleLowerBounds--;
        }
    }
    if (zoomType == 1) {
        if (yScaleLowerBounds < 8) {
            yScaleLowerBounds++;
        }
    }

    document.getElementById('zoomText').value = yScaleLowerBounds + '/8';

    updateVisualization(2);
}

function updateVisualization(vis) {
    d3.select('svg').remove();

    if (vis == 1) {
        drawFirstVis();
    }
    if (vis == 2) {
        drawSecondVis();
    }
    if (vis == 3) {
        LDA();
    }
    if (vis == 4) {
        drawClusterVis();
    }
    if (vis == 6) {
        processPageRankData();
    }
}
