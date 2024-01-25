var inputData = {
    gameDataRef: "",
    mouseDownStart: 0,
}

function inputSetup(datref){
    inputData.gameDataRef = datref;
    gameboard.addEventListener("mousedown", (e) => handleMouseDown());
    gameboard.addEventListener("mouseup", (e) => handleMouseUp());
    gameboard.addEventListener("touchstart", (e) => handleMouseDown());
    gameboard.addEventListener("touchend", (e) => handleMouseUp());
}

function handleMouseDown(){
    inputData.mouseDownStart = Date.now();
}

function handleMouseUp(){
    let longpress = false;
    if(Date.now() - inputData.mouseDownStart > 750){
        console.log("long press!");
        longpress = true;
    }
    checkHit(inputData.gameDataRef, longpress);
}