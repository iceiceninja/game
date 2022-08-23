const PORT = 3000;
const express = require('express')
const app = express()


app.use(express.static('Public'))
app.use('/styles', express.static(__dirname + 'Public/styles'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res)=>{
    res.render('index')
})

app.listen(PORT,()=>console.log("listening on port " + (PORT)))


var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

let canTakeActions = false

let credits = 100
let turnNum = 0

let squareSize = canvas.height/13

let units = []
let enemies = []
let allies = []
let spawners = []

let mapTiles = [];

let colLength = 0

let isPlayerTurn = true
let isEnemyTurn = false
let isAoe = false
let spawnBig = false

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





let player1 = new Player("Player",squareSize * 1.5,squareSize*1.5,"#20A39E",100, true,["Ally","Player"],0)//0095DD

let rangeDisp = new rangeBall(player1.center[0],player1.center[1], 0,"#00FF9999")
let aoeRange = new rangeBall(player1.center[0],player1.center[1], 0, "#400F0333")

///////////////////////////////////////////////////////////
///////// COLOR ALLIES #A8DADC
/////////
//////////////////////////////////////////////////////////

makeUnit("Enemy1",squareSize * 11.5,squareSize*15.5, "#e63946", 10, true,[],0)//FF9999
makeUnit("Enemy2",squareSize * 5.5,squareSize*5.5, "#e63946", 10, true,[],0)
// makeEnemy("Enemy3",squareSize * 7.5,squareSize*3.5, "#FF9999", 10, true,[],0)
makeUnit("Enemy3",squareSize * 7.5,squareSize*2.5, "#e63946", 10, true,[],0)//"Enemy4",squareSize * 17.5,squareSize*1.5, "#FF9999", 10, true,[],0


function findEnemy(name)
{
    for(let i = 0; i < enemies.length; i++)
    {
        if(enemies[i].getName == name)
        {
            return enemies[i]
        }
    }
}
units.push(player1)

allies.push(player1)

player1.currentHealth = 0

function makeUnit(name,x,y, color, health, alive,effects,shield)
{
    let isAlly = false
    let canSpawn = true

    for(let i = 0;i < effects.length; i++)
    {
        if(effects[i] == "Ally")
        {
            isAlly = true
        }
    }
    for(let i = 0; i < units.length; i++)
    {
        if(round(units[i].center[0],5) == round(x,5) && round(units[i].center[1],5) == round(y,5) && units[i].isAlive == true)
        {
           canSpawn = false;
        }
    }
    if(canSpawn)
    {
        let newUnit = new Player(name,x,y, color, health, alive,effects,shield)
        units.push(newUnit)
        if(isAlly)
        {
            allies.push(newUnit)
        }
       else
       {
            enemies.push(newUnit)
       }
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x,y]
}


// let test = new Spawner(20*squareSize,20*squareSize,squareSize*2,squareSize*2,"#0F7721")
function makeSpawner(x,y,width,height,color, spawnerHealth,alive,effects)
{
    let isAlly = false
    let canSpawn = true

    for(let i = 0;i < effects.length; i++)
    {
        if(effects[i] == "Ally")
        {
            isAlly = true
        }
    }
    for(let i = 0; i < units.length; i++)
    {
        if(round(units[i].center[0],5) == round(x,5) && round(units[i].center[1],5) == round(y,5) && units[i].isAlive == true)
        {
           canSpawn = false;
        }
    }
    if(canSpawn)
    {
        let newSpawner = new Spawner(x,y,width,height,color, spawnerHealth,alive,effects)
        units.push(newSpawner)
        spawners.push(newSpawner)
        if(isAlly)
        {
            allies.push(newSpawner)
        }
       else
       {
            enemies.push(newSpawner)
       }
    }
}
makeSpawner(20*squareSize,20*squareSize,squareSize,squareSize,"#BDBF09", 50, true,["Spawner"])
//To center something inside of mapTile, do squareSize * (number of tile -.5)
//This finds the tile, let's say 2nd from left, and instead of putting it at the end of the
//tile it places it halfway in the tile, which when drawing a circle, is exactly where we want it 


function draw()
{
    /*
    TODO:

    Make a binary sort algorithm to sort through mapTiles to speed it up (along with anything else
        that needs to be searched through and is large. NOTE: This requires MapTiles to be sorted
        in ascending order. Do so with the tileNum)

    Make a drawables array, so that way we can leave the draw method to only draw
    and leave calculations to outside of something called every 100 miliseconds or something

    See if you can make another layer of drawing stuff. That way you can leave the mapTiles
    on the background (so we dont have to draw 100+ every 100ms) and we can still have another
    layer that works exactly to how our current layer works (With erasing and drawing taking place
        constantly)
    */
    let mapTilesCol = [];
    let row = 0
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
    // Eventually try to make an array of drawables so you dont have to itterate through
    // so many arrays
    for(let i = 0; i < units.length; i++){
        if(units[i].currentHealth > 0)
        {
            units[i].drawSelf()
        }else
        {
            units[i].isAlive = false
        }
    }
    // for(let i = 0; i < spawners.length; i++){
    //     if(spawners[i].currentHealth > 0)
    //     {
    //         spawners[i].drawSelf()
    //     }else
    //     {
    //         spawners[i].isAlive = false
    //     }
    // }
    // test.drawSelf()
    document.getElementById("playerHealth").innerHTML = "Player Health: " + player1.currentHealth + "<br>Player Shield: " + player1.currentShield
    document.getElementById("credits").innerHTML = "Credits: " + credits
}


// Turn order should go Player, Allies ,Enemies
function endPlayerTurn()
{
    canTakeActions = false
    isEnemyTurn = false
    isPlayerTurn = false
    allyTurn()
}
function endEnemyTurn()
{
    isPlayerTurn = true
    isEnemyTurn = false
    playerTurn()
}
function endAllyTurn()
{
    isEnemyTurn = true
    isPlayerTurn = false
    enemyTurn()
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
    if(turnNum % 4 == 0)
    {
        for(let i = 0; i < spawners.length; i++){
            if(spawners[i].currentHealth > 0)
            {
                spawners[i].spawnUnit(5,true,[],0)
            }else
            {
                spawners[i].isAlive = false
            }
        }
        
    }
    for(let i = 0; i < enemies.length; i++){
        let currentEnemy = enemies[i]
        if(searchArray(currentEnemy.effects,"Spawner") == null)
        {

            
            if(currentEnemy.isAlive){
                canTakeActions = false
                
                document.getElementById('gameStatus').innerHTML = "Enemy Turn"
                
                let currentSquare = findCurrentSquare(currentEnemy.center[0],currentEnemy.center[1])
                
                let movex = 0
                let movey = 0
                
                let offset = squareSize * 2.5

                let leastDistance = 1000000
                let closestTarget = null
                for(let i = 0; i < allies.length;i++)
                {
                    if(allies[i].isAlive){
                        let distToCurrentTarget = getDistance(currentEnemy.center[0], allies[i].center[0],currentEnemy.center[1], 
                            allies[i].center[1])
                        if (distToCurrentTarget < leastDistance)
                            {
                                closestTarget = allies[i]
                            }
                    }
                }

                let differencex = (closestTarget.center[0]-currentEnemy.center[0])
                let differencey = (closestTarget.center[1]-currentEnemy.center[1])
                
                if(getDistance(currentEnemy.center[0], closestTarget.center[0],currentEnemy.center[1], 
                    closestTarget.center[1]) <= laserPistolAction.relativeRange)
                {
                    LP(closestTarget.center)
                }
                else{
                    if(closestTarget.center[0] != currentEnemy.center[0] && offset < Math.abs(differencex))
                    {
                        movex = differencex/Math.abs(differencex)
                        // alert("movex: " + movex)
                    }
                    if(closestTarget.center[1] != currentEnemy.center[1] && offset < Math.abs(differencey))
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
    }
    // if(findEnemy("Enemy1").isAlive == false && findEnemy("Enemy2").isAlive == false &&findEnemy("Enemy3").isAlive == false && !spawnBig)
    // {
    //     spawnBig = true   
    //     makeEnemy("Enemy4" , squareSize * 10.5,squareSize*12.5, "#9999FF", 100, true,[],1)
    // }
    endEnemyTurn()
}
function allyTurn()
{
    for(let i = 0; i < allies.length; i++){
        let currentAlly = allies[i]
        if(currentAlly.name != "Player")
        {
            if(currentAlly.isAlive)
            {
                canTakeActions = false
                
                document.getElementById('gameStatus').innerHTML = "Ally Turn"
                
                let currentSquare = findCurrentSquare(currentAlly.center[0],currentAlly.center[1])
                
                let movex = 0
                let movey = 0
                
                
                
                let offset = squareSize * 2.5

                let leastDistance = 1000000
                let closestTarget = null
                for(let i = 0; i < enemies.length;i++)
                {
                    if(enemies[i].isAlive)
                    {
                        let distToCurrentTarget = getDistance(currentAlly.center[0], enemies[i].center[0],
                            currentAlly.center[1], 
                            enemies[i].center[1])
                        if (distToCurrentTarget < leastDistance)
                            {
                                closestTarget = enemies[i]
                            }
                    }
                }

                let differencex = (closestTarget.center[0]-currentAlly.center[0])
                let differencey = (closestTarget.center[1]-currentAlly.center[1])

                if(getDistance(currentAlly.center[0], closestTarget.center[0],currentAlly.center[1], 
                    closestTarget.center[1]) <= laserPistolAction.relativeRange)
                {
                    LP(closestTarget.center)
                }
                else{
                    if(closestTarget.center[0] != currentAlly.center[0] && offset < Math.abs(differencex))
                    {
                        movex = differencex/Math.abs(differencex)
                        // alert("movex: " + movex)
                    }
                    if(closestTarget.center[1] != currentAlly.center[1] && offset < Math.abs(differencey))
                    {
                        movey = differencey/Math.abs(differencey)
                        // alert("movey: " + movey)
                    }
                    currentAlly.move(mapTiles[currentSquare[0]][currentSquare[1]].center[0] + (squareSize * movex),
                        mapTiles[currentSquare[0]][currentSquare[1]].center[1] + (squareSize * movey))// + squareSize)
                    
                    //Get player current square in MapTIles coordinates
                    // The line between player and enemy will always go through the square that the 
                    //enemy should choose to walk though
                    // Make an offset so that if the enemy is ranged he doesnt walk too close
                }
            }
        }
    }
    
    endAllyTurn()
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
                    case "Build Rusty T1 Deathbot":
                        rangeDisp.range = buildRustBotAction.relativeRange
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
addAction("Build Rusty T1 Deathbot", false, 4,1.5, 15)

let laserPistolAction = searchAction("Laser Pistol")
let moveAction = searchAction("Move")
let plasmaBeamAction = searchAction("Plasma Beam")
let weakShieldAction = searchAction("Weak Shield")
let thermalGrenadeAction = searchAction("Thermal Grenade")
let buildRustBotAction = searchAction("Build Rusty T1 Deathbot")

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
                        case "Build Rusty T1 Deathbot":
                            buildBot(targetTile.center)
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
        if(array[i] == searchName)
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
function buildBot(targetTile)
{
    if(withinRange(targetTile, buildRustBotAction))
    {
        makeUnit("RustBot", targetTile[0],targetTile[1],"#A8DADC",10,true,["Ally"],0)
        endPlayerTurn()
    }
    else
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
        doAoe(targetTile,thermalGrenadeAction)
        endPlayerTurn()
    }
    else
    {
        alert("Outta range")
    }
}
function doAoe(targetTile,action)
{
    let radius = action.currAoe 
    let topLeftRow = targetTile.row - radius
    let topLeftCol = targetTile.col - radius
    let bottomRightRow = targetTile.row + radius
    let bottomRightCol = targetTile.col + radius
    for(let currRow = 0; currRow <= bottomRightRow-topLeftRow;currRow++)
    {
        for(let currCol = 0; currCol <= bottomRightCol-topLeftCol;currCol++)
        {
            if(topLeftRow + currRow >= 0 && topLeftCol + currCol >= 0)
            {
                if(round(getDistance(targetTile.center[0],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[0],targetTile.center[1],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[1]),6) <= round(action.relativeAoe,6))
                {                   
                    fireEffect(mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[0],mapTiles[topLeftRow + currRow][topLeftCol + currCol].center[1],150,"#FF0000")
                    damageTile(mapTiles[topLeftRow + currRow][topLeftCol + currCol].center,10)
                }
                   
            }
        }
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