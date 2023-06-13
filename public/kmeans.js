/* k-means implementation in 2D */

// pulls min/ maxage data from the provided boardgame dataset
// executes the k means algorithm based on the pulled min / maxage data and returns a set of min, and maxage values aswell as a cluster index for each game
function preprocessClusters(data, k) {
    // transform min / maxage into datapoints
    var datapoints = get_datapoints_from_data(data);
    //normalizeDatapoints(datapoints);
    var centroids = get_random_centroids(datapoints, k);
    //console.log(JSON.parse(JSON.stringify(centroids)));

    var centroids_changed = true;
    //while (centroids_changed) {
    for (var i = 0; i < 20; i++) {
        assign_datapoints_to_centroids(datapoints, centroids, euclid);
        // console.log(JSON.parse(JSON.stringify(datapoints)));
        calculate_new_centroids(datapoints, centroids, mean);
        // console.log(JSON.parse(JSON.stringify(centroids)));

        // check if the centroids changed in the current iteration
        //   if (newCentroids[1] = true) {
        //     // update centroids
        //     centroids = newCentroids[0];
        //   } else {
        //     // else no change occurred and we can stop
        //     centroids_changed = false;
        //   }
    }

    // }
    //console.log(JSON.parse(JSON.stringify(datapoints)));
    return datapoints;
}

function get_datapoints_from_data(data) {
    datapoints = [];
    datapoint = {};

    for (const game of data) {
        // filter outliers
        if (game.id == '180263' || game.id == '233078') {
            // console.log('here');
            continue;
        }
        datapoint = {
            x: game.minplaytime,
            y: game.maxplaytime,
            centroid_index: 0,
            game_id: game.id,
        };
        datapoints.push(datapoint);
    }
    return datapoints;
}

/**
 * Calculates the mean for x and y of the given data points.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate measure on, whereas the array contains the data points; centroid_index is not needed here, but is part of the default data structure
 * @returns {{x, y}} - the measure (here: mean)
 */
function mean(datapoints) {
    var sumx = 0;
    var sumy = 0;

    for (const point of datapoints) {
        sumx += point.x;
        sumy += point.y;
    }

    // add rounding
    return { x: sumx / datapoints.length, y: sumy / datapoints.length };
}

function normalizeDatapoints(datapoints) {
    // console.log("normalizeDatapoints");
    // console.log(JSON.parse(JSON.stringify(datapoints)));
    var minx = datapoints[0].x;
    var maxx = datapoints[0].x;

    var miny = datapoints[0].y;
    var maxy = datapoints[0].y;

    for (const datapoint of datapoints) {
        // if the x of current point is smaller than minx until now
        minx = datapoint.x < minx ? datapoint.x : minx;
        // if the x of current point is larger than maxx until now
        maxx = maxx < datapoint.x ? datapoint.x : maxx;

        // analogous ref. above
        miny = datapoint.y < miny ? datapoint.y : miny;
        maxy = maxy < datapoint.y ? datapoint.y : maxy;
    }

    for (const datapoint of datapoints) {
        datapoint.x = (datapoint.x - minx) / (maxx - minx);
        datapoint.y = (datapoint.y - miny) / (maxy - miny);
    }
}

/**
 * Calculates the median for x and y of the given data points.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate measure on, whereas the array contains the data points; centroid_index is not needed here, but is part of the default data structure
 * @returns {{x, y}} - the measure (here: median)
 */
function median(datapoints) {
    // TODO
    return { x: 0, y: 0 };
}

/**
 * Calculates the euclidian distance between two points in space.
 *
 * @param {{ x, y, centroid_index }} point1 - first point in space
 * @param {{ x, y, centroid_index }} point2 - second point in space
 * @returns {Number} - the distance of point1 and point2
 */
function euclid(point1, point2) {
    var a = point2.x - point1.x;
    var b = point2.y - point1.y;

    return Math.sqrt(a * a + b * b);
}

/**
 * Calculates the manhattan distance between two points in space.
 *
 * @param {{ x, y, centroid_index }} point1 - first point in space
 * @param {{ x, y, centroid_index }} point2 - second point in space
 * @returns {Number} - the distance of point1 and point2
 */
function manhattan(point1, point2) {
    return Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y);
}

/**
 * Assigns each data point according to the given distance function to the nearest centroid.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all available data points
 * @param {[{ x, y }, ... ]} centroids - current centroids
 * @param {Function} distance_function - calculates the distance between positions
 * @returns {[{ x, y, centroid_index }, ...]} - data points with new centroid-assignments
 */
function assign_datapoints_to_centroids(
    datapoints,
    centroids,
    distance_function
) {
    var debug = false;
    var distanceToCentroid;

    for (const [pointIndex, point] of datapoints.entries()) {
        for (const [centroidIndex, centroid] of centroids.entries()) {
            // calculate the current distance of the point to its centroid
            // has to be done for every centroid, because of potential centroid updates
            distanceToCentroid = distance_function(
                point,
                centroids[point.centroid_index]
            );

            if (debug) {
                console.log(
                    'Point ' +
                        pointIndex +
                        ', Current Centroid: ' +
                        point.centroid_index +
                        ', Distance to current Centroid: ' +
                        distanceToCentroid
                );
            }
            // if the distance to the current centroid is lower than to the old centroid
            if (distance_function(point, centroid) < distanceToCentroid) {
                // assign the current centroid as new centroid
                point.centroid_index = centroidIndex;

                if (debug) {
                    console.log(
                        'Point' +
                            pointIndex +
                            ', Updated Centroid: ' +
                            centroidIndex
                    );
                }
            }
        }
    }

    return datapoints;
}

/**
 * Calculates for each centroid it's new position according to the given measure.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all available data points
 * @param {[{ x, y }, ... ]} centroids - current centroids
 * @param {Function} measure_function - measure of data set (e.g. mean-function, median-function, ...)
 * @returns {{[{ x, y }, ... ], Boolean}} - centroids with new positions, and true of at least one centroid position changed
 */
function calculate_new_centroids(datapoints, centroids, measure_function) {
    //console.log(JSON.parse(JSON.stringify(centroids)));
    let centroids_changed = false;

    var pointsForCentroid = [];
    var newCentroidPosition = { x: 0, y: 0 };

    for (const [centroidIndex, centroid] of centroids.entries()) {
        // filter all datapoints which are assigned to the current centroid
        pointsForCentroid = datapoints.filter(
            (datapoint) => datapoint.centroid_index == centroidIndex
        );
        // console.log("Centroid" + centroidIndex);
        // console.log(centroid);
        // console.log("Points for Centroid "  + centroidIndex);
        // console.log(pointsForCentroid);

        newCentroidPosition = measure_function(pointsForCentroid);

        if (
            newCentroidPosition.x != centroid.x ||
            newCentroidPosition.y != centroid.y
        ) {
            centroids_changed = true;

            centroid.x = newCentroidPosition.x;
            centroid.y = newCentroidPosition.y;
        }
    }

    return { centroids, centroids_changed };
}

/**
 * Generates random centroids according to the data point boundaries and the specified k.
 *
 * @param {[{ x, y }, ...]} datapoints - all available data points
 * @param {Number} k - number of centroids to be generated as a Number
 * @returns {[{ x, y }, ...]} - generated centroids
 */
function get_random_centroids(datapoints, k) {
    let debug = false;
    let centroids = [];

    // for non normalized values
    var minx = datapoints[0].x;
    var maxx = datapoints[0].x;

    var miny = datapoints[0].y;
    var maxy = datapoints[0].y;

    for (const point of datapoints) {
        // if the x of current point is smaller than minx until now
        minx = point.x < minx ? point.x : minx;
        // if the x of current point is larger than maxx until now
        maxx = maxx < point.x ? point.x : maxx;

        // analogous ref. above
        miny = point.y < miny ? point.y : miny;
        maxy = maxy < point.y ? point.y : maxy;
    }

    if (debug) {
        console.log('Min X: ' + minx);
        console.log('Max X: ' + maxx);

        console.log('Min Y: ' + miny);
        console.log('Max Y: ' + maxy);
    }
    // generate random coordinates within the boundaries of the given datapoins
    // with normalized x and y values, math random can be used
    for (var i = 0; i < k; i++) {
        // for noramlized values
        // randx = Math.random();
        // randy = Math.random();
        // for non normalized values
        randx = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
        randy = Math.floor(Math.random() * (maxy - miny + 1)) + miny;
        centroids.push({ x: randx, y: randy });
    }
    return centroids;
}
