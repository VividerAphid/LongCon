class player{
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.attacked = false;
        this.faction = {};
        this.ship = {};
        this.attackStrength = .3; //High by default
        this.hitPower = 100;
        this.isBot = false;
        this.isDead = false;
        this.pointerOn = true;
    }
    get color(){
        return this.faction.color;
    }
    getOwned(){
        return this.faction.getOwned();
    }
    getOwnedIds(map){
        return this.faction.getOwnedIds(map);
    }
}

class star{
    constructor(id, x, y, name, prod, cons){
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.prod = prod;
        this.defense = 0;
        this.owner = {};
        this.connections = cons || []; //list of integers
        this.constShowing = false;
        this.radius = 0;
        this.constId = -1;
        this.labelOffsets = {dXOffset: 15, dYOffset: 25, pXOffset: 10, pYOffset: 35};
        this.calcRad();
    }
    get color(){
        return this.owner.color;
    }
    get colorInverse(){
        return this.faction.colorInverse;
    }
    get colorChars(){
        return this.faction.colorChars;
    }
    get faction(){
        return this.owner.faction;
    }
    set production(val){
        this.prod = val;
        this.calcRad();
    }
    calcRad(){
        this.radius = 10*(this.prod/100);
        // this.labelOffsets.dXOffset = 15 * (this.prod / 10);
        // this.labelOffsets.dYOffset = 25 * (this.prod / 10);
        // this.labelOffsets.pXOffset = 10 * (this.prod / 10);
        // this.labelOffsets.pYOffset = 35 * (this.prod / 10);
    }
    drawStar(art){
        art.drawStar(this.x, this.y, this.color, this.radius);
    }
    drawLabels(art, drawFactionLabels){
        let constMult = "";
        if(this.constShowing){constMult = " (x2)"}
        art.drawText(this.x-this.labelOffsets.dXOffset, this.y-this.labelOffsets.dYOffset, this.defense, art.labelFont, this.color); //Defense label
        art.drawText(this.x-this.labelOffsets.pXOffset, this.y+this.labelOffsets.pYOffset, "+"+this.prod + constMult, art.labelFont, this.color); //Prod label       
        if(drawFactionLabels){
            art.drawText(this.x-7, this.y, this.colorChars, art.labelFont, this.colorInverse);
        }
    }
    drawDebugs(art){
        art.drawText(this.x-10, this.y, this.id, art.labelFont, "#f00");
    }
    drawConnections(art, map){
        let reps = this.connections.length;
        for(let r = 0; r < reps; r++){
            let connectee = map[this.connections[r]].id;
            if(connectee > this.id){
                art.ctx.beginPath();
                art.ctx.lineWidth = 3;
                art.ctx.fillStyle = "#999";
                art.ctx.strokeStyle = "#999";
                if(this.faction.id != 0 && this.faction.id == map[connectee].faction.id){
                    if(this.constShowing == true && map[connectee].constShowing == true && this.constId == map[connectee].constId){
                        art.ctx.fillStyle = "#fff";
                        art.ctx.strokeStyle = "#fff";
                        art.ctx.lineWidth = 7;
                    }
                    else{
                        art.ctx.fillStyle = this.color;
                        art.ctx.strokeStyle = this.color;
                    }
                }
                else{
                art.ctx.fillStyle = "#999";
                art.ctx.strokeStyle = "#999";
                //G.fillStyle = "#f0f";
                //G.strokeStyle = "#f0f"; //FOR TESTING    
                }
                art.ctx.moveTo(this.x, this.y);
                art.ctx.lineTo(map[connectee].x, map[connectee].y);
                art.ctx.stroke();
            }
        }
    }
}

class ship{
    constructor(id, player){
        this.id = id;
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.speed = 10;
        this.flying = false;
        this.target = "";
        this.at = "";
    }
    get color(){
        return this.player.color;
    }
    get faction(){
        return this.player.faction;
    }

    setStart(star){
        this.x = star.x + star.radius*2;
        this.y = star.y - star.radius*2;
        this.target = star;
        this.at = star;
        this.calcDirection();
    }

    fly(star){
        this.flying = true;
        this.target = star;
        this.calcDirection();
        this.at = "";
    }
    
    stepToTarget(){
        let dx = this.target.x - this.x ;
        let dy = this.target.y - this.y ; // Make sure it's TARGET MINUS SELF, NOT THE OTHER WAY AROUND (or it'll go backwards)
        const len = Math.sqrt(dx * dx + dy * dy) ; // basically the distance to the target position.
        
        if(len > this.target.radius*2){
            // let targetAng = Math.atan2((this.moveTarget.x - this.x), (this.moveTarget.y - this.y));
            // this.direction = targetAng;
            const new_len = Math.min(this.speed, len) ;
            const factor = new_len / len ;
            dx *= factor ;
            dy *= factor ;
            this.x += dx ;
            this.y += dy ;   
        }
        else{
            this.land();
        }
    }

    land(){
        this.flying = false;
        this.at = this.target;
        //console.log("Landed!");
    }

    calcDirection(){
        let targetAng = Math.atan2((this.target.x - this.x), (this.target.y - this.y));
        this.direction = targetAng;
    }

    draw(art){
        art.drawTriangle(this);
    }
}

class faction{
    constructor(id, name, colorSet){
        this.id = id;
        this.name = name;
        this.colorSet = colorSet;
        this.players = [];
        this.targets = [];
        this.coordinator = "";
        this.owned = [];
    }
    get color(){
        return this.colorSet.color;
    }
    get colorInverse(){
        return this.colorSet.inverse;
    }
    get colorChars(){
        return this.colorSet.chars;
    }
    getOwned(){
        return this.owned;
    }
    getScore(map){
        //Return score / prod value
        let owned = this.getOwned();
        let score = 0;
        for(let r in owned){
            score += owned[r].prod;
            if(owned[r].constShowing){
                score += owned[r].prod;
            }
        }
        return score;
    }
    getTotalDefense(map){
        //Return total defense across all owned stars
        let owned = this.getOwned();
        let defense = 0;
        for(let r in owned){
            defense += owned[r].defense;
        }
        return defense;
    }
    getOwnedIds(map){
        let ids = [];
        for(let r = 0; r < this.owned.length; r++){
            ids.push(this.owned[r].id);
        }
        return ids;
    }
    updateOwned(target, isRemove){
        if(isRemove){
            this.owned = removeItem(this.owned, target);
        }
        else{
            this.owned.push(target);
        }
    }
    calcInitialOwned(map){
        let owned = [];
        for(let r = 0; r < map.length; r++){
            if(map[r].faction.id == this.id){
                owned.push(map[r]);
            }
        }
        this.owned = owned;
    }
}

class game{
    constructor(){
        this.spectateMode = false;
        this.map = [];
        this.consts = [];
        this.factions = [];
        this.players = [];
        this.coordinators = [];
        this.humanPlayer = {};
        this.ships = [];
        this.artist = {};
        this.width = "";
        this.height = "";
        this.neutCostCap = 0;
        this.settings = {
            minLabelDrawDistance : .6,
            drawShipsInSpectator: true,
            drawFactionLabels: true,
        };
    }
}