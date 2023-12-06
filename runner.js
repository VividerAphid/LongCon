var map = randomGen(1500,1500);//loadTestSet();
var factions = loadTestFactions();
var players = [];
var player1 = new player(1, "Player");
players.push(player1);
player1.faction = factions[0];
factions[0].players[0] = player1;
map = loadDefenseAndNeut(map);
map = pickSpawns(factions, map, 3);
//console.log(map);

var arty = new artist(gameboard.getContext("2d"));
var ships = [new ship(1, player1)];
ships[0].setStart(player1.faction.getOwned(map)[0]);
player1.ship = ships[0];
uiSetup(map, player1, arty, ships);
render(arty, map, ships);

var defenseIntTime = 60000;//3600000;
var flightIntTime = 1000;
var attackIntTime = 1000;
var defenseUpdater = "";
var flightUpdater = "";
var attackUpdater = "";
defenseUpdater = setInterval(hourRefresh, defenseIntTime, map, arty, ships);
flightUpdater = setInterval(flightUpdate, flightIntTime, arty, map, ships);
attackUpdater = setInterval(attackRefresh, attackIntTime, players);