function randomGen(w, h){
	var map = [];
	var coords = [];
	var count;
	var padding = 60;
	var density = .45;
	var r = 50;
	var maxEdge = 200;
	var minAng = Math.PI/8;
	var cons = [];
	
	coords = getCoords(w, h, density, padding, r);

	cons = convertEdges(filterEdges(minAng, maxEdge, coords, generateTriangles(coords)));
	
	for(var r=0; r<coords.length; r++){
		var con;
		if(cons[r] != undefined){
			con = cons[r];
		}
		else{
			con = [];
		}
        let prod = Math.floor(Math.random()*86) + 15;
        map.push(new star(r, coords[r][0], coords[r][1], "star"+r, prod, con));
        map.owner = {}
	}
    //console.log(map);
    map = verifyAllConnected(map);
	return map;
}

function verifyAllConnected(map){
    let colList = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00cccc", "#e65c00", "#2e5cb8", "#800080","#663300", "#ff8080","#00802b", "#008080","#800000","#666699","#cc9900"];

    let clusters = [];

    let visitedCount = 0;
    let visited = [];

    map.forEach(function(){visited.push(false);});


    let visitQueue = [map[0]];
    let clusterCount = 0;
    while(visitedCount < map.length){
        clusterCount++;
        clusters.push({colour: colList[clusterCount-1], planets: []});
        let currentCluster = clusters[clusterCount-1];
        visitQueue[0].colour = currentCluster.colour;
        visited[visitQueue[0].id] = true;
        visitedCount++;
        
        while(visitQueue.length > 0){
            let visiting = visitQueue[0];
            currentCluster.planets.push(visiting);
            for(let r = 0; r < visiting.connections.length; r++){
                let connectionID = visiting.connections[r];
                if(visited[connectionID] == false){
                    map[connectionID].colour = currentCluster.colour;
                    visitQueue.push(map[connectionID]);
                    visited[connectionID] = true;
                    visitedCount++;
                }
            }
            visitQueue.shift();
        }

        for(let r = 0; r < visited.length; r++){
            if(visited[r] == false){
                visitQueue.push(map[r]);
                break;
            }
        }

    }

    if(clusters.length > 1){
        //TODO: Prioritise connecting to main cluster instead of doing weird arms to other small clusters
        for(let r = 0; r < clusters.length; r++){
            clusters[r].averageCoords = {x:0, y:0};
            let planets = clusters[r].planets;
            for(let t = 0; t < planets.length; t++){
                clusters[r].averageCoords.x += planets[t].x;
                clusters[r].averageCoords.y += planets[t].y;
            }
            clusters[r].averageCoords.x = clusters[r].averageCoords.x / planets.length;
            clusters[r].averageCoords.y = clusters[r].averageCoords.y / planets.length;
        }
        for(let r = 0; r < clusters.length; r++){
            let base = clusters[r].averageCoords;
            let closest;
            let closestDistance = Infinity;
            for(let t = 0; t < clusters.length; t++){
                if(t != r){
                    let tempTarg = clusters[t].averageCoords;
                    let tempDist = findLengthPoints(base.x, tempTarg.x, base.y, tempTarg.y);
                    if(tempDist < closestDistance){
                        closest = clusters[t];
                        closestDistance = tempDist;
                    } 
                }
            }
            let nearSelfPlanet;
            let nearSelfPlanetDistance = Infinity;
            for(let x = 0; x < clusters[r].planets.length; x++){
                let tempX = clusters[r].planets[x].x
                let tempY = clusters[r].planets[x].y
                let tempDist = findLengthPoints(tempX, closest.averageCoords.x, tempY, closest.averageCoords.y);
                if(tempDist < nearSelfPlanetDistance){
                    nearSelfPlanet = clusters[r].planets[x];
                    nearSelfPlanetDistance = tempDist;
                }
            }
            nearSelfPlanet.colour = "#555";

            let nearTargPlanet;
            let nearTargPlanetDistance = Infinity;
            for(let x = 0; x < closest.planets.length; x++){
                let tempX = closest.planets[x].x
                let tempY = closest.planets[x].y
                let tempDist = findLengthPoints(tempX, nearSelfPlanet.x, tempY, nearSelfPlanet.y);
                if(tempDist < nearTargPlanetDistance){
                    nearTargPlanet = closest.planets[x];
                    nearTargPlanetDistance = tempDist;
                }
            }
            nearTargPlanet.colour = "#fff";

            nearTargPlanet.connections.push(nearSelfPlanet.id);
            nearSelfPlanet.connections.push(nearTargPlanet.id);
        }
        map = verifyAllConnected(map);
    }

    return map;
}