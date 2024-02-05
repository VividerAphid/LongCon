var gameData = new game();
gameData.width = 4060;
gameData.height = 4060;
gameData.map = randomGen(gameData.width, gameData.height);
gameData.consts = genConsts(gameData.map, 5, 7);
gameData.map = loadDefenseAndNeut(gameData.map, 1500);

//printAllStats(gameData.map, gameData.consts);
printAvgMapsStats(50, gameData.width, gameData.height, 1500);

gameData.factions = loadTestFactions(1);
let plaShipPack = loadTestPlayersAndShips(gameData.factions, 5);
gameData.players = plaShipPack[0];
gameData.ships = plaShipPack[1];
var player1 = new player(1, "Player");
player1.faction = gameData.factions[0];
player1.ship = gameData.ships[0];
gameData.factions[0].players[0] = player1;
gameData.players[0] = player1;
gameData.humanPlayer = player1;
gameData.ships[0].player = player1;
gameData.map = pickSpawns(gameData, 3, 250);
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