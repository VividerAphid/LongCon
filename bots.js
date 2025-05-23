class bot extends player{
    constructor(id, name){
        super(id, name);
        this.isBot = true;
    }
    onStart(map){
        console.log("onStart() not overridden!");
    }
    mapUpdate(map, moveEvent){
        console.log("mapUpdate() not overridden!");
    }
    makeMove(map){
        console.log("makeMove() not overridden!");
    }
}
class targetDrone extends bot{
    constructor(id, name){
        super(id, name);
        this.target = "";
        this.moveTurnSkips = 0;
        this.orders = ""; //Will be either {stack:false}, {stack:true, stackThreshold:num, noCap:true/false}
        this.enabled = true;
    }
    onStart(map){
        this.findNearestTarget();
    }
    mapUpdate(map, moveEvent){
        if(this.enabled){
            if(moveEvent.type == "target" && this.orders == ""){
                this.findNearestTarget();
            }
            else{
                if(this.orders != ""){
                    if(moveEvent.type = "capture" && moveEvent.target == this.target){
                        if(this.orders.stack){
                            if(this.orders.noCap == false){
                                if(this.target.defense >= this.orders.threshold){
                                    this.orders = "";
                                    this.findNearestTarget();
                                }
                            }
                        }
                        else{
                            this.orders = "";
                            this.findNearestTarget();
                        }
                    }
                    if(moveEvent.type = "defend" && moveEvent.target == this.target){
                        if(this.orders.noCap == false){
                            if(this.target.defense >= this.orders.threshold){
                                this.orders = "";
                                this.findNearestTarget();
                            }
                        }
                    }
                }
            }
        }
    }
    makeMove(map){
        if(this.ship.flying || this.enabled == false){
            return "fly";
        }
        else if(this.moveTurnSkips > 0){
            this.moveTurnSkips -= 1;
            return "fly"; //Just to make turn skipped in botMove()
        }
        else{
            this.moveTurnSkips  = Math.floor(Math.random()*3);
            return this.ship.at;
        }
    }
    findNearestTarget(){
        if(this.faction.targets.length > 0){
            if((this.faction.targets.includes(this.target) && this.ship.flying) || (!this.faction.targets.includes(this.target))){
                let targs = this.faction.targets;
                let closest = {x: -100000, y:-100000};
                let nearby = [];
                let nearThreshold = 300;
                for(let r = 0; r < targs.length; r++){
                    let closestDist = findLengthPoints(this.ship.x, closest.x, this.ship.y, closest.y);
                    let currTargDist = findLengthPoints(this.ship.x, targs[r].x, this.ship.y, targs[r].y);
                    if(closestDist > currTargDist){
                        closest = targs[r];
                    }
                }
                
                let closestDist = findLengthPoints(this.ship.x, closest.x, this.ship.y, closest.y);
                for(let r = 0; r < targs.length; r++){
                    let currTargDist = findLengthPoints(this.ship.x, targs[r].x, this.ship.y, targs[r].y);
                    if((currTargDist - closestDist) < nearThreshold){
                        nearby.push(targs[r]); //Including actual closest is fine for variety
                    }
                }
                if(nearby.length > 0 && findLengthPoints(this.ship.x, this.target.x, this.ship.y, this.target.y) > findLengthPoints(this.ship.x, closest.x, this.ship.y, closest.y)){
                    //console.log(nearby);
                    let pick = Math.floor(Math.random()*nearby.length);
                    this.target = nearby[pick];
                }
                else{
                    this.target = closest;
                }
                this.ship.fly(this.target); 
            }    
        }
    }
    setOrders(target, threshold, noCap=false){
        this.target = target;
        if(threshold != null){
            this.orders = {stack: true, threshold: threshold, noCap: noCap}
        }
        else{
            this.orders = {stack: false};
        }
    }
}
class basicBot extends bot{
    constructor(id, name){
        super(id, name);
        this.targets = [];
    }
    onStart(map){
        let start = this.ship.at;
        let cons = start.connections;
        this.targets = cons;
        this.pickNewTarget(map);
    }
    mapUpdate(map, moveEvent){
        // console.log("mapUpdate");
        // console.log(moveEvent);
        let stillInProxy = checkProximity(this.ship.at, map, this.faction.id);
        //console.log("Proxy check = " + stillInProxy);
        if(moveEvent.defender.faction.id == this.faction.id && moveEvent.type == "capture"){
            if(!stillInProxy){
                //console.log("Lost proxy!");
                this.updateTargets(map);
                this.pickNewTarget(map);
            }
        }
        if(moveEvent.attacker.faction.id == this.faction.id && this.ship.target == moveEvent.target && moveEvent.type == "capture"){
            //console.log("Capped!");
            this.updateTargets(map);
            this.pickNewTarget(map);
        }
    }
    makeMove(map){
        if(!this.ship.flying){
            if(checkProximity(this.ship.at, map, this.faction.id)){
                if(this.ship.at.faction.id == this.faction.id){
                    this.updateTargets(map);
                    this.pickNewTarget(map);
                    return "fly";
                }
                return this.ship.at;
            }
            else{
                this.updateTargets(map);
                this.pickNewTarget(map);
                return "fly";
            }
        }
        else{
            return "fly";
        }
    }
    updateTargets(map){
        //console.log("updateTarget");
        //console.log(this.targets);
        if(this.getOwned().length > 0){
        for(let r = 0; r < this.targets.length; r++){
            if(map[this.targets[r]].faction.id == this.faction.id || checkProximity(map[this.targets[r]], map, this.faction.id)==false){
                //console.log("found out of proxy!");
                this.targets = removeAtIndex(this.targets, r);
            }
        }
        if(this.targets.length == 0){
            let cons = [];
            if(this.ship.at != ""){
                cons = this.ship.at.connections;
            }      
            for(let r = 0; r < cons.length; r++){
                if(map[cons[r]].faction.id != this.faction.id && checkProximity(map[cons[r]], map, this.faction.id)){
                    this.targets.push(cons[r]);
                }
            }
            if(this.targets.length ==0){
                this.getNewTargSet(map);
            }
        }
    }
        //console.log(this.targets);
    }
    pickNewTarget(map){
        //console.log("pickNewTarget");
        let pick = Math.floor(Math.random()*this.targets.length);
        this.ship.fly(map[this.targets[pick]]);
    }
    getNewTargSet(map){
        //console.log("New target set!");
        let options = [];
        let owned = this.getOwned();
        for(let r = 0; r < owned.length; r++){
            let cons = owned[r].connections;
            for(let t = 0; t < cons.length; t++){
                if(map[cons[t]].faction.id != this.faction.id){
                    options.push(map[cons[t]]);
                }
            }
        }
        //console.log(options);
        let distance = Infinity;
        let pick = -1;
        for(let r = 0; r < options.length; r++){
            let dist = findLengthPoints(this.ship.x, this.ship.y, options[r].x, options[r].y);
            if(dist < distance){
                distance = dist;
                pick = options[r];
            }
        }
        this.targets.push(pick.id);
        //console.log(this.targets);
    }
    
}

//Coordinator bots that set targets for a faction
class coordinator extends bot{
    constructor(id, name){
        super(id, name);
        this.isCoordinator = true;
    }
    onStart(map){
        console.log("onStart() not overridden!");
    }
    mapUpdate(map){
        console.log("mapUpdate() not overridden!");
    }
    addTarget(map, targetStar){
        //targetStar actual star reference, NOT ID
        toggleTarget(map, this.faction, targetStar);
        this.faction.targets.push(targetStar);
    }
    removeTarget(map, targetStar){
        //targetStar actual star reference, NOT ID
        toggleTarget(map, this.faction, targetStar);
        this.faction.targets = removeItem(this.faction.targets, targetStar);
    }
    clearTargets(map){
        //Remove all faction targets
        let targets = this.faction.targets;
        for(let r = 0; r < targets.length; r++){
            this.removeTarget(map, targets[r]);
        }
    }
    checkTargetsInProxy(map, capturedStar){
        //checks if any targets lost proximity when capturedStar was taken
        //returns list of any targets removed
        let cons = capturedStar.connections;
        let removed = [];
            for(let t in cons){
                if(this.faction.targets.includes(map[cons[t]])){
                    if(checkProximity(map[cons[t]], map, this.faction.id) == false){
                        this.removeTarget(map, map[cons[t]]);
                        removed.push(map[cons[t]]);
                    }
                }
            }
        return removed;
    }
}
class dummyCoordinator extends coordinator{
    constructor(id, name){
        super(id, name);
        this.isCoordinator = true;
    }
    onStart(map){
        //Do nothing because we are a dummy!!
    }
    mapUpdate(map){
        //Do nothing because we are a dummy!!
    }
}

class basicCoordinator extends coordinator{
    constructor(id, name){
        super(id, name);
    }
    onStart(map){
        let spawns = this.getOwned();
        let defense = 0;
        let options = [];
        for(let r = 0; r < spawns.length; r++){
            defense += spawns[r].defense;
            let cons = spawns[r].connections;
            for(let t in cons){
                if(map[cons[t]].faction.id != this.faction.id){
                    options.push(cons[t]);   
                }
            }
        }
        for(let o in options){
            let tmp = options[o];
            options[o] = [tmp, map[tmp].defense/map[tmp].prod];
        }
        options.sort(function(a, b){return a[1] - b[1]});
        let cost = 0;
        let i = 0;
        //console.log(options.length);
        while(cost < defense && i < options.length){
            //console.log(i);
            cost += map[options[i][0]].defense;
            i++;
        }
        for(let r = 0; r < i; r++){
            this.addTarget(map, map[options[r][0]]);
        }
        //console.log("From " + this.id);
        //console.log(this.faction.targets);
    }
    mapUpdate(map, event){
        if(event.type == "capture" && event.attacker.faction == this.faction){
            toggleTarget(map, this.faction, event.target);
            this.faction.targets = removeItem(this.faction.targets, event.target);
            let cons = event.target.connections;
            for(let t in cons){
                let attVal = calcAttackValue(map, this.faction.players[0]);
                if(map[cons[t]].defense / attVal < 4 && map[cons[t]].faction.id != this.faction.id && !this.faction.targets.includes(map[cons[t]])){
                    this.addTarget(map, map[cons[t]]);
                }
            }
        }
        else if(event.type == "capture" && event.attacker.faction != this.faction){
            this.checkTargetsInProxy(map, event.target);
        }
    }
}

class coordinatorCheapGrab extends coordinator{
    //grab cheap stars in proximity, then pick a single cluster that is biggest after some time
    //prefer a floodfill style expansion, retaking cluster stars
    constructor(id, name){
        super(id, name);
        this.cluster = []; //The group of stars we decide to protect
        this.prodCycles = 0;
        this.desired = []; //The group of stars we want
        this.lostProxies = []; //Targets we lost proximity to but still might want
        this.extra = {};
        this.grabbingCheaps = true;
        this.grabCheapsEnd = 10; //How many prod ticks until we stop grabbing cheaps
        this.cheapsThreshold = .5; //% of neutCostCap we are willing to target
    }
    onStart(map, extra){
        let owned = this.getOwned();
        this.extra = extra;
        while(this.desired.length == 0){
            for(let r = 0; r < owned.length; r++){
                this.selectConnectedCheaps(map, owned[r]);
            }
            this.cheapsThreshold += .1; //increase in case we don't find any somehow
        }
        this.cheapsThreshold = .5; //reset after we are done looking
    }
    mapUpdate(map, event){
        if(event.type == "production"){
            this.prodCycles++;
            if(this.prodCycles == this.grabCheapsEnd){
                this.grabbingCheaps = false;
                this.pickCluster(map);
            }
        }
        if(event.type == "capture"){
            if(event.attacker.faction.id == this.faction.id){
                if(this.desired.includes(event.target)){
                    this.desired = removeItem(this.desired, event.target);
                    this.removeTarget(map, event.target);
                    if(this.grabbingCheaps == false){
                        this.cluster.push(event.target);
                    }
                }
                if(this.grabbingCheaps){
                    this.retargetLostProxies(map, event.target);
                    if(this.faction.targets.length == 0){
                        while(this.desired.length == 0){
                            for(let r = 0; r < owned.length; r++){
                                this.selectConnectedCheaps(map, owned[r]);
                            }
                            this.cheapsThreshold += .1; //increase in case we don't find any somehow
                        }
                        this.cheapsThreshold = .5; //reset after we are done looking
                    }
                    else{
                        this.selectConnectedCheaps(map, event.target);
                    }
                }
                else{
                    
                }
            }
            else{
               if(event.defender.faction.id == this.faction.id){
                    let lost = this.checkTargetsInProxy(map, event.target);
                    for(let r = 0; r < lost.length; r++){
                        this.lostProxies.push(lost[r]);
                    }
                    if(this.cluster.includes(event.target)){
                        this.addTarget(map, event.target);
                    }
               }
                
            }
        }      
    }
    selectConnectedCheaps(map, target){ 
        let cons = target.connections;
        for(let r = 0; r < cons.length; r++){
            let connection = map[cons[r]];
            if(connection.defense < this.extra.neutCostCap * this.cheapsThreshold && connection.owner.faction.id != this.faction.id && this.faction.targets.includes(target)==false){
                this.desired.push(connection);
                this.addTarget(map, connection);
            }
        }
    }
    retargetLostProxies(map, newCapture){
        let cons = newCapture.connections;
        for(let r = 0; r < cons.length; r++){
            let con = map[cons[r]];
            if(this.lostProxies.includes(con)){
                this.addTarget(map, con);
                this.lostProxies = removeItem(this.lostProxies, con);
            }
        }
    }  
    pickCluster(map){
        if(this.getOwned().length > 0){
            this.sizeClusters(map, this.faction);
            this.clearTargets(map);
            for(let r = 0; r < this.cluster.length; r++){
                this.addTarget(map, this.cluster[r]);
            }
        }
    }
    sizeClusters(map, targetFaction){
        //BFS to count up which cluster is the biggest
        //targetFaction to specify which faction we are looking at
        let owned = this.getOwned();
        let visited = [];
        let visitedCount = 0;
        let visitQueue = [owned[0]];
        let clusters = [];

        owned.forEach(function(){visited.push(false);});

        while(visitedCount < owned.length){
            let currentCluster = [];
            clusters.push(currentCluster);
            visited[owned.indexOf(visitQueue[0])] = true;
            visitedCount++;
            
            while(visitQueue.length > 0){
                let visiting = visitQueue[0];
                currentCluster.push(visiting);
                for(let r = 0; r < visiting.connections.length; r++){
                    let connectionID = visiting.connections[r];
                    if(map[connectionID].owner.faction.id == targetFaction.id){
                        if(visited[owned.indexOf(map[connectionID])] == false){
                            visitQueue.push(map[connectionID]);
                            visited[owned.indexOf(map[connectionID])] = true;
                            visitedCount++;
                        }
                    }
                }
                visitQueue.shift();
            }
            for(let r = 0; r < visited.length; r++){
                if(visited[r] == false){
                    visitQueue.push(owned[r]);
                    break;
                }
            }
        }
        clusters.sort();
        this.cluster = clusters[clusters.length-1]; //default sort sorts smallest to biggest, grab the very end
    }

}

class clusterRushCoordinator extends bot{
    //Pick a single cluster immediately and expand from that
    //prefer a floodfill style expansion, retaking cluster stars
    constructor(id, name){
        super(id, name);
        this.isCoordinator = true;
    }
    onStart(map){
        console.log("onStart() not overridden!");
    }
    mapUpdate(map){
        console.log("mapUpdate() not overridden!");
    }
}