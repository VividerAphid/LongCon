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
    }
    onStart(map){
        this.findNearestTarget();
    }
    mapUpdate(map, moveEvent){
        if(moveEvent.type == "target"){
            this.findNearestTarget();
        }
    }
    makeMove(map){
        if(this.ship.flying){
            return "fly";
        }
        else{
            return this.ship.at;
        }
    }
    findNearestTarget(){
        if(this.faction.targets.length > 0){
            if((this.faction.targets.includes(this.target) && this.ship.flying) || (!this.faction.targets.includes(this.target))){
                let targs = this.faction.targets;
                let closest = {x: -100000, y:-100000};
                let nearby = [];
                let nearThreshold = 200;
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
        if(this.getOwned(map).length > 0){
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
        let owned = this.getOwned(map);
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
        console.log("mapUpdate() not overridden!");
    }
    mapUpdate(map){
        console.log("makeMove() not overridden!");
    }
}

class basicCoordinator extends coordinator{
    constructor(id, name){
        super(id, name);
        this.budget = 0;
    }
    onStart(map){
        let spawns = this.getOwned(map);
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
        while(cost < defense){
            cost += map[options[i][0]].defense;
            i++;
        }
        for(let r = 0; r < i; r++){
            toggleTarget(map, this.faction, map[options[r][0]]);
        }
        //console.log("From " + this.id);
        //console.log(this.faction.targets);
    }
    mapUpdate(map, event){
        if(event.type == "capture" && event.attacker.faction == this.faction){
            toggleTarget(map, this.faction, event.target);
            let cons = event.target.connections;
            for(let t in cons){
                let attVal = calcAttackValue(map, this.faction.players[0]);
                if(map[cons[t]].defense / attVal < 4 && map[cons[t]].faction.id != this.faction.id){
                    toggleTarget(map, this.faction, map[cons[t]]);
                }
            }
        }
    }
    loadBudget(map){
        let budget = 0;
        for(let r = 0; r < spawns.length; r++){
            defense += spawns[r].defense;
            let cons = spawns[r].connections;
            for(let t in cons){
                options.push(cons[t]);
            }
        }
        return budget;
    }
}