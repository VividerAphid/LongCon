class player{
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.attacked = false;
        this.faction = {};
        this.ship = {};
    }
    get color(){
        return this.faction.color;
    }
    getOwned(map){
        return this.faction.getOwned(map);
    }
    getOwnedIds(map){
        return this.faction.getOwnedIds(map);
    }
}

class bot extends player{
    constructor(){

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
        this.connections = cons || [];
        this.constShowing = false;
        this.radius = 0;
        this.calcRad();
    }
    get color(){
        return this.owner.color;
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
    }
    drawStar(art){
        art.drawStar(this.x, this.y, this.color, this.radius);
    }
    drawLabels(art){
        let font = "bold 15px Consolas";
        art.drawText(this.x-15, this.y-25, this.defense, font, this.color); //Defense label
        art.drawText(this.x-10, this.y+35, "+"+this.prod, font, this.color); //Prod label
    }
    drawConnections(art, map){
        let reps = this.connections.length;
        for(let r = 0; r < reps; r++){
            let connectee = map[this.connections[r]].id;
            if(connectee > this.id){
                art.ctx.beginPath();
                art.ctx.lineWidth = 3;
                if(this.faction.id != 0 && this.faction.id == map[connectee].faction.id){
                    if(this.constShowing == true && map[connectee].constShowing == true){
                        art.ctx.fillStyle = "#fff";
                        art.ctx.strokeStyle = "#fff";
                        art.ctx.lineWidth = 9;
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
        console.log("Landed!");
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
    }
    get color(){
        return this.colorSet.color;
    }
    get colorChars(){
        return this.colorSet.chars;
    }
    getOwned(map){
        let owned = [];
        for(let r = 0; r < map.length; r++){
            if(map[r].faction.id == this.id){
                owned.push(map[r]);
            }
        }
        return owned;
    }
    getOwnedIds(map){
        let owned = [];
        for(let r = 0; r < map.length; r++){
            if(map[r].faction.id == this.id){
                owned.push(map[r].id);
            }
        }
        return owned;
    }
}