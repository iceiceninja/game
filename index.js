var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")


let canMove = false;
let canTakeActions = false

let laserPistol = false

let credits = 100

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
    constructor(x,y,rad, color, health, alive){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.color = color
        this.health = health
        this.alive = alive
    }
    drawSelf(){
        drawBall(this.x,this.y,this.rad, this.color)
    }
    get currentHealth(){
        return this.health
    }
    set currentHealth(amount){
        this.health += amount;
        if(this.health <= 0)
        {
            this.alive = false
        }
    }
    get isAlive()
    {
        return this.alive
    }
    set isAlive(bool)
    {
        this.alive = bool
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

let player1 = new Player(squareSize * 1.5,squareSize*1.5,squareSize/2,"#0095DD",100, true)
let enemy1 = new Player(squareSize * 5.5,squareSize*5.5,squareSize/2, "#FF9999", 100, true)
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
    document.getElementById("credits").innerHTML = "Credits: " + credits
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
    if(player1.isAlive){
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
}

function enemyTurn()
{
    if(enemy1.isAlive){
        canTakeActions = false
        
        document.getElementById('gameStatus').innerHTML = "Enemy Turn"
        
        let currentSquare = findCurrentSquare(enemy1.center[0],enemy1.center[1])
        
        let movex = 0
        let movey = 0
        
        let differencex = (player1.center[0]-enemy1.center[0])
        let differencey = (player1.center[1]-enemy1.center[1])
        
        let offset = squareSize * 2.5
        // let offsety = squareSize * 2.5
        
        if(getDistance(enemy1.center[0], player1.center[0],enemy1.center[1], 
            player1.center[1]) <= squareSize * 3.5)
        {
            player1.currentHealth = -15
        }
        else{
            if(player1.center[0] != enemy1.center[0] && offset < Math.abs(differencex))
            {
                movex = differencex/Math.abs(differencex)
                // alert("movex: " + movex)
            }
            if(player1.center[1] != enemy1.center[1] && offset < Math.abs(differencey))
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
        }
    }
    endEnemyTurn()
}

class Action
{
    constructor(name, active, charges, range, price)
    {
        this.name = name;
        this.active = active;
        this.charges = charges;
        this.range = range;
        this.price = price;
        let actionNum = null
    }
    get selected()
    {
        return this.active
    }
    get getName()
    {
        return this.name
    }
    get number()
    {
        return this.actionNum
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
        this.actionNum = document.getElementById('actionList').innerHTML.split('<div').length
        document.getElementById('actionList').innerHTML += 
        "<div id=\"" + this.actionNum + "\" class=\"action\"\">("+ this.actionNum + ") " + this.name + "</div>"
    }
}




document.addEventListener("keyup", function(event) 
{
    if(event.key == "s"||event.key == "S")
    {
        openShop()
    }
    if(canTakeActions == true)
    {
        actions = document.querySelectorAll(".action")
        
        for(let i = 0; i < actions.length; i++)
        {
            unHighlight(actions[i])
            actionArray[i].selected = false;
        }
        for(let i = 0; i < actionArray.length; i++)
        {
            if(actionArray[i].number == event.key)
            {
                actionArray[i].selected = true
                switch (actionArray[i].name)
                {
                    case "Move":
                        rangeDisp.range = moveAction.relativeRange
                        break;
                    case "Laser Pistol":
                        rangeDisp.range = laserPistolAction.relativeRange
                        break;
                    case "Plasma Beam":
                        rangeDisp.range = searchAction("Plasma Beam").relativeRange
                        break;
                    default:
                        alert("Action Name not detected: " + actionArray[i].name)
                }
            }
        }
        highlight(document.getElementById(event.key))
    }
});

// Have a JSON file with a dictionary of the names of actions and their functions?

addAction("Move",false,100,1.5,0)
addAction("Laser Pistol",false,1,10, 10)
addAction("Plasma Beam",false,1,15, 30)
addAction("EMP Grenade",false,1,10, 50)
addAction("Laser Vision", false, 1, 10, 100)

let laserPistolAction = searchAction("Laser Pistol")
let moveAction = searchAction("Move")
let plasmaBeamAction = searchAction("Plasma Beam")

moveAction.obtained()
laserPistolAction.obtained()

// x and y represent the center of the effect
function fireEffect(x,y, duration, fill)
{
    let interval = setInterval(() =>{
        ctx.clearRect(x-squareSize/4,y-squareSize/4,squareSize/2,squareSize/2)
        drawRect(x-squareSize/4,y-squareSize/4,squareSize/2,squareSize/2,"#FFFFFF",fill);}, 50);

    setTimeout(function( ) { clearInterval( interval );}, duration);
    
}



function findCurrentSquare(x,y)
{
    col = Math.floor(x/squareSize)
    row = Math.floor(y/squareSize)
    return [row, col]
}
function mousePos(e)
    {
        let x = getMousePosition(canvas,e)[0];
        let y = getMousePosition(canvas,e)[1];
        col = Math.floor(x/squareSize)
        row = Math.floor(y/squareSize)
        return mapTiles[row][col].center;
    }

    //replace this whole function with just the ability to return mouse pos (on click) to action functions
    canvas.addEventListener("mousedown", function(e)
    {
        if(canTakeActions == true){
            targetTile = mousePos(e)

            for(let i = 0; i < actionArray.length; i++)
            {
                if(actionArray[i].selected == true)
                {
                    switch (actionArray[i].name)
                    {
                        case "Move":
                            move(targetTile)
                            break;
                        case "Laser Pistol":
                            LP(targetTile)
                            break;
                        case "Plasma Beam":
                            plasmaBeam(targetTile)
                            break; 
                        default:
                            alert("Action Name not detected on click: " + actionArray[i].name)
                    }
                }
            }
        }
    });


function withinRange(targetTile, action)
{
    return getDistance(player1.center[0],targetTile[0],player1.center[1],targetTile[1]) <= action.relativeRange
}
function damageTile(targetTile, damage)
{
    for(let i = 0;i<units.length;i++)
    {                
        if(units[i].center[0] == targetTile[0] && units[i].center[1] == targetTile[1])
        {
            units[i].currentHealth = -damage
        }
    }
}
function LP(targetTile)
{
    if(withinRange(targetTile, laserPistolAction))
    {
        fireEffect(targetTile[0],targetTile[1],150, "#FF1111")
        damageTile(targetTile,20)
        endPlayerTurn()
    }
    else
    {
        alert("notINrange")
    }
}
function move(targetTile)
{
    if(withinRange(targetTile, moveAction))
        {
            player1.move(targetTile[0],targetTile[1])
            endPlayerTurn()
        }else
        {
            alert("notINrange")
        }
}
function plasmaBeam(targetTile)
{
    if(withinRange(targetTile, plasmaBeamAction))
    {
        fireEffect(targetTile[0],targetTile[1],150, "#D5FF00")
        damageTile(targetTile,30)
        endPlayerTurn()
    }
    else
    {
        alert("notINrange")
    }
}

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

ALSO: 
-Work on a shop where you buy actions
-Work on making credits useful
-Work on making more actions
*/
////////////////////////////////////////////////////



function openShop()
{
    let shop = document.getElementById("shopMenu")
    if(shop.style.zIndex < 10)
    {
        shop.style.zIndex = 10
    }else
    {
        shop.style.zIndex = -1
    }
    
}

function purchase(name)
{
    
    let action =  searchAction(name)
    if(action.price <= credits)
    {
        credits -= action.price
        action.obtained()
        var list = document.getElementById("shop-list");
        var allItems = document.querySelectorAll("#shop-list li");
        for(let item = 0; item < allItems.length; item++)
        {
            if(action.name == String(allItems[item].innerHTML.split("<")[0]))
            {
                // console.log(allItems[item])
                list.removeChild(allItems[item])
            }
        }
    }
}

function addToShop(action, price)
{
    document.getElementById("shop-list").innerHTML += 
    "<li>" + action.name + "<button type=\"button\" onclick=\"purchase(\'" + action.name +"\')\"> $" + price + " </button> </li>"
}

// for(let i = 0; i<actionArray.length;i++){
//     addToShop(actionArray[i], "100")
// }

function highlight(element){
    if (element.style.background == 'rgb(126, 189, 194)'){
        element.style.background = 'transparent'
    }else{
        element.style.background = 'rgb(126, 189, 194)' 
    }
}
function unHighlight(element){
        element.style.background = 'transparent'
}
function addAction(name, active, charges, range, price)
{
    let newAction = new Action(name,active,charges,range,price)
    // newAction.obtained();
    actionArray.push(newAction)
    addToShop(newAction, price)

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