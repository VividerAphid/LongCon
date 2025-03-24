function addElement(id, type, parent, innards){
	var child = document.createElement(type);
	child.id = id;
	parent.appendChild(child);
	child.innerHTML = innards || "";
    return child;
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
    playerCountinp.max = Math.round(250 / factionCountinp.value);
    if((playerCountinp.value * 1) > (playerCountinp.max * 1)){
        playerCountinp.value = playerCountinp.max;
    }
    initFactions();
    initFactionListings();
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
        rInp.onchange = function(){colors[2][0] = rInp.value; updateFactionColor(r, colors); initFactionListings();};
        rInp.size = inpSize;
        rInp.min = 0;
        rInp.max = 255;
        let gDiv = addElement("gDiv"+r, "div", rgbDiv, "G: ");
        let gInp = addElement("gInp"+r, "input", gDiv);
        gInp.value = colors[2][1];
        gInp.onchange = function(){colors[2][1] = gInp.value; updateFactionColor(r, colors); initFactionListings();};
        gInp.size = inpSize;
        gInp.min = 0;
        gInp.max = 255;
        let bDiv = addElement("bDiv"+r, "div", rgbDiv, "B: ");
        let bInp = addElement("bInp"+r, "input", bDiv);
        bInp.value = colors[2][2];
        bInp.onchange = function(){colors[2][2] = bInp.value; updateFactionColor(r, colors); initFactionListings();};
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