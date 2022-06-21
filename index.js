var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")


let canMove = false;
let canTakeActions = false

let laserPistol = false


let squareSize = canvas.height/13



let tick = 0
let mapTiles = [];
let mapTilesCol = [];
let colLength = 0


let isPlayerTurn = true
// let isEnemyTurn = false


let actionArray = []


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function drawRect(x,y,width,height, stroke, fill){
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.strokeStyle = stroke//"#000000"
    ctx.stroke();
    ctx.fillStyle = fill//"#FFFFFF";
    ctx.fill();
    ctx.closePath();
}
function drawBall(x,y,rad, color) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2); //x, y, radius, start angle, end angle
    // ctx.fillStyle = "#0095DD";
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
class mapTile{
    constructor(x,y,width,height,tileNum){
        this.x= x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tileNum = tileNum;
    }
    drawSelf() {
        drawRect(this.x,this.y,this.width,this.height,"#000000","#FFFFFF");    
    }
    get center(){
        return [(this.x + this.width/2),(this.y + this.height/2)]
    }
    occupied(){
        console.log(player1.center == this.center)
        //console.log(this.center)
        if(player1.center == this.center){
            console.log(this.tileNum + " is occupied")
        }
    }
}
class Player{
    constructor(x,y,rad, color, health){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.color = color
        this.health = health
    }
    drawSelf(){
        drawBall(this.x,this.y,this.rad, this.color)
    }
    get currentHealth(){
        return this.health
    }
    set currentHealth(amount){
        this.health += amount;
    }
    move(x , y){
        if(x > 0 && x < canvas.width){
            this.x = x;
        }else{
            alert("Error:invalid X")
        }
        if(y > 0 && y < canvas.height){
            this.y = y;
        }else{
            alert("Error: Invalid Y")
        }
    }
    get center(){
        return [this.x,this.y]
    }
}

class rangeBall
{
    constructor(x,y,rad)
    {
        this.x = x;
        this.y = y;
        this.rad = rad;   
    }
    drawSelf(){
        drawBall(this.x,this.y,this.rad, "#00FF9999")
    }
    set range(num)
    {
        this.rad = num;
    }
    set center(coordinates)
    {
        this.x = coordinates[0]
        this.y = coordinates[1]
    }
}

let player1 = new Player(squareSize * 1.5,squareSize*1.5,squareSize/2,"#0095DD",100)
let enemy1 = new Player(squareSize * 5.5,squareSize*5.5,squareSize/2, "#FF9999", 100)
let rangeDisp = new rangeBall(player1.center[0],player1.center[1], 0)

let units = []
units.push(player1)
units.push(enemy1)

player1.currentHealth = 0


function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x,y]
}

  



//To center something inside of mapTile, do squareSize * (number of tile -.5)
//This finds the tile, let's say 2nd from left, and instead of putting it at the end of the
//tile it places it halfway in the tile, which when drawing a circle, is exactly where we want it 


function draw()
{
    tick += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = 0
    let y = 0
    let tileNum = 1;
    while (y < canvas.height){
        while (x < canvas.width){
            let newMapTile = new mapTile(x,y,squareSize,squareSize, tileNum)
            if(colLength != 0 && mapTilesCol == colLength){
                pushPop(mapTilesCol,newMapTile)
            }else{
                mapTilesCol.push(newMapTile);
            }
            tileNum += 1;
            newMapTile.drawSelf()
            x+=squareSize
        }
        x = 0
        colLength = mapTilesCol.length;
        mapTiles.push(mapTilesCol);
        mapTilesCol = []
        y += squareSize
    } 
    rangeDisp.center = [player1.center[0], player1.center[1]]
    rangeDisp.drawSelf()
    if(player1.currentHealth > 0)
    {
        player1.drawSelf()
    }
    if(enemy1.currentHealth > 0)
    {
        enemy1.drawSelf()
    }
    document.getElementById("playerHealth").innerHTML = "Player Health: " + player1.currentHealth
}

function endPlayerTurn()
{
    //canMove = false
    canTakeActions = false
    isPlayerTurn = false
    enemyTurn()
}
function endEnemyTurn()
{
    isPlayerTurn = true
    playerTurn()
}
function getDistance(x1,x2,y1,y2)
{
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
}
function pushPop(array, pushElement)
{
    array.pop()
    array.push(pushElement)
}
let turnNum = 0

playerTurn()
function playerTurn()
{
    turnNum += 1
    canTakeActions = true
    document.getElementById('gameStatus').innerHTML = "Player Turn"
    document.getElementById('turnNum').innerHTML = "Turn: " + turnNum
    //CODE (WAIT FOR ACTION)
    // endPlayerTurn()
    // endPlayerTurn() Once an action has taken place. Can use a point system and when
    // max points are reached then pass turn
    // canTakeActions = false
}

function enemyTurn()
{
    canTakeActions = false
    document.getElementById('gameStatus').innerHTML = "Enemy Turn"
    let currentSquare = findCurrentSquare(enemy1.center[0],enemy1.center[1])
    let movex = 0
    let movey = 0
    let differencex = (player1.center[0]-enemy1.center[0])
    let differencey = (player1.center[1]-enemy1.center[1])
    let offsetx = squareSize * 2.5
    let offsety = squareSize * 2.5
    if(player1.center[0] != enemy1.center[0] && offsetx < Math.abs(differencex))
    {
        movex = differencex/Math.abs(differencex)
        // alert("movex: " + movex)
    }
    if(player1.center[1] != enemy1.center[1] && offsety < Math.abs(differencey))
    {
        movey = differencey/Math.abs(differencey)
        // alert("movey: " + movey)
    }
    enemy1.move(mapTiles[currentSquare[0]][currentSquare[1]].center[0] + (squareSize * movex),
        mapTiles[currentSquare[0]][currentSquare[1]].center[1] + (squareSize * movey))// + squareSize)
    
    //Get player current square in MapTIles coordinates
    // The line between player and enemy will always go through the square that the 
    //enemy should choose to walk though
    // Make an offset so that if the enemy is ranged he doesnt walk too close
    endEnemyTurn()
}

class Action
{
    constructor(name, active, charges, range)
    {
        this.name = name;
        this.active = active;
        this.charges = charges;
        this.range = range;
    }
    get selected()
    {
        return this.active
    }
    get getName()
    {
        return this.name
    }
    set selected(active)
    {
        this.active = active;
    }
    set addCharges(num)
    {
        this.charges += num;
    }
    get relativeRange()
    {
        return this.range * squareSize
    }
    printInfo()
    {
        alert(this.name,this.active,this.charges,this.range)
    }
    obtained()
    {
        let actionNum = document.getElementById('actionList').innerHTML.split('<div').length
        document.getElementById('actionList').innerHTML += "<div id=\"" + actionNum + "\" class=\"action\"\">("+ actionNum + ") " + this.name + "</div>"
    }
}




document.addEventListener("keyup", function(event) 
{
    if(canTakeActions == true)
    {
        actions = document.querySelectorAll(".action")
        
        for(let i = 0; i < actions.length; i++)
        {
            unHighlight(actions[i])
            actionArray[i].selected = false;
        }
        if(event.key != 0)
        {
            let currentAction = actionArray[event.key-1]
            currentAction.selected = true
        }else
        {
            let currentAction = actionArray[event.key]
            currentAction.selected = true
        }
        highlight(document.getElementById(event.key))
        for(let i = 0; i < actionArray.length; i++)
        {
            if(actionArray[i].selected == true)
            {
                switch (actionArray[i].name)
                {
                    case "Move":
                        canMove = true;
                        laserPistol = false
                        rangeDisp.range = moveAction.relativeRange
                        break;
                    case "Laser Pistol":
                        laserPistol = true
                        canMove = false
                        rangeDisp.range = laserPistolAction.relativeRange
                        break;
                    default:
                        alert("Action Name not detected")
                }
            }
        }
    }
});
addAction("Move",false,100,1.5)
addAction("Laser Pistol",false,1,10)
addAction("Plasma Beam",false,1,10)
addAction("EMP Grenade",false,1,10)
addAction("Laser Vision", false, 1, 10)


// x and y represent the center of the effect
function fireEffect(x,y, duration)
{
    let interval = setInterval(() =>{
        ctx.clearRect(x-squareSize/4,y-squareSize/4,squareSize/2,squareSize/2)
        drawRect(x-squareSize/4,y-squareSize/4,squareSize/2,squareSize/2,"#FFFFFF","#FF1111");}, 50);

    setTimeout(function( ) { clearInterval( interval );}, duration);
    
}

let laserPistolAction = searchAction("Laser Pistol")
let moveAction = searchAction("Move")

function findCurrentSquare(x,y)
    {
        col = Math.floor(x/squareSize)
        row = Math.floor(y/squareSize)
        // mapTiles[row][col]
        return [row, col]
    }
function mousePos(e)
    {
        let x = getMousePosition(canvas,e)[0];
        let y = getMousePosition(canvas,e)[1];
        col = Math.floor(x/squareSize)
        row = Math.floor(y/squareSize)
        // console.log(col + " " + row)
        return mapTiles[row][col].center;
    }
canvas.addEventListener("mousedown", function(e)
    {
        fireEffect(mousePos(e)[0], mousePos(e)[1],50)
        if(canTakeActions == true){
            targetTile = mousePos(e)
            // alert(targetTile)
            if(canMove == true)
            {
                if(getDistance(player1.center[0],targetTile[0],player1.center[1],targetTile[1]) <= moveAction.relativeRange)
                {
                    player1.move(targetTile[0],targetTile[1])
                    endPlayerTurn()
                }else
                {
                    alert("notINrange")
                    // alert(moveAction.relativeRange)
                }
                // targetTile = mousePos(e)
            }else if(laserPistol == true)
            {
                fireEffect(mousePos(e))
                if(getDistance(player1.center[0],targetTile[0],player1.center[1],targetTile[1]) <= laserPistolAction.relativeRange)
                {
                    for(let i = 0;i<units.length;i++)
                    {                
                        if(units[i].center[0] == targetTile[0] && units[i].center[1] == targetTile[1])
                        {
                            units[i].currentHealth = -10
                        }
                    }
                    endPlayerTurn()
                }
                else
                {
                    alert("notINrange")
                }
            }
        }
    });



////////////////////////////////////////////////////
/*


TODO:
Try adding action classes such as Translocation and Plasma or stuff like that.
That way you can make it where you dont have to specify spesific functions for each 
action, but instead you can say like Translocation(range) and now your normal move has
Translocation(1)
while a teleport could have
Translocation(10)
and a blink could have 
Translocation(3)
and you dont have to worry about coding each one
You can even access the action class and take the range for the action as input for the 
Translocation such as
Translocation(actionArray[i].range) or something like that


ALSO TODO:
Implement Turn System. You need to work on making it where you can keep track of turns and
each action you take costs a turn (or partt of a turn if you wanna get fancy)
That way you can also implement an enemy that moves when your turn is over


*/
////////////////////////////////////////////////////








function highlight(element){
    if (element.style.background == 'rgb(0, 255, 0)'){
        element.style.background = 'transparent'
    }else{
        element.style.background = 'rgb(0, 255, 0)' 
    }
}
function unHighlight(element){
        element.style.background = 'transparent'
}
function addAction(name, active, charges, range)
{
    let newAction = new Action(name,active,charges,range)
    newAction.obtained();
    actionArray.push(newAction)
}
function searchAction(name)
{
    for(let i = 0; i < actionArray.length; i++)
    {
        if(actionArray[i].name == name)
        {
            return actionArray[i]
        } 
    }
}

setInterval(draw,100)