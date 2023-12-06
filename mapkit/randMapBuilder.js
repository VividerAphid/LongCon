function generateTriangles(coords){
    var delaunator = Delaunator.from(coords);
	var tris = delaunator.triangles;
	var triChunks = [];
	var rep = 0;
	for(var r=0;r<tris.length;r+=3){
		var host = r;
		var mini = [];
		mini.push(tris[r]);
		for(var t=r+1;t<r+3;t++){
			mini.push(tris[t]);
		}
		triChunks[rep] = mini;
		rep++;
	}
	//console.log(coords.length);
    return triChunks;
}

function filterEdges(minAng, maxEdge, coords, triangles){
	var edges = [];
	var ind = 0;
	for(var o = 0; o < triangles.length; o++){
		if(findLength(triangles[o][0], triangles[o][1], coords) <= maxEdge){
			edges[ind] = [triangles[o][0], triangles[o][1]];
			ind += 1;
		}
		if(findLength(triangles[o][1], triangles[o][2], coords) <= maxEdge){
			edges[ind] = [triangles[o][1], triangles[o][2]];
			ind += 1;
		}
		if(findLength(triangles[o][0], triangles[o][2], coords) <= maxEdge){
			edges[ind] = [triangles[o][0], triangles[o][2]];
			ind += 1;
		}
	}
	return edges;
}

function convertEdges(edges){ 
	//console.log(edges);
	var cons = [];
	for(var r = 0; r<edges.length; r++){
		if (!(cons[edges[r][0]])) cons[edges[r][0]] = [];
		if (!(cons[edges[r][1]])) cons[edges[r][1]] = [];
		cons[edges[r][0]].push(edges[r][1]);
		cons[edges[r][1]].push(edges[r][0]);
	}
	for(var w = 0; w<cons.length; w++){
		if(cons[w]){
			cons[w] = removeDupes(cons[w]);
		}
	}
	//console.log(cons);
	return cons;
}

function getCoords(w, h, density, padding, r){
    var plans = [];

	plans = generateChunk(w,h, density, padding, r);
	//plans = ring(w,h,density,padding,r);
	//plans = clusters(w,h,density, padding, r, -1, 500);
	// var type = Math.floor(Math.random() * 5);
	// switch(type){
	// 	case 0:
	// 		console.log("chunk!");
	// 		plans = generateChunk(w, h, density, padding, r);
	// 		break;
	// 	case 1:
	// 		console.log("bottle!");
	// 		plans = bottleNeck(h,h,density,padding, r);
	// 		break;
	// 	case 2:
	// 		console.log("circle!");
	// 		plans = circle(h,h,density,padding, r);
	// 		break;
	// 	case 3:
	// 		console.log("smash!");
	// 		plans = midSmash(h,h,density,padding,r);
	// 		break;
	// 	case 4:
	// 		console.log("ring!");
	// 		plans = ring(h,h,density,padding,r);
	// 		break;
	// }
	//console.log(plans.length);
    return plans;
}

function generateChunk(w, h, density, padding, r){
    var cords = [];
    count = Math.floor(density*(w-2*r)*(h-2*r)/(r*r*Math.PI));
	for(var t=0; t<count;t++){
		var safe = false;
		while (!safe) {
			var x = Math.floor((Math.random()*(w-2*padding))+ padding);
			var y = Math.floor((Math.random()*(h-2*padding))+ padding);
			var p = [x,y];
			safe = true;
			for (var j=0; j<cords.length; j+=1) {
				var q = cords[j];
				if ((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1])<r*r) {
					safe = false;
					break;
				}
			}
		}
		cords.push(p);
    }
    return cords;
}

function bottleNeck(w, h, density, padding, r){
	var cords = [];
	count = Math.floor(density*(w-2*r)*(h-2*r)/(r*r*Math.PI));
	var rad = h / 2;
	cords.push([h/2, w/2]);
	for(var t = 0; t<count; t++){
		var x = Math.floor((Math.random()*(w-2*padding))+ padding);
		var y = Math.floor((Math.random()*(h-2*padding))+ padding);
		while((x - cords[0][0])*(x - cords[0][0]) - (y - cords[0][1])*(y - cords[0][1]) > rad){
			var safe = false;
			while (!safe) {
				var x = Math.floor((Math.random()*(w-2*padding))+ padding);
				var y = Math.floor((Math.random()*(h-2*padding))+ padding);
				var p = [x,y];
				safe = true;
				for (var j=0; j<cords.length; j+=1) {
					var q = cords[j];
					if ((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1])<r*r) {
						safe = false;
						break;
					}
				}
			}
		}
		cords.push([x,y]);	
	}
	return cords;
}

function circle(w, h, density, padding, r){
	var cords = [];
	count = Math.floor(density*(w-2*r)*(h-2*r)/(r*r*Math.PI));
	var rad = h/2 - (padding*2);
	var cX = w/2;
	var cY = h/2;
	cords.push([cX, cY]);
	for(var t = 0; t<count; t++){
		var x = Math.floor((Math.random()*(w-2*padding))+ padding);
		var y = Math.floor((Math.random()*(h-2*padding))+ padding);
		while((x - cX)*(x - cX) + (y - cY)*(y - cY) > rad*rad){
			var safe = false;
			while (!safe) {
				var x = Math.floor((Math.random()*(w-2*padding))+ padding);
				var y = Math.floor((Math.random()*(h-2*padding))+ padding);
				var p = [x,y];
				safe = true;
				for (var j=0; j<cords.length; j+=1) {
					var q = cords[j];
					if ((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1])<r*r) {
						safe = false;
						break;
					}
				}
			}
		}
		cords.push([x,y]);	
	}
	return cords;
}

function midSmash(w, h, density, padding, r){
	var cords = [];
	count = Math.floor(density*(w-2*r)*(h-2*r)/(r*r*Math.PI));
	var outRad = h/2 - padding*2;
	var inRad = outRad / 3;
	var cX = w/2;
	var cY = h/2;
	cords.push([cX, cY]);
	for(var t = 0; t<count; t++){
		var x = Math.floor((Math.random()*(w-2*padding))+ padding);
		var y = Math.floor((Math.random()*(h-2*padding))+ padding);
		while((x - cX)*(x - cX) + (y - cY)*(y - cY) > outRad*outRad){
			var safe = false;
			while (!safe) {
				var x = Math.floor((Math.random()*(w-2*padding))+ padding);
				var y = Math.floor((Math.random()*(h-2*padding))+ padding);
				if((x - cX)*(x - cX) + (y - cY)*(y - cY) < inRad*inRad){
					var p = [x,y];
					safe = true;
					for (var j=0; j<cords.length; j+=1) {
						var q = cords[j];
						if ((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1])<r*r) {
							safe = false;
							break;
						}
					}
				}
			}
		}
		cords.push([x,y]);	
	}
	return cords;
}

function ring(w, h, density, padding, r){
	var cords = [];
	count = Math.floor(density*(w-2*r)*(h-2*r)/(r*r*Math.PI));
	var outRad = h/2 - padding*2;
	var inRad = outRad / 2;
	var cX = w/2;
	var cY = h/2;
	for(var t = 0; t<count; t++){
		var x = Math.floor((Math.random()*(w-2*padding))+ padding);
		var y = Math.floor((Math.random()*(h-2*padding))+ padding);
		while((x - cX)*(x - cX) + (y - cY)*(y - cY) > outRad*outRad || (x - cX)*(x - cX) + (y - cY)*(y - cY) < inRad*inRad){
			var safe = false;
			while (!safe) {
				var x = Math.floor((Math.random()*(w-2*padding))+ padding);
				var y = Math.floor((Math.random()*(h-2*padding))+ padding);
					var p = [x,y];
					safe = true;
					for (var j=0; j<cords.length; j+=1) {
						var q = cords[j];
						if ((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1])<r*r) {
							safe = false;
							break;
						}
					}
			}
		}
		cords.push([x,y]);	
	}
	return cords;
}

function clusters(w,h,density,padding,r,type, size){
	var clustCoords = [];
	clustCoords = generateChunk(w,h,.7,padding, size);
	var coords = [];
	for(var x = 0; x<clustCoords.length; x++){
		var temp = [];
		switch(type){
			case -1:
				var pick = Math.floor(Math.random()*4);
				switch(pick){
					case 0:
						temp = generateChunk(size*2,size*2,density,padding,r);
						break;
					case 1:
						temp = ring(size*2,size*2,density,padding,r);
						break;
					case 2:
						temp = ring(size*2,size*2,density,padding,r);
						break;
					case 3:
						temp = bottleNeck(size*2,size*2,density,padding,r);
						break;
				}
				break;
			case 0:
				temp = generateChunk(size*2,size*2,density,padding,r);
				break;
			case 1:
				temp = ring(size*2,size*2,density,padding,r);
				break;
			case 2:
				temp = ring(size*2,size*2,density,padding,r);
				break;
			case 3:
				temp = bottleNeck(size*2,size*2,density,padding,r);
				break;
		}
		for(var zz=0; zz<temp.length; zz++){
			temp[zz][0]+= clustCoords[x][0];
			temp[zz][1]+= clustCoords[x][1];
		}
		//console.log(temp);
		coords = coords.concat(temp);
	}
	//console.log(clustCoords);
	//console.log(coords);
	return coords;
}