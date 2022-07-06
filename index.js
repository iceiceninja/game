var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

let canTakeActions = false

let credits = 100

let squareSize = canvas.height/13

let units = []
let enemies = []
let allies = []

let tick = 0
let mapTiles = [];

let colLength = 0

let isPlayerTurn = true
let isAoe = false


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
        let row = null
        let col = null
    }
    drawSelf() {
        drawRect(this.x,this.y,this.width,this.height,"#000000","#FFFFFF");    
    }
    get center(){
        return [(this.x + this.width/2),(this.y + this.height/2)]
    }
    get getRow()
    {
        return this.row
    }
    set setRow(num)
    {
        this.row = num
    }
    get getCol()
    {
        return this.col
    }
    set setCol(num)
    {
        this.col = num
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
    constructor(name,x,y, color, health, alive,effects,shield){
        this.name = name
        this.x = x;
        this.y = y;
        // this.rad = rad;
        this.rad = squareSize/2
        this.color = color
        this.health = health
        this.alive = alive
        this.effects = effects
        this.shield = shield
    }
    drawSelf(){
        drawBall(this.x,this.y,this.rad, this.color)
    }
    get getName()
    {
        return this.name
    }
    get currentHealth(){
        return this.health
    }
    set currentHealth(amount){
        this.health += amount;
        // console.log(this.name + ":" + this.health)
        if(this.health <= 0)
        {
            this.alive = false
        }
    }
    get currentShield()
    {
        return this.shield
    }
    set currentShield(num)
    {
        this.shield += num
    }
    get currentEffects()
    {
        return this.effects
    }
    set currentEffects(effect)
    {
        this.effects.push(effect)
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
        let validMove = true
        for(let i = 0;i < units.length; i++)
        {
            if(units[i].center[0] == x && units[i].center[1] == y && units[i].isAlive == true)
            {
                console.log("collision avoided")
                validMove = false
            }
        }
        if(x > 0 && x < canvas.width && validMove){
            this.x = x;
        }else{
            console.log("Error:invalid X")
        }
        if(y > 0 && y < canvas.height && validMove){
            this.y = y;
        }else{
            console.log("Error: Invalid Y")
        }
    }
    get center(){
        return [this.x,this.y]
    }
}

class rangeBall
{
    constructor(x,y,rad, color)
    {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.color = color;   
    }
    drawSelf(){
        drawBall(this.x,this.y,this.rad, this.color)
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

let player1 = new Player("Player",squareSize * 1.5,squareSize*1.5,"#0095DD",100, true,[],0)

let rangeDisp = new rangeBall(player1.center[0],player1.center[1], 0,"#00FF9999")
let aoeRange = new rangeBall(player1.center[0],player1.center[1], 0, "#400F0333")

makeEnemy("Enemy1",squareSize * 11.5,squareSize*15.5, "#FF9999", 10, true,[],0)
makeEnemy("Enemy2",squareSize * 5.5,squareSize*5.5, "#FF9999", 10, true,[],0)
// makeEnemy("Enemy3",squareSize * 7.5,squareSize*3.5, "#FF9999", 10, true,[],0)
makeEnemy("Enemy3",squareSize * 7.5,squareSize*2.5, "#FF9999", 10, true,[],0)//"Enemy4",squareSize * 17.5,squareSize*1.5, "#FF9999", 10, true,[],0

units.push(player1)

allies.push(player1)

player1.currentHealth = 0

function makeEnemy(name,x,y, color, health, alive,effects,shield)
{
    let newEnemy = new Player(name,x,y, color, health, alive,effects,shield)
    units.push(newEnemy)
    enemies.push(newEnemy)
}

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
    let mapTilesCol = [];
    let row = 0
    tick += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = 0
    let y = 0
    let tileNum = 1;
    while (y < canvas.height){
        while (x < canvas.width){
            let newMapTile = new mapTile(x,y,squareSize,squareSize, tileNum)
            mapTilesCol.push(newMapTile);
            newMapTile.setCol = mapTilesCol.length -1
            newMapTile.setRow = row
            tileNum += 1;
            newMapTile.drawSelf()
            x+=squareSize
        }
        x = 0
        colLength = mapTilesCol.length;
        mapTiles.push(mapTilesCol);
        row += 1
        mapTilesCol = []
        y += squareSize
    } 
    rangeDisp.center = [player1.center[0], player1.center[1]]
    rangeDisp.drawSelf()

    rangeDisp.center = [player1.center[0], player1.center[1]]
    aoeRange.drawSelf()

    if(player1.currentHealth > 0)
    {
        player1.drawSelf()
    }
    for(let i = 0; i < enemies.length; i++){
        if(enemies[i].currentHealth > 0)
        {
            enemies[i].drawSelf()
        }else
        {
            enemies[i].isAlive = false
        }
    }
    document.getElementById("playerHealth").innerHTML = "Player Health: " + player1.currentHealth + "<br>Player Shield: " + player1.currentShield
    document.getElementById("credits").innerHTML = "Credits: " + credits
}

function endPlayerTurn()
{
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
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i]
        if(currentEnemy.isAlive){
            canTakeActions = false
            
            document.getElementById('gameStatus').innerHTML = "Enemy Turn"
            
            let currentSquare = findCurrentSquare(currentEnemy.center[0],currentEnemy.center[1])
            
            let movex = 0
            let movey = 0
            
            let differencex = (player1.center[0]-currentEnemy.center[0])
            let differencey = (player1.center[1]-currentEnemy.center[1])
            
            let offset = squareSize * 2.5
            
            if(getDistance(currentEnemy.center[0], player1.center[0],currentEnemy.center[1], 
                player1.center[1]) <= laserPistolAction.relativeRange)
            {
                LP(player1.center)
            }
            else{
                if(player1.center[0] != currentEnemy.center[0] && offset < Math.abs(differencex))
                {
                    movex = differencex/Math.abs(differencex)
                    // alert("movex: " + movex)
                }
                if(player1.center[1] != currentEnemy.center[1] && offset < Math.abs(differencey))
                {
                    movey = differencey/Math.abs(differencey)
                    // alert("movey: " + movey)
                }
                currentEnemy.move(mapTiles[currentSquare[0]][currentSquare[1]].center[0] + (squareSize * movex),
                    mapTiles[currentSquare[0]][currentSquare[1]].center[1] + (squareSize * movey))// + squareSize)
                
                //Get player current square in MapTIles coordinates
                // The line between player and enemy will always go through the square that the 
                //enemy should choose to walk though
                // Make an offset so that if the enemy is ranged he doesnt walk too close
            }
        }
    }
    endEnemyTurn()
}

class Action
{
    constructor(name, active, charges, range, price, aoe)
    {
        this.name = name;
        this.active = active;
        this.charges = charges;
        this.range = range;
        this.price = price;
        let actionNum = null
        this.aoe = aoe
    }
    get selected()
    {
        return this.active
    }
    get getName()
    {
        return this.name
    }
    get relativeAoe()
    {
        return this.aoe * squareSize
    }
    set relativeAoe(num)
    {
        this.aoe = num * squareSize
    }
    get currAoe()
    {
        return this.aoe
    }
    set currAoe(num)
    {
        this.aoe = num
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
        
        var list = document.getElementById("shop-list");
        var allItems = document.querySelectorAll("#shop-list li");
        for(let item = 0; item < allItems.length; item++)
        {
            if(this.name == String(allItems[item].innerHTML.split("<")[0]))
            {
                list.removeChild(allItems[item])
            }
        }
    }
}




document.addEventListener("keyup", function(event) 
{
    aoeRange.range = 0
    isAoe = false
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
        }
        for(let i = 0; i < actionArray.length; i++)
        {
            actionArray[i].selected = false;
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
                        rangeDisp.range = plasmaBeamAction.relativeRange
                        break;
                    case "Weak Shield":
                        rangeDisp.range = weakShieldAction.relativeRange
                        break;
                    case "Thermal Grenade":
                        isAoe = true
                        rangeDisp.range = thermalGrenadeAction.relativeRange
                        // aoeRange.range = thermalGrenadeAction.relativeRange
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
addAction("Thermal Grenade",false,1,6, 50,2)
addAction("Weak Shield", false, 1, .75, 25)

let laserPistolAction = searchAction("Laser Pistol")
let moveAction = searchAction("Move")
let plasmaBeamAction = searchAction("Plasma Beam")
let weakShieldAction = searchAction("Weak Shield")
let thermalGrenadeAction = searchAction("Thermal Grenade")

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
        return mapTiles[row][col];
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
                            move(targetTile.center)
                            break;
                        case "Laser Pistol":
                            LP(targetTile.center)
                            break;
                        case "Plasma Beam":
                            plasmaBeam(targetTile.center)
                            break; 
                        case "Weak Shield":
                            weakShield(targetTile.center)
                            break;
                        case "Thermal Grenade":
                            // aoeRange.center = [targetTile.center[0], targetTile.center[1]]
                            // aoeRange.range = 3 * squareSize
                            thermalGrenade(targetTile)
                            break;
                        default:
                            alert("Action Name not detected on click: " + actionArray[i].name)
                    }
                }
            }
        }
    });
    canvas.addEventListener("mousemove", function(e){
        if(isAoe)
        {
            targetTile = mousePos(e)
            aoeRange.center = [targetTile.center[0], targetTile.center[1]]
            aoeRange.range = thermalGrenadeAction.relativeAoe
        }
    })


function withinRange(targetTile, action)
{
    return getDistance(player1.center[0],targetTile[0],player1.center[1],targetTile[1]) <= action.relativeRange
}
function damageTile(targetTile, damage)
{
    // console.log("Target: " + targetTile)
    for(let i = 0;i<units.length;i++)
    {                
        if(round(units[i].center[0],5) == round(targetTile[0],5) && round(units[i].center[1],5) == round(targetTile[1],5))
        {
            if(units[i].currentShield > 0)
            {
                units[i].currentShield = -1
            }
            else
            {
                units[i].currentHealth = -damage
                console.log(units[i].name + " just took " + damage + " damage")
            }
        }
    }
}
function searchArray(array, searchName)
{
    for(let i = 0; i<array.length;i++){
        if(array[i].name == searchName)
        {
            return array[i]
            // damageTile(units[i].center,10)
        }
    }
}
function round(num,decimalPlace) {
    const d = Math.pow(10, decimalPlace);
    return Math.round((num + Number.EPSILON) * d) / d;
}
function LP(targetTile)
{
    if(withinRange(targetTile, laserPistolAction))
    {
        fireEffect(targetTile[0],targetTile[1],150, "#FF1111")
        damageTile(targetTile,5)
        if(canTakeActions == true){
            endPlayerTurn()
        }
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
function weakShield(targetTile)
{
    if(withinRange(targetTile, weakShieldAction))
    {
        for(let i = 0;i<units.length;i++)
        {                
            if(units[i].center[0] == targetTile[0] && units[i].center[1] == targetTile[1])
            {
                units[i].currentShield = 1
            }
        }
        endPlayerTurn()
    }else
    {
        alert("Not in range")
    }
}
function thermalGrenade(targetTile)
{
    
    if(withinRange(targetTile.center, thermalGrenadeAction))
    {
        let radius = thermalGrenadeAction.currAoe 
        // console.log(topLeftRow,targetTile.row + (2*radius))

        // Top left tile is ... mapTiles[targetTile.row - thermalGrenadeAction.radius][targetTile.col - thermalGrenadeAction.radius]
        let topLeftRow = targetTile.row - radius
        let topLeftCol = targetTile.col - radius
        let bottomRightRow = targetTile.row + radius
        let bottomRightCol = targetTile.col + radius
        for(let currRow = 0; currRow <= bottomRightRow-topLeftRow;currRow++)
        {
            // console.log("Hello")
            for(let currCol = 0; currCol <= bottomRightCol-topLeftCol;currCol++)
            {
                if(topLeftRow + currRow >= 0 && topLeftCol + currCol >= 0)
                {
                    if(round(getDistance(targetTile.center[0],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[0],targetTile.center[1],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[1]),6) <= round(thermalGrenadeAction.relativeAoe,6))
                    {                   
                        console.log(getDistance(targetTile.center[0],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[0],targetTile.center[1],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[1]), thermalGrenadeAction.relativeAoe)
                        fireEffect(mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[0],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[1],150,"#FF0000")
                        damageTile(mapTiles[topLeftRow + currRow][topLeftCol + currCol].center,10)
                    }
                   
                }
            }
        }
        
    }
    else
    {
        alert("Outta range")
    }
}
////////////////////////////////////////////////////
/*
TO MAKE AN ACTION:
1.Make the action using addAction function:
EX: addAction("Laser Pistol",false,1,10, 10)
             (name, active, charges, range, price)

2. Make refrence to the actual action
EX: let laserPistolAction = searchAction("Laser Pistol")

3. Make all functionality for the action
EX: The LP(targetTile) function

4. Calculate rangeDisp when key is pressed and call function on click

Your action should now appear for purchase in the shop and should be ready for use

ACTION IDEAS:

Summoning Actions: Build robot, call allies, hack (turns robot enemy to ally), Create mech
Damage: (Diff dmg types: Thermal(laser), plasma(plasma), physical(bullets and knives), antiThermal (ice stuff)
            , psionics, gravity),
        frag grenade, Mag rifle (magnetic), Void carbine, spike thrower, Thunder gun, Suit ripper, stun baton
Defence: Shields, create structures?, Different types of armor with different abilities (Combat armor,Speed armor, Storm armor)
Movement: blink, teleport, phase(blink but through walls)
Drugs: One time use status effect granting powerup, some with downsides
Augments: Besides boosting the range/damage/capabilities of different types of weapons...
            Xray vision (Dont need LOS), Personal shield generator, Deflector, Enchanced Legs, Neural Link (You choose one weapon to get super charged)

TODO:
-Work on making more actions
-Work on making it where you can 'build' ally robots (make it where when you create new players
    you can designate as friendly or enemy)
-Work on different attack shapes (such as a circle AOE attack, a cone attack, a beam/line attack, etc)
-Adding passive skills/augments
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
    }
}

function addToShop(action, price)
{
    document.getElementById("shop-list").innerHTML += 
    "<li>" + action.name + "<button type=\"button\" onclick=\"purchase(\'" + action.name +"\')\"> $" + price + " </button> </li>"
}



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
function addAction(name, active, charges, range, price, aoe)
{
    let newAction = new Action(name,active,charges,range,price, aoe)
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