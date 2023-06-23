// set the dimensions and margins of the graph
const marginGraphanalysis = {
    top: 1000,
    right: 0,
    bottom: 30,
    left: 1500,
},
widthGraphanalysis = 260 - marginGraphanalysis.left - marginGraphanalysis.right,
heightGraphanalysis = 200 - marginGraphanalysis.top - marginGraphanalysis.bottom;

// append the svg object to the body of the page
const svgGraphAnalysis = d3
.select('#testCanvas')
.attr('id', 'svg5')
.append('svg')
.attr('width', widthGraphanalysis + marginGraphanalysis.left + marginGraphanalysis.right)
.attr('height', heightGraphanalysis + marginGraphanalysis.top + marginGraphanalysis.bottom)
.append('g')
.attr(
    'transform',
    `translate(${marginGraphanalysis.left}, ${marginGraphanalysis.top})`
    );

        // Tooltip to be shown on mouse hover
const tooltip = d3
.select('#svg5')
.append('div')
.attr('id', 'tooltipGraphVis')
.style('position', 'absolute')
.style('visibility', 'hidden')
.style('background-color', 'white')
.style('border', 'solid')
.style('border-width', '1px')
.style('border-radius', '5px')
.style('padding', '10px');

function raiseGraphVis(line) {
    d3.select(line).raise();
}

function drawGraphAnalysisVis(graphObject) {
    svgGraphAnalysis.selectAll('*').remove();

    // title background
    svgGraphAnalysis.append('rect')
    .attr('x', widthGraphanalysis + 85)
    .attr('y', heightGraphanalysis - 170)
    .attr('width', 720)
    .attr('height', 30)
    .attr('fill', '#4c9786');

    // title
    svgGraphAnalysis.append('text')
    .attr('text-anchor', 'end')
    .attr('x', widthGraphanalysis + 740)
    .attr('y', heightGraphanalysis - 150)
    .text(
        'Graph Analysis of recommended boardgames and related categories'
        )
    .style('font-size', '20px')
    .style('fill', 'white')
    .style('font-weight', 'bold');

    // arrowhead
    markerBoxWidth = 10;
    markerBoxHeight = 10;
    refX = markerBoxWidth / 2;
    refY = markerBoxHeight / 2;

    markerWidth = markerBoxWidth / 2;
    markerHeight = markerBoxHeight / 2;

    arrowPointsGraphVis = [
        [0, 0],
        [0, 10],
        [10, 5],
        ];

    // arrowhead
    markerGraphvis = svgGraphAnalysis
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
    .attr('d', d3.line()(arrowPointsGraphVis))
    .attr('stroke', 'red')
    .attr('fill', 'red');

    // // Initialize the links
    const linkGraphvis = svgGraphAnalysis
    .selectAll('line')
    .data(graphObject.links)
    .join('line')
    .style('stroke', '#aaa')
    .style('stroke-width', 1)

    .style('opacity', function (d) {
        if (d.filter) {
            return '10%';
        } else {
            raiseGraphVis(this);
            return '100%';
        }
    })
    .on('mouseover', function (d, i) {
        if (i.filter) {
            return;
        }
        raiseGraphVis(this);

        d3.select(this).style('marker-end', 'url(#arrow)');

        d3.select(this).style('stroke-width', 3);
        d3.select(this).style('stroke', 'red');

        tooltip
        .style('visibility', 'visible')
        .html(
            `
            Source: ${i.source_name} <br/>
            Target: ${i.target_name} <br/>
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
        nodeGraphvis.dispatch('raiseNode');

        d3.select(this).style('stroke-width', 1);
        d3.select(this).style('stroke', '#aaa');

        tooltip.style('visibility', 'hidden');
    });


    // Initialize the nodes
    const nodeGraphvis = svgGraphAnalysis
    .selectAll('circle')
    .data(graphObject.nodes)
    .join('circle')
    .style('fill', function (d) {
        if (d.node_type == "game") {
            return "#D81B60";
        } else {
            return "#1E88E5";
        }
    })
    .attr('r', 10)
    .on('click', function (d, i) {

        if (i.clicked) {
            if (i.filter || i.node_type == "category") {
                return;
            }
            d3.select(this).attr('r', d3.select(this).attr('r') / 1.5);
            d3.select(this).style('fill', function (d) {
                if (d.node_type == "game") {
                    return "#D81B60";
                } else {
                    return "#1E88E5";
                }
            })

            if(i.node_type == "game") {
                for (outgoing in i.outgoings) {
                    unHighlightNode(i.outgoings[outgoing]);
                }
            }
            i.clicked = false;
        } else {
                    if (i.filter || i.node_type == "category") {
            return;
        }
            d3.select(this).attr('r', d3.select(this).attr('r') * 1.5);
            d3.select(this).style('fill', function (d) {
                if (d.node_type == "game") {
                    return "#941342";
                } else {
                    return "#1360a4";
                }
            })
            if(i.node_type == "game") {
                for (outgoing in i.outgoings) {
                    highlightNode(i.outgoings[outgoing]);
                }
            }

                i.clicked = true;
        }

    })


    .on('mouseover', function (d, i) {
        tooltip
        .style('visibility', 'visible')
        .html(
            `
            <b>
            ${i.name}
            </b> <br/> <hr/>
            Node: ${i.node_id} <br/>
            Type: ${i.node_type} <br/>
            `
            )
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 15 + 'px');
    })


    .on('mouseout', function (d, i) {

     tooltip.style('visibility', 'hidden');
 })
    .on('raiseNode', function () {
        raiseGraphVis(this);
    })
    .style('opacity', function (d) {
        if (d.filter) {
            return '30%';
        } else {
            return '100%';
        }
    });

    // Let's list the force we wanna apply on the network
    const graphvissimulation = d3
        .forceSimulation(graphObject.nodes) // Force algorithm is applied to data.nodes
        .force(
            'link',
            d3
                .forceLink() // This force provides links between nodes
                .id(function (d) {
                    return d.node_id;
                }) // This provide  the id of a node
                .links(graphObject.links) // and this the list of links
                )
        .force('charge', d3.forceManyBody().strength(-200)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force('center', d3.forceCenter(widthGraphanalysis / 2, heightGraphanalysis / 2)) // This force attracts nodes to the center of the svg area
        .on('end', tickedGraphAnalysis);

// This function is run at each iteration of the force algorithm, updating the nodes position.
        function tickedGraphAnalysis() {
            linkGraphvis.attr('x1', function (d) {
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

            nodeGraphvis.attr('cx', function (d) {
                return d.x + 6;
            }).attr('cy', function (d) {
                return d.y - 6;
            });
        }
    }



    function startLoadingCountdownGraphVis() {
        document.getElementById('loadingGraphVis').style.visibility = 'visible';
        setTimeout(function () {
            document.getElementById('loadingGraphVis').style.visibility = 'hidden';
        }, 4000);
    }




    function processGraphVisData () {
        startLoadingCountdownGraphVis();
        d3.json('/boardgames_100.json').then(function (boardgames) {
            const nodes = [];
            var links = [];
            var categories = [];

            i = 0;
        // iteration to gather all nodes
            for (game of boardgames) {
            // create node for game
                nodes.push({node_id: i, game_id: game.id, name: game.title, node_type: "game", outgoings: []});
                i++;

            // gather unique categories for all games
                for (category of game.types.categories) {
                    if (!categories.includes(category)) {
                        categories.push(category);
                    }
                }

            }

        // create categories as nodes
            for (category of categories) {
                nodes.push({node_id: i, name: category.name, node_type: "category"});
                i++;
            }

        // iteration to create all links with node id
        // TODO: replace game ids with node ids, create links for categories
            for (game of boardgames) {
            //console.log("Aktuelle Game: " + game.title)
            // lookup the node id for the current game
                game_node = nodes.find(node => node.game_id == game.id);  
                game_node_id = nodes.find(node => node.game_id == game.id).node_id;
            // create initial links, later replace ids with node ids
                for (recommendation of game.recommendations.fans_liked) {
                    recommendation_node = nodes.find(node => node.game_id == recommendation);

                // recommendation may not be a top game and thefor not included
                    if(recommendation_node){
                        links.push({ "source": game_node_id, "source_name": game.title, "target": recommendation_node.node_id, "target_name": recommendation_node.name, "target_type": "game"});
                    //console.log(game_node);
                        game_node.outgoings.push(recommendation_node.node_id);
                    }
                }

            // create links to categories
                for (category of game.types.categories) {
                 category_node_id = nodes.find(node => node.name == category.name).node_id;
                 links.push({ "source": game_node_id, "source_name": game.title, "target": category_node_id, "target_name": category.name, "target_type": "category"});
                 game_node.outgoings.push(category_node_id);
             }
         }

         const graphVisObject = {
            nodes: nodes,
            links: links,
        };

        console.log("Graph Object");
        console.log(graphVisObject);
        drawGraphAnalysisVis(graphVisObject);

    });
    }
    function highlightNode(id){
        nodes = svgGraphAnalysis.selectAll('circle')['_groups'][0];
        nodes[id].setAttribute('r', nodes[id].getAttribute('r') * 1.75 );
    }

    function unHighlightNode(id){
        nodes = svgGraphAnalysis.selectAll('circle')['_groups'][0];
        nodes[id].setAttribute('r', nodes[id].getAttribute('r') / 1.75 );
    }

    processGraphVisData();
