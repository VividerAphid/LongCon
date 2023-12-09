function loadTestSet(){
    let map = [];
    for(let r = 0; r < 15; r++){
        let x = Math.floor(Math.random()*1500) + 30;
        let y = Math.floor(Math.random()*1500) + 30;
        let prod = Math.floor(Math.random()*86) + 15;
        map.push(new star(r, x, y, "star"+r, prod));
    }
    let neutPlayer = new player(0, "neutral");
    let neutFaction = new faction(0, "neutralF", {color: "#fff", chars: ""});
    neutPlayer.faction = neutFaction;
    for(let r = 0; r < map.length; r++){
        map[r].defense = 0;//Math.floor(Math.random()* 5000);
        map[r].owner = neutPlayer;
    }
    return map;
}

function loadDefenseAndNeut(map){
    let neutPlayer = new player(0, "neutral");
    let neutFaction = new faction(0, "neutralF", {color: "#fff", chars: ""});
    neutPlayer.faction = neutFaction;
    for(let r = 0; r < map.length; r++){
        map[r].defense = Math.floor(Math.random()* 1500);
        map[r].owner = neutPlayer;
    }
    return map;
}

function addDefense(map){
    for(let r = 0; r < map.length; r++){
        if(map[r].owner.id > 0){
            map[r].defense += map[r].prod;
        }
    }
}

function hourRefresh(map, art, ships){
    addDefense(map);
    render(art, map, ships);
}

function render(art, map, ships){
    art.fillRect(0, 0, gameboard.width, gameboard.height, "#222", "#222");
    for(let r = 0; r < map.length; r++){
        map[r].drawConnections(art, map);
    }
    
    for(let r = 0; r < map.length; r++){
        map[r].drawStar(art);
    }
    
    for(let r = 0; r < map.length; r++){
        map[r].drawLabels(art);
    }
    
    for(let r = 0; r < ships.length; r++){
        ships[r].draw(art);
    }
}

function uiSetup(map, player, art, ships){
    gameboard.width = 3000;
    gameboard.height = 3000;
    gameboard.onclick = function(event){
        event.preventDefault();
        checkHit(map, player, art, ships);
    }
}

function pickSpawns(factions, map, spawnCount){
    for(let s = 0; s < spawnCount; s++){
        let prodPick = Math.floor(Math.random()*86) + 15;
        let defensePick = Math.floor(Math.random()*1500);
        for(let r = 0; r < factions.length; r++){
            let pick = Math.floor(Math.random()*map.length);
            if(map[pick].owner.id == 0){
                let playerPick = Math.floor(Math.random()*factions[r].players.length);
                map[pick].owner = factions[r].players[playerPick];
                map[pick].defense = defensePick;
                map[pick].production = prodPick;
            }
        }
    }
    return map;  
}

function loadTestFactions(){
    let factions = [];
    let charSet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for(let r = 0; r < 10; r++){
        let rc = Math.floor(Math.random()*256);
        let gc = Math.floor(Math.random()*256);
        let bc = Math.floor(Math.random()*256);
        let color = "rgb("+ rc+ ","+gc+","+bc+")";
        let charPicks = [Math.floor(Math.random()*charSet.length), Math.floor(Math.random()*charSet.length)];
        let chars = charSet[charPicks[0]] + charSet[charPicks[1]];
        factions.push(new faction(r+1, "Fac"+r+1, {color: color, chars: chars}));
        factions[r].players.push(new player(r+1, "Pla" + r+1));
        factions[r].players[0].faction = factions[r];
    }
    console.log(factions);
    return factions;
}

function getAttackValue(map, play){
    let defPercent = play.attackStrength;
    let planPercent = .5;
    let owned = play.getOwnedIds(map);
    let sorted = owned.slice();
    sorted.sort(function(a, b){return map[b].defense - map[a].defense});
    
    let count = Math.round(sorted.length * planPercent);
    let hitValue = 0;
    for(let r = 0; r < count; r++){
        if(map[sorted[r]].defense > 0){
            let scrapeVal = Math.round(map[sorted[r]].defense * defPercent);
            if(scrapeVal == 0) scrapeVal = 1;
            hitValue += scrapeVal;
            map[sorted[r]].defense -= scrapeVal;
        }
        // else{
        //     r--;
        // }
    }
    return hitValue;
}

function checkHit(map, player, art, ships){
    //console.log("checkhit");
    let canvRect = gameboard.getBoundingClientRect();
	let x = (event.clientX - canvRect.left);
	let y = (event.clientY - canvRect.top);
    let r;
    let reps = map.length;
		for(r=0; r<reps;r++){
        let clickRad = map[r].radius*2;
        if(clickRad < 10) clickRad = 10;
		if (x >= (map[r].x - clickRad) && x <= (map[r].x + clickRad)){
			if (y >= (map[r].y - clickRad) && y <= (map[r].y + clickRad)){
                if(map[r] != player.ship.at){
                    if(map[r].faction.id == player.faction.id){
                        //console.log("flying!");
                        player.ship.fly(map[r]);
                        render(art, map, ships);
                    }
                    else{
                        if(checkProximity(map[r], map, player.faction.id)){
                            //console.log("flying!");
                            player.ship.fly(map[r]);
                            render(art, map, ships);
                        }
                    }
                    break;
                }
                else{
                    if(player.attacked == false){
                        move(map, map[r], player);
                        render(art, map, ships);
                    }
                }
			}
		}
		}
}

function checkProximity(targ, map, id){
    if(targ != 0){
        var r;
        var cons = targ.connections;
        let reps = cons.length;
            for(r=0; r < reps; r++){
                if (map[cons[r]].faction.id == id){
                    return true;
                }
            }
    }
	return false;
}

function move(map, target, player){
    let stack = getAttackValue(map, player);
    let moveEvent = {target: target, attacker: player, defender: 0, type: 0};
    if (target.faction.id == player.faction.id){
        target.defense += stack;
        moveEvent.defender = player;
        moveEvent.type = "defend";
    }
    else{
        if(target.defense < stack){
            moveEvent.defender = target.owner;
            moveEvent.type = "capture";
            target.defense = stack - target.defense;
            target.owner = player;
        }
        else{
            target.defense -= stack;
            moveEvent.defender = target.owner;
            moveEvent.type = "attack";
        }
    }
    console.log(moveEvent);
    return moveEvent;
}

function attackRefresh(players){
    for(let r = 0; r < players.length; r++){
        players[r].attacked = false;
    }
}

function flightUpdate(art, map, ships){
    for(let r = 0; r < ships.length; r++){
        if(ships[r].flying){
            ships[r].stepToTarget();
        }
    }
    render(art, map, ships);
}