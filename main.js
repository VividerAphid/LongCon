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

function testLightConsts(gameData){
    for(let r = 0; r < gameData.consts.length; r++){
        let curConst = gameData.consts[r];
        //console.log(curConst);
        for(let t = 0; t < curConst.length; t++){
            //console.log(curConst[t][0]);
            gameData.map[curConst[t][0]].constShowing = true;
            gameData.map[curConst[t][1]].constShowing = true;
        }
    }
}

function testFillMap(map, faction){
    for(let r = 0; r < map.length; r++){
        map[r].owner = faction.players[0];
    }
}

function loadTestFactions(count){
    let factions = [];
    let charSet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for(let r = 0; r < count; r++){
        let rc = Math.floor(Math.random()*256);
        let gc = Math.floor(Math.random()*256);
        let bc = Math.floor(Math.random()*256);
        let color = "rgb("+ rc+ ","+gc+","+bc+")";
        let inverse = "rgb("+ (255-rc) +","+(255-gc) +"," +(255-bc)+")";
        let charPicks = [Math.floor(Math.random()*charSet.length), Math.floor(Math.random()*charSet.length)];
        let chars = charSet[charPicks[0]] + charSet[charPicks[1]];
        factions.push(new faction(r+1, "Fac"+r+1, {color: color, chars: chars, inverse: inverse}));
        factions[r].players.push(new player(r+1, "Pla" + r+1));
        factions[r].players[0].faction = factions[r];
    }
    console.log(factions);
    return factions;
}

function loadTestPlayersAndShips(factions, perFaction){
    let count = factions.length * perFaction;
    let players = [];
    let ships = [];
    let idCount = 0;
    for(let r = 0; r < factions.length; r++){
        for(let p = 0; p < count / factions.length; p++){
            players.push(new basicBot(idCount+1, "Bot"+(r+1)));
            factions[r].players.push(players[idCount]);
            players[idCount].faction = factions[r];
            ships.push(new ship(idCount+1, players[idCount]));
            players[idCount].ship = ships[idCount];
            idCount++;
        }
    }
    return [players, ships];
}

function setShipSpawns(gameData){
    let map = gameData.map;
    let ships = gameData.ships;
    for(let r = 0; r < ships.length; r++){
        let list = ships[r].player.getOwned(map);
        let pick = Math.floor(Math.random()*list.length);
        let spawn = list[pick];
        ships[r].setStart(spawn);
    }
}

function loadDefenseAndNeut(map, defenseCap){
    let neutPlayer = new player(0, "neutral");
    let neutFaction = new faction(0, "neutralF", {color: "#ddd", chars: ""});
    neutPlayer.faction = neutFaction;
    for(let r = 0; r < map.length; r++){
        map[r].defense = Math.floor(Math.random()* defenseCap);
        map[r].owner = neutPlayer;
    }
    return map;
}

function addDefense(map){
    for(let r = 0; r < map.length; r++){
        if(map[r].owner.id > 0){
            let up = map[r].prod;
            if(map[r].constShowing){
                up += up;
            }
            map[r].defense += up;
        }
    }
}

function render(gameData){
    gameData.artist.fillRect(0, 0, gameboard.width, gameboard.height, "#222", "#222");
    for(let r = 0; r < gameData.map.length; r++){
        gameData.map[r].drawConnections(gameData.artist, gameData.map);
    }

    for(let r = 0; r < gameData.map.length; r++){
        if(gameData.map[r].isTargeted){
            gameData.artist.drawTargetPointer(gameData.map[r].x, gameData.map[r].y, gameData.map[r].radius);
        }
    }
    
    for(let r = 0; r < gameData.map.length; r++){
        gameData.map[r].drawStar(gameData.artist);
    }
    
    for(let r = 0; r < gameData.map.length; r++){
        gameData.map[r].drawLabels(gameData.artist);
        if(gameData.debug){
            gameData.map[r].drawDebugs(gameData.artist);
        }
    }
    
    for(let r = 0; r < gameData.ships.length; r++){
        if(gameData.ships[r].faction.id == gameData.humanPlayer.faction.id || checkProximity(gameData.ships[r].at, gameData.map, gameData.humanPlayer.faction.id) || gameData.botWar){  
            gameData.ships[r].draw(gameData.artist);
        }  
        if(gameData.ships[r].player == gameData.humanPlayer){
            if(gameData.humanPlayer.pointerOn){
                gameData.artist.drawPointer(gameData.ships[r].x, gameData.ships[r].y, "#fff");
            }
        } 
    }
}

function uiSetup(gameData){
    inputSetup(gameData);
    gameboard.width = gameData.width;
    gameboard.height = gameData.height;
}

function pickSpawns(gameData, spawnCount, perPlayerMin){
    for(let s = 0; s < spawnCount; s++){
        let prodPick = Math.floor(Math.random()*86) + 15;
        let defensePick = Math.floor(Math.random()*1500) + (gameData.factions[0].players.length * perPlayerMin);
        for(let r = 0; r < gameData.factions.length; r++){
            let pick = Math.floor(Math.random()*gameData.map.length);
            if(gameData.map[pick].owner.id == 0){
                let playerPick = Math.floor(Math.random()*gameData.factions[r].players.length);
                gameData.map[pick].owner = gameData.factions[r].players[playerPick];
                gameData.map[pick].defense = defensePick;
                gameData.map[pick].production = prodPick;
            }
        }
    }
    return gameData.map;  
}

function checkConstLight(gameData){
    let map = gameData.map;
    let consts = gameData.consts;
    for(let r = 0; r < consts.length; r++){
        let con = consts[r];
        let on = false;
        if(map[con[0]].owner.faction.id != 0){
            on = true;
            for(let t = 0; t < con.length; t++){
                if(map[con[0]].owner.faction.id != map[con[t]].owner.faction.id){
                    on = false;
                }
            }
        }
        for(let c = 0; c < con.length; c++){
            map[con[c]].constShowing = on;
            if(on){
                map[con[c]].constId = r;
            }
            else{
                map[con[c]].constId = -1;
            }
        }
    }
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

function checkHit(gameData, isLongpress){
    console.log("checkhit");
    let canvRect = gameboard.getBoundingClientRect();
	let x = (event.clientX - canvRect.left);
	let y = (event.clientY - canvRect.top);
    let r;
    let map = gameData.map;
    let player = gameData.humanPlayer;
    let reps = map.length;
		for(r=0; r<reps;r++){
        let clickRad = map[r].radius*2;
        if(clickRad < 10) clickRad = 10;
		if (x >= (map[r].x - clickRad) && x <= (map[r].x + clickRad)){
			if (y >= (map[r].y - clickRad) && y <= (map[r].y + clickRad)){
                if(isLongpress){
                    if(checkProximity(map[r], map, player.faction.id) || map[r].isTargeted){
                        map[r].isTargeted = !map[r].isTargeted;
                        botTargetUpdate(gameData);
                        render(gameData);
                    }
                }
                else{
                    if(map[r] != player.ship.at){
                        if(map[r].faction.id == player.faction.id){
                            //console.log("flying!");
                            player.ship.fly(map[r]);
                            render(gameData);
                        }
                        else{
                            if(checkProximity(map[r], map, player.faction.id)){
                                //console.log("flying!");
                                player.ship.fly(map[r]);
                                render(gameData);
                            }
                        }
                        break;
                    }
                    else{
                        if(checkProximity(map[r], map, player.faction.id && player.attacked == false)){
                            let moveEvent = move(gameData, map[r], player);
                            botMapUpdate(gameData, moveEvent);
                            render(gameData);
                        }
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

function move(gameData, target, player){
    let map = gameData.map;
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
            checkConstLight(gameData);
        }
        else{
            target.defense -= stack;
            moveEvent.defender = target.owner;
            moveEvent.type = "attack";
        }
    }
    
    return moveEvent;
}

function botStart(gameData){
    let players = gameData.players;
    for(let r = 0; r < players.length; r++){
        if(players[r].isBot){
            players[r].onStart(gameData.map);
        }
    }
}

function botMapUpdate(gameData, moveEvent){
    let players = gameData.players;
    for(let r = 0; r < players.length; r++){
        if(players[r].isBot){
            players[r].mapUpdate(gameData.map, moveEvent);
        }
    }
}

function botTargetUpdate(gameData){
    let playerFac = gameData.humanPlayer.faction;
    let players = playerFac.players;
    for(let r = 0; r < players.length; r++){
        if(players[r].isBot){
            players[r].mapUpdate(gameData.map, {type:"target change"});
        }
    }
}

function botMove(gameData){
    let players = gameData.players;
    let moveEvent;
    for(let r = 0; r < players.length; r++){
        if(players[r].isBot && players[r].getOwned(gameData.map).length > 0){
            let movePick = players[r].makeMove(gameData.map);
            if(movePick != "fly"){
                if(checkProximity(movePick, gameData.map, players[r].faction.id)){
                    moveEvent = move(gameData, movePick, players[r]);
                    botMapUpdate(gameData, moveEvent);
                }
            }      
        }
    }
}

function hourRefresh(gameData){
    addDefense(gameData.map);
    render(gameData);
}

function attackRefresh(players){
    for(let r = 0; r < players.length; r++){
        players[r].attacked = false;
    }
}

function flightUpdate(gameData){
    gameData.humanPlayer.pointerOn = !gameData.humanPlayer.pointerOn;
    let ships = gameData.ships; 
    for(let r = 0; r < ships.length; r++){
        if(ships[r].flying){
            ships[r].stepToTarget();
        }
    }
    render(gameData);
}