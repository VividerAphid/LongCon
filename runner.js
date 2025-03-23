var gameData = new game();
gameData.width = 3500;//4060;
gameData.height = 3500;//4060;
gameData.map = convertMap(galconSnowflake1());//randomGen(gameData.width, gameData.height);
gameData.consts = genConsts(gameData.map, 9, 12);
gameData.map = loadDefenseAndNeut(gameData.map, 1500);

//printAllStats(gameData.map, gameData.consts);
//printAvgMapsStats(50, gameData.width, gameData.height, 1500);

gameData.factions = loadTestFactions(10);
let plaShipPack = loadTestPlayersAndShips(gameData.factions, 15);
gameData.players = plaShipPack[0];
gameData.ships = plaShipPack[1];
var player1 = new player(1, "Player");
var player1Ship = new ship(1, player1);
player1.faction = gameData.factions[0];
gameData.factions[0].players[0] = player1;
gameData.players[0] = player1;
gameData.ships[0] = player1Ship;
gameData.humanPlayer = player1;
gameData.humanPlayer.ship = player1Ship;
gameData.ships[0].player = player1;
gameData.map = pickSpawns(gameData, Math.floor(Math.random()*50)+1, 250);
gameData.coordinators = loadCoordinators(gameData.factions);
setShipSpawns(gameData);

gameData.botWar = false;
gameData.debug = false;
botStart(gameData);

gameData.artist = new artist(gameboard.getContext("2d"));
uiSetup(gameData);
render(gameData);

var defenseIntTime = 60000;//3600000;
var flightIntTime = 1000;
var attackIntTime = 1000;
var botIntTime = 5000;
var defenseUpdater = "";
var flightUpdater = "";
var attackUpdater = "";
var botCaller = "";
defenseUpdater = setInterval(hourRefresh, defenseIntTime, gameData);
flightUpdater = setInterval(flightUpdate, flightIntTime, gameData);
attackUpdater = setInterval(attackRefresh, attackIntTime, gameData.players);
botCaller = setInterval(botMove, botIntTime, gameData);