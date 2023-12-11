var gameData = new game();
gameData.map = randomGen(3000,3000);
gameData.factions = loadTestFactions(10);
let plaShipPack = loadTestPlayersAndShips(gameData.factions);
gameData.players = plaShipPack[0];
gameData.ships = plaShipPack[1];
var player1 = new player(1, "Player");
player1.faction = gameData.factions[0];
player1.ship = gameData.ships[0];
gameData.factions[0].players[0] = player1;
gameData.players[0] = player1;
gameData.humanPlayer = player1;
gameData.map = loadDefenseAndNeut(gameData.map);
gameData.map = pickSpawns(gameData, 3);
setShipSpawns(gameData);

gameData.consts = genConsts(gameData.map, 5, 7);

botStart(gameData);

gameData.artist = new artist(gameboard.getContext("2d"));
uiSetup(gameData);
render(gameData);

var defenseIntTime = 60000;//3600000;
var flightIntTime = 1000;//1000;
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