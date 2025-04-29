var gameData = new game();
gameData.width = 3500;//4060;
gameData.height = 3500;//4060;
gameData.neutCostCap = 1500;
gameData.map = map;//convertMap(galconSnowflake2());//randomGen(gameData.width, gameData.height);
gameData.consts = genConsts(gameData.map, 5, 7);
gameData.map = loadDefenseAndNeut(gameData.map, gameData.neutCostCap);
gameData.spectateMode = spectatechx.checked;

//printAllStats(gameData.map, gameData.consts);
//printAvgMapsStats(50, gameData.width, gameData.height, 1500);

gameData.factions = loadFactions(factions);
let plaShipPack = loadTestPlayersAndShips(gameData.factions, playerCountinp.value);
gameData.players = plaShipPack[0];
gameData.ships = plaShipPack[1];
if(gameData.spectateMode == false){
    var player1 = new targetDrone(1, "Player");
    player1.enabled = false; //disabling autopilot mode
    var player1Ship = new ship(1, player1);
    player1.faction = gameData.factions[0];
    gameData.factions[0].players[0] = player1;
    gameData.players[0] = player1;
    gameData.ships[0] = player1Ship;
    gameData.humanPlayer = player1;
    gameData.humanPlayer.ship = player1Ship;
    gameData.ships[0].player = player1;
}
gameData.map = pickSpawns(gameData, Math.floor(Math.random()*50)+1, 0);
loadFactionsOwned(gameData);
gameData.coordinators = loadCoordinators(gameData.factions);
setShipSpawns(gameData);

gameData.botWar = false;
gameData.debug = false;
botStart(gameData);

gameData.artist = new artist(gameboard.getContext("2d"));
//uiSetup(gameData);
initListeners(gameData);
render(gameData);

var defenseIntTime = 10000;//60000;//3600000;
var flightIntTime = 100;
var attackIntTime = 100;
var botIntTime = 1000;
var defenseUpdater = "";
var flightUpdater = "";
var attackUpdater = "";
var botCaller = "";
defenseUpdater = setInterval(hourRefresh, defenseIntTime, gameData);
flightUpdater = setInterval(flightUpdate, flightIntTime, gameData);
attackUpdater = setInterval(attackRefresh, attackIntTime, gameData.players);
botCaller = setInterval(botMove, botIntTime, gameData);