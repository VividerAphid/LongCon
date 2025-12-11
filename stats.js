function calcRawProd(map){
    let production = 0;
    for(let r = 0; r < map.length; r++){
        production += map[r].prod;
    }
    return production;
}

function calcConstProd(map, consts){
    let production = 0;
    for(let r = 0; r < consts.length; r++){
        let con = consts[r];
        for(let t = 0; t < con.length; t++){
            production += map[con[t]].prod;
        }
    }
    return production;
}

function calcCost(map){
    let cost = 0;
    for(let r = 0; r < map.length; r++){
        cost += map[r].defense;
    }
    return cost;
}

function calcAvgProfitTime(map){
    let avgTime = 0;
    for(let r = 0; r < map.length; r++){
        avgTime += map[r].defense / map[r].prod;
    }
    return avgTime / map.length;
}

function calcAvgBucketProfit(map){
    let avgTime = 0;
    for(let r = 0; r < map.length; r++){
        avgTime += map[r].defense / (map[r].cap * .025);
    }
    return avgTime / map.length;
}

function printAllStats(map, consts){
    let rawProd = calcRawProd(map);
    let constProd = calcConstProd(map, consts);
    let totalProd = rawProd + constProd;
    let cost = calcCost(map);
    let avgProfit = calcAvgProfitTime(map);

    let hours = 720;
    console.log("Raw prod: " + rawProd);
    console.log("Const prod: " + constProd);
    console.log("Total cost: " + cost);
    console.log("Average Profit time: " + avgProfit);
    console.log("Total prod: " + totalProd);
    console.log("Defense produced over " + hours + " refreshes: " + totalProd * hours);
    console.log("Number of raw refreshes before profit: " + (cost / rawProd));
    console.log("Number of refreshes before profit: " + (cost / totalProd));
}

function totalAvgMapsStats(maps){
    let count = maps.length;
    let totalRawProdAvg = 0;
    let totalConstProdAvg = 0;
    let totalCostAvg = 0;
    let totalAvgProfitAvg = 0;
    let totalProdAvg = 0;
    for(let r = 0; r < maps.length; r++){
        let curr = maps[r];
        let rawProd = calcRawProd(curr.map);
        let constProd = calcConstProd(curr.map, curr.consts);
        totalRawProdAvg += rawProd;
        totalConstProdAvg += constProd;
        totalProdAvg += (rawProd + constProd);
        totalCostAvg += calcCost(curr.map);
        totalAvgProfitAvg += calcAvgProfitTime(curr.map);
    }
    let hours = 720;
    console.log("Avg Raw prod: " + totalRawProdAvg / count);
    console.log("Avg Const prod: " + totalConstProdAvg / count);
    console.log("Avg Total cost: " + totalCostAvg / count);
    console.log("Avg Average Profit time: " + totalAvgProfitAvg / count);
    console.log("Avg Total prod: " + totalProdAvg / count);
    console.log("Avg Defense produced over " + hours + " refreshes: " + (totalProdAvg/count) * hours);
    console.log("Avg Number of raw refreshes before profit: " + ((totalCostAvg/count) / (totalRawProdAvg/count)));
    console.log("Avg Number of refreshes before profit: " + ((totalCostAvg/count) / (totalProdAvg/count)));
}

function genAvgMaps(count, width, height, defenseCap){
    let maps = [];
    for(let r = 0; r < count; r++){
        let map = randomGen(width, height);
        let consts = genConsts(map, 5, 7);
        map = loadDefenseAndNeut(map, defenseCap);
        maps.push({map: map, consts: consts});
    }
    return maps;
}

function printAvgMapsStats(count, width, height, defenseCap){
    totalAvgMapsStats(genAvgMaps(count, width, height, defenseCap));
}