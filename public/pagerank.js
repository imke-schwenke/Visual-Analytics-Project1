// set the dimensions and margins of the graph
const marginPagerank = {
        top: 1000,
        right: 0,
        bottom: 30,
        left: 1500,
    },
    widthPagerank = 260 - marginPagerank.left - marginPagerank.right,
    heightPagerank = 200 - marginPagerank.top - marginPagerank.bottom;

// append the svg object to the body of the page
const svg = d3
    .select('#canvas6')
    .append('svg')
    .attr('width', widthPagerank + marginPagerank.left + marginPagerank.right)
    .attr('height', heightPagerank + marginPagerank.top + marginPagerank.bottom)
    .append('g')
    .attr(
        'transform',
        `translate(${marginPagerank.left}, ${marginPagerank.top})`
    );

function raise(line) {
    d3.select(line).raise();
}

function drawPageRankVis(graphObject) {
    svg.selectAll('*').remove();

    // title background
    svg.append('rect')
        .attr('x', widthPagerank + 85)
        .attr('y', heightPagerank - 150)
        .attr('width', 720)
        .attr('height', 30)
        .attr('fill', '#4c9786');

    // title
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', widthPagerank + 800)
        .attr('y', heightPagerank - 130)
        .text(
            'Significant Boardgames based on the recommendations using the pagerank method'
        )
        .style('font-size', '20px')
        .style('fill', 'white')
        .style('font-weight', 'bold');

    // Pagerank Disclaimer
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', widthPagerank + 800)
        .attr('y', heightPagerank - 100)
        .text(
            '* Actual calculated pagerank has been multiplied with 1000 for readability purposes.'
        );

    // arrowhead
    markerBoxWidth = 10;
    markerBoxHeight = 10;
    refX = markerBoxWidth / 2;
    refY = markerBoxHeight / 2;

    markerWidth = markerBoxWidth / 2;
    markerHeight = markerBoxHeight / 2;

    arrowPoints = [
        [0, 0],
        [0, 10],
        [10, 5],
    ];

    // arrowhead
    marker = svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'red')
        .attr('fill', 'red');

    // Initialize the links
    const link = svg
        .selectAll('line')
        .data(graphObject.links)
        .join('line')
        .style('stroke', '#aaa')
        .style('stroke-width', 1)

        .style('opacity', function (d) {
            if (d.filter) {
                return '10%';
            } else {
                raise(this);
                return '100%';
            }
        })
        .on('mouseover', function (d, i) {
            if (i.filter) {
                return;
            }
            raise(this);

            d3.select(this).style('marker-end', 'url(#arrow)');

            d3.select(this).style('stroke-width', 3);
            d3.select(this).style('stroke', 'red');

            tooltip
                .style('visibility', 'visible')
                .html(
                    `
                Source: ${i.source.id} <br/>
                Target: ${i.target.id} <br/>
                `
                )
                .style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY - 15 + 'px');
        })
        .on('mouseout', function (d, i) {
            if (i.filter) {
                return;
            }

            d3.select(this).style('marker-end', 'none');
            node.dispatch('raiseNode');

            d3.select(this).style('stroke-width', 1);
            d3.select(this).style('stroke', '#aaa');

            tooltip.style('visibility', 'hidden');
        });

    // console.log(graphObject.nodes);

    // Initialize the nodes
    const node = svg
        .selectAll('circle')
        .data(graphObject.nodes)
        .join('circle')
        .style('fill', '#69b3a2')
        .attr('r', function (d) {
            return d.rank * 1000;

            // return 20;
        })
        .on('mouseover', function (d, i) {
            if (i.filter) {
                return;
            }
            d3.select(this).attr('r', d3.select(this).attr('r') * 1.5);
            d3.select(this).style('fill', '#4c9786');

            tooltip
                .style('visibility', 'visible')
                .html(
                    `
                <b>
                Pagerank: ${(i.rank * 1000).toFixed(2)} 
                </b> <br/> <hr/>
                Node: ${i.id} <br/>
                ID: ${i.idNumber} <br/> 
                Title: ${i.title} <br/> 
                Year: ${i.year} <br/> 
                Rank: ${i.originalRank}
                `
                )
                .style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY - 15 + 'px');
        })
        .on('mouseout', function (d, i) {
            if (i.filter) {
                return;
            }
            d3.select(this).attr('r', d3.select(this).attr('r') / 1.5);
            d3.select(this).style('fill', '#69b3a2');

            tooltip.style('visibility', 'hidden');
        })
        .on('raiseNode', function () {
            raise(this);
        })
        .style('opacity', function (d) {
            if (d.filter) {
                return '30%';
            } else {
                return '100%';
            }
        });

    // Tooltip to be shown on mouse hover
    var tooltip = d3
        .select('#canvas6')
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px');

    // Let's list the force we wanna apply on the network
    const simulation = d3
        .forceSimulation(graphObject.nodes) // Force algorithm is applied to data.nodes
        .force(
            'link',
            d3
                .forceLink() // This force provides links between nodes
                .id(function (d) {
                    return d.id;
                }) // This provide  the id of a node
                .links(graphObject.links) // and this the list of links
        )
        .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force('center', d3.forceCenter(widthPagerank / 2, heightPagerank / 2)) // This force attracts nodes to the center of the svg area
        .on('end', ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link.attr('x1', function (d) {
            return d.source.x;
        })
            .attr('y1', function (d) {
                return d.source.y;
            })
            .attr('x2', function (d) {
                return d.target.x;
            })
            .attr('y2', function (d) {
                return d.target.y;
            });

        node.attr('cx', function (d) {
            return d.x + 6;
        }).attr('cy', function (d) {
            return d.y - 6;
        });
    }
}

function calculatePageRank(graph, dampingFactor) {
    const numNodes = Math.max(...graph.flat()) + 1;
    const ranks = new Array(numNodes).fill(1);
    const iterations = 20;

    for (let iteration = 0; iteration < iterations; iteration++) {
        const newRanks = new Array(numNodes).fill(0);

        for (let node = 0; node < numNodes; node++) {
            const incomingNodes = getIncomingNodes(graph, node);

            for (const incomingNode of incomingNodes) {
                const incomingEdges = getOutgoingEdges(graph, incomingNode);
                const numEdges = incomingEdges.length;
                const rank = ranks[incomingNode];

                newRanks[node] += rank / numEdges;
            }
        }

        for (let node = 0; node < numNodes; node++) {
            newRanks[node] = 1 - dampingFactor + dampingFactor * newRanks[node];
        }

        ranks.splice(0, numNodes, ...newRanks);
    }

    normalizeRanks(ranks);

    return ranks;
}

function getIncomingNodes(graph, node) {
    const incomingNodes = [];

    for (const edge of graph) {
        if (edge[1] === node) {
            incomingNodes.push(edge[0]);
        }
    }

    return incomingNodes;
}

function getOutgoingEdges(graph, node) {
    const outgoingEdges = [];

    for (const edge of graph) {
        if (edge[0] === node) {
            outgoingEdges.push(edge);
        }
    }

    return outgoingEdges;
}

function normalizeRanks(ranks) {
    const sum = ranks.reduce((total, rank) => total + rank, 0);

    for (let i = 0; i < ranks.length; i++) {
        ranks[i] /= sum;
    }
}

function startLoadingCountdown() {
    document.getElementById('loading').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementById('loading').style.visibility = 'hidden';
    }, 4000);
}

function processPageRankData(minPagerank, maxPagerank) {
    startLoadingCountdown();

    // load data
    d3.json('/boardgames_100.json').then(function (boardgames) {
        let processedBoardgames = [];

        for (var i = 0; i < boardgames.length; i++) {
            processedBoardgames.push({
                node: i,
                id: boardgames[i].id,
                recommendations: boardgames[i].recommendations.fans_liked,
                title: boardgames[i].title,
                year: boardgames[i].year,
                originalRank: boardgames[i].rank,
            });
        }

        // console.log(processedBoardgames);

        let graph = [];

        for (var i in processedBoardgames) {
            for (var j in processedBoardgames[i].recommendations) {
                for (var k in processedBoardgames) {
                    if (
                        processedBoardgames[k].id ===
                        processedBoardgames[i].recommendations[j]
                    ) {
                        graph.push([
                            processedBoardgames[i].node,
                            processedBoardgames[k].node,
                        ]);
                    }
                }
            }
        }

        // console.log(graph);

        const dampingFactor = 0.85;

        const ranks = calculatePageRank(graph, dampingFactor);

        const boardgamesRanked = [];

        for (let i = 0; i < ranks.length; i++) {
            if (ranks[i] !== 0) {
                // console.log(`Knoten ${i}: Rang ${ranks[i]}`);
                boardgamesRanked.push({
                    node: i,
                    rank: ranks[i],
                    id: processedBoardgames[i].id,
                    title: processedBoardgames[i].title,
                    year: processedBoardgames[i].year,
                    originalRank: processedBoardgames[i].originalRank,
                });
            }
        }

        // console.log(boardgamesRanked);
        // console.log(boardgamesRanked.toSorted((a, b) => a.rank - b.rank));

        const nodes = [];
        for (var i = 0; i < processedBoardgames.length; i++) {
            nodes.push({
                id: i,
                rank: boardgamesRanked[i].rank,
                idNumber: boardgamesRanked[i].id,
                title: boardgamesRanked[i].title,
                year: boardgamesRanked[i].year,
                originalRank: boardgamesRanked[i].originalRank,
                filter:
                    boardgamesRanked[i].rank * 1000 < minPagerank ||
                    boardgamesRanked[i].rank * 1000 > maxPagerank
                        ? true
                        : false,
            });
        }
        // console.log(boardGameIDs);
        // console.log(nodes);

        const links = [];
        for (var i = 0; i < graph.length; i++) {
            links.push({
                source: graph[i][0],
                target: graph[i][1],
                filter:
                    document.querySelector('input[name="rbLinks"]:checked')
                        .value === 'incoming'
                        ? nodes[graph[i][1]].filter
                            ? true
                            : false
                        : nodes[graph[i][0]].filter
                        ? true
                        : false,
            });
        }
        // console.log(links);

        // console.log(document.querySelector('input[name="rbLinks"]:checked'));

        const graphObject = {
            nodes: nodes,
            links: links,
        };

        drawPageRankVis(graphObject);
    });
}

function closeFilterForPagerank() {
    processPageRankData(0, 32);
    let minValue = document.getElementById('minPagerank');
    minValue.textContent = 0;
    let maxValue = document.getElementById('maxPagerank');
    maxValue.textContent = 32;
    let minSliderValue = document.getElementById('sliderMin');
    minSliderValue.value = 0;
    let maxSliderValue = document.getElementById('sliderMax');
    maxSliderValue.value = 32;
}

processPageRankData(0, 32);
