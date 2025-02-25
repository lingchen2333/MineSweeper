const button = document.querySelector("button");
button.addEventListener("click", newGame);

const board = document.querySelector(".board");

let mines = [];
let playable = true;
let untouched = [];

function newGame(){
    board.replaceChildren(); //delete all existing children of board
    playable = true;
    // empty mines and untouched
    mines =[];
    untouched = [];
    for (let i =0; i<400; i++){
        const newDiv = document.createElement("div");
        const tile = "tile_" + (i+1);
        newDiv.setAttribute("id",tile);
        newDiv.addEventListener("click", function(){touchTile(tile)});
        board.appendChild(newDiv);
        untouched.push(tile);
        //adding tile to the mines
        if (Math.random() < 0.1){
            mines.push(tile);
        } 
    }
    console.log(mines);
}

function touchTile(tile){
    if (!playable) return;
    const div = document.getElementById(tile);
    if (mines.includes(tile)){ //tile is mine 
        playable= false;
        //reveal all bombs
        for (let mine of mines){
            const mineDiv = document.getElementById(mine);
            mineDiv.setAttribute("class","bomb");
            mineDiv.textContent = "*";
        }
    }
    else { //tile is not mine
        div.setAttribute("class",'clear');
        untouched.splice(untouched.indexOf(tile),1);
        //display number of neighbour mines
        const numberOfNeighbours = mineNeighbours(tile);
        if (numberOfNeighbours >0){
            div.textContent = numberOfNeighbours;
            const colour = setColour(tile,numberOfNeighbours);
            div.style.backgroundColor = colour;
        }
        else { // if a touched tile has 0 mine as neighbours, it calls touchTile on every previously un-touched neighbours
            let neighbours = getNeighbours(tile);
            for (let neighbour of neighbours){
                const neighbourTile = "tile_"+neighbour;
                if (untouched.includes(neighbourTile)){
                    touchTile(neighbourTile);
                }
            }
        }
    }
    //check if untouched === mines
    if (untouched.length === mines.length){
        playable = false;
        alert("You have won!");
    }
   
    
}

function mineNeighbours(tile){
    const neighbours = getNeighbours(tile);
    let count = 0;
    for (let neighbour of neighbours){
        if (neighbourIsMine(neighbour)){
            count += 1;
        }
    }
    //console.log("count: "+ count);
    return count;
}

function getNeighbours(tile){
    let tileNumber = Number(tile.split("_")[1]);
    let topRow = false, bottomRow = false, leftColumn = false, rightColumn = false;
    let neighbours = [];
    if (Math.ceil(tileNumber/20) === 1 ){
        topRow = true;
    } 
    else {
        neighbours.push(tileNumber-20);
        //console.log("top neighbour: tile_"+(tileNumber-20));
    }

    if (Math.ceil(tileNumber/20) === 20){
        bottomRow = true;
    }
    else {
        neighbours.push(tileNumber+20);
        //console.log("bottom neighbour: tile_"+(tileNumber+20));
    }

    if (tileNumber % 20 === 1){
        leftColumn = true;
    }
    else {
        neighbours.push(tileNumber-1);
        //console.log("left neighbour: tile_"+(tileNumber-1));
    }

    if (tileNumber % 20 === 0){
        rightColumn = true;
    }
    else {
        neighbours.push(tileNumber+1);
        //console.log("right neighbour: tile_"+(tileNumber+1));
    }

    //top left 
    if ((!topRow) && (!leftColumn)){
        neighbours.push(tileNumber-21);
        //console.log("top left neighbour: tile_"+(tileNumber-21));
    }
    //top right
    if ((!topRow) && (!rightColumn)){
        neighbours.push(tileNumber-19);
        //console.log("top right neighbour: tile_"+(tileNumber-19));
    }
    //bottom left
    if ((!bottomRow) && (!leftColumn)){
        neighbours.push(tileNumber+19);
        //console.log("bottom left neighbour: tile_"+(tileNumber+19));
    }
    //bottom right
    if ((!bottomRow) && (!rightColumn)){
        neighbours.push(tileNumber+21);
        //console.log("bottom right neighbour: tile_"+(tileNumber+21));
    }
    return neighbours;
}


function neighbourIsMine(neighbourNumber){
    if (mines.includes("tile_"+neighbourNumber)){
        //console.log("bomb: tile_"+neighbourNumber);
        return true;
    } 
    return false;
}

function setColour(tile,numberOfNeighbours){
    let colour;
    switch (numberOfNeighbours){
        case 1: colour = "rgb(158, 240, 110)"; break;
        case 2: colour = "rgb(240, 238, 110)"; break;
        case 3: colour = "rgb(247, 160, 126)"; break;
        case 4: colour = "pink"; break;
        case 5: colour = "orange"; break;
        case 6: colour = "blue"; break;
        case 7: colour = "purple"; break;
        case 8: colour = "white"; break;
    }
    return colour;
}