function addElement(id, type, parent, innards){
	var child = document.createElement(type);
	child.id = id;
	parent.appendChild(child);
	child.innerHTML = innards || "";
    return child;
}

function validateElementMinMax(element){
    if((element.value * 1) > (element.max * 1)){
        element.value = element.max;
    }
    if((element.value * 1) < (element.min * 1)){
        element.value = element.min;
    }
}

function toggleFactionCountSelect(){
    if(factionCountdrp.selectedIndex == 0){
        factionCountinp.style.display = "none";
    }
    else{
        factionCountinp.style.display = "inline";
        initFactionListings();
    }
}

function togglePlayerCountSelect(){
    if(playerCountdrp.selectedIndex == 0){
        playerCountinp.style.display = "none";
    }
    else{
        playerCountinp.style.display = "inline";
    }
}

function toggleCoordinatorChxDisabled(){
    coordinatorChx.disabled = !coordinatorChx.disabled;
    if(coordinatorChx){
        coordinatorChx.checked = true;
    }
}

function factionCountChange(){
    validateElementMinMax(factionCountinp);
    playerCountinp.max = Math.round(250 / factionCountinp.value);
    if((playerCountinp.value * 1) > (playerCountinp.max * 1)){
        playerCountinp.value = playerCountinp.max;
    }
    initFactions();
    initFactionListings();
}

function playerCountChange(){
    validateElementMinMax(playerCountinp);
}

function initFactionListings(){
    factionListing.innerHTML = "";
    let count = 0;
    if (factionCountdrp.selectedIndex == 1){
        count = factionCountinp.value;
    }   
    else{
        count = 1;
    }
    for(let r = 0; r < count; r++){
        let el = addElement("fac"+r, "div", factionListing, "Faction"+r +" ");
        let colors = factions[r].colors;
        el.style.background = colors[0];
        el.style.color = colors[1];
        let inpSize = 2;
        let rgbDiv = addElement("rgbDiv"+r, "div", el);
        let rDiv = addElement("rDiv"+r, "div", rgbDiv, "R: ");
        let rInp = addElement("rInp"+r, "input", rDiv);
        rInp.value = colors[2][0];
        rInp.onchange = function(){validateElementMinMax(rInp); colors[2][0] = rInp.value; updateFactionColor(r, colors); initFactionListings();};
        rInp.size = inpSize;
        rInp.min = 0;
        rInp.max = 255;
        let gDiv = addElement("gDiv"+r, "div", rgbDiv, "G: ");
        let gInp = addElement("gInp"+r, "input", gDiv);
        gInp.value = colors[2][1];
        gInp.onchange = function(){validateElementMinMax(gInp); colors[2][1] = gInp.value; updateFactionColor(r, colors); initFactionListings();};
        gInp.size = inpSize;
        gInp.min = 0;
        gInp.max = 255;
        let bDiv = addElement("bDiv"+r, "div", rgbDiv, "B: ");
        let bInp = addElement("bInp"+r, "input", bDiv);
        bInp.value = colors[2][2];
        bInp.onchange = function(){validateElementMinMax(bInp); colors[2][2] = bInp.value; updateFactionColor(r, colors); initFactionListings();};
        bInp.size = inpSize;
        bInp.min = 0;
        bInp.max = 255;

        rDiv.className = "factionRGBEntry";
        gDiv.className = "factionRGBEntry";
        bDiv.className = "factionRGBEntry";
        rgbDiv.style.display = "inline";
        el.style.width = "25%";
    }
}

function initFactions(){
    let count = factionCountinp.value;
    for(let r = 0; r < count; r++){
        if(!factions[r]){
            factions[r] = {};
            factions[r].name = "Faction"+r;
            factions[r].colors = genRandomColor(true);
        }
    }
}

function updateFactionColor(id, colors){
    let newCols = ["rgb("+ colors[2][0]+ ","+colors[2][1]+","+colors[2][2]+")",
    calcInverseColor(colors[2][0],colors[2][1],colors[2][2]),
    colors[2]
    ];
    factions[id].colors = newCols;
}

function updateMap(){
    switch(mapdrp.selectedIndex){
        case 0:
            map = randomGen(3500,3500);
            break;
        case 1:
            map = convertMap(galconGalaxy7());
            break;
        case 2:
            map = convertMap(galconGalaxy8());
            break;
        case 3:
            map = convertMap(galconSnowflake1());
            break;
        case 4:
            map = convertMap(galconSnowflake2());
            break;
        case 5:
            map = convertMap(aphidGalaxy1());
            break;
        case 6:
            map = convertMap(microGalaxy());
            break;
    }
}

function startBtnClick(){
    if(factionCountdrp.selectedIndex == 0){
        factionCountinp.value = Math.floor(Math.random()*23)+ 2;
        initFactions();
    }
    if(playerCountdrp.selectedIndex == 0){
        let max = maxAllowedPlayers / factionCountinp.value;
        playerCountinp.value = Math.floor(Math.random()*max)+ 1;
    }
    factions = factions.slice(0, factionCountinp.value);
    //console.log(factions);
    addElement("runnerScr", "script", document.body);
    runnerScr.setAttribute('src', "runner.js");
    menuDiv.style.display = "none";
}

function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1){
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e.clientX && e.clientY){
        return { x: e.clientX, y: e.clientY };      
    }
}

function onPointerDown(e, art)
{
  //console.log("pointerdown");
    art.isDragging = true;
    art.dragStart.x = getEventLocation(e).x/ art.cameraZoom - art.cameraOffset.x;
    art.dragStart.y = getEventLocation(e).y/ art.cameraZoom - art.cameraOffset.y;
    art.mouseDownStart.x = getEventLocation(e).x;
    art.mouseDownStart.y = getEventLocation(e).y;
}

function onPointerUp(e, art, mats)
{
  //console.log("pointerup");
    art.isDragging = false;
    art.lastZoom = art.cameraZoom;
    let mouseUpCoord = {x: getEventLocation(e).x, y: getEventLocation(e).y};
    let dragDistance = findLengthPoints(mouseUpCoord.x, art.mouseDownStart.x, mouseUpCoord.y, art.mouseDownStart.y);
    //Check dragDistance to reduce weird feeling when trying to click
    if(!art.dragChanged || dragDistance < 5){
      //console.log("clicked!");
      checkHit(mats, false);
    }
    art.dragChanged = false;
}

function onPointerMove(e, art)
{
  //console.log("pointermove");
    if (art.isDragging)
    {
      //console.log("checking drag");
      tempOffsetX = getEventLocation(e).x / art.cameraZoom - art.dragStart.x;
      tempOffsetY = getEventLocation(e).y / art.cameraZoom - art.dragStart.y;
      if(art.cameraOffset.x != tempOffsetX ||  art.cameraOffset.y != tempOffsetY){
        //console.log("drag");
        art.cameraOffset.x = getEventLocation(e).x / art.cameraZoom - art.dragStart.x;
        art.cameraOffset.y = getEventLocation(e).y / art.cameraZoom - art.dragStart.y;
        art.dragChanged = true;
      }
      
    }
}

function handleTouch(e, singleTouchHandler, art, mats)
{
  //console.log(e.type);
    if ( e.touches.length == 1 )
    {
      //console.log("touch");
        singleTouchHandler(e, art, mats);
        art.initialPinchDistance = null;
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
      //console.log("pinch");
        art.isDragging = false;
        handlePinch(e, art);
    }
}

function handlePinch(e, art)
{
  //console.log("pinch");
  //let initialPinchDistance = null;
  e.preventDefault();
  
  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
  
  let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2;
  
  if (art.initialPinchDistance == null){
      art.initialPinchDistance = currentDistance;
  }
  else{
      adjustZoom(art, null, currentDistance/art.initialPinchDistance);
  }
}

function adjustZoom(art, zoomAmount, zoomFactor)
{
    if (!art.isDragging){
        if (zoomAmount){
          art.cameraZoom += zoomAmount;
        }
        else if (zoomFactor){
            console.log(zoomFactor);
            art.cameraZoom = zoomFactor*art.lastZoom;
        }
        
        art.cameraZoom = Math.min(art.cameraZoom, art.maxZoom);
        art.cameraZoom = Math.max(art.cameraZoom, art.minZoom);
        
    }
}

function updateTranslationAndZoom(gameData){
  //console.log("updater");
  let art = gameData.artist;
  art.ctx.resetTransform();
  art.ctx.clearRect(0, 0, art.ctx.canvas.width, art.ctx.canvas.height);
  art.ctx.imageSmoothingEnabled = false;
  art.ctx.translate((-art.ctx.canvas.width / 2) + art.cameraOffset.x, (-art.ctx.canvas.height / 2) + art.cameraOffset.y);
  art.ctx.scale(art.cameraZoom, art.cameraZoom);
  render(gameData);
  requestAnimationFrame(function(){updateTranslationAndZoom(gameData);});
}

function setCanvasDimensions(){
  gameboard.width = (window.innerWidth)*.97;
  gameboard.height = (window.innerHeight)*.9;
}

function initListeners(gameData){
    window.onresize = setCanvasDimensions;
    setCanvasDimensions();
    gameboard.style.display = "inline";
    tabBar.style.display = "block";
    mapTabBtn.click();
    gameboard.addEventListener('mousedown', (e) => onPointerDown(e, gameData.artist));
    gameboard.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown, gameData.artist, gameData));
    gameboard.addEventListener('mouseup', (e) => onPointerUp(e, gameData.artist, gameData));
    gameboard.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp, gameData.artist, gameData));
    gameboard.addEventListener('mousemove', (e) => onPointerMove(e, gameData.artist));
    gameboard.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove, gameData.artist, gameData));
    gameboard.addEventListener( 'wheel', (e) => adjustZoom(gameData.artist, -e.deltaY*gameData.artist.scrollSensitivity))
    updateTranslationAndZoom(gameData);
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function statsTabClick(event, gameData){
  loadScoreboard(gameData);
  openTab(event, 'statsDiv');
}

function loadScoreboard(gameData){
  scoreBox.innerHTML = "";
  let facs = [];
  for(let r = 0; r < gameData.factions.length; r++){
    facs.push([r, gameData.factions[r].getScore(gameData.map)]);
  }
  facs.sort(function(a,b){return b[1]-a[1]});
  for(let r = 0; r < facs.length; r++){
    let line = addElement("fac"+r, "div", scoreBox, gameData.factions[facs[r][0]].name+ ": " + facs[r][1]);
    line.style.color = gameData.factions[facs[r][0]].color;
  }
}