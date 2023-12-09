class bot extends player{
    constructor(id, name){
        super(id, name);
    }
    mapUpdate(map, moveEvent){
        console.log("mapUpdate() not overriden!");
    }
    makeMove(map){
        console.log("makeMove() not overridden!");
    }
}