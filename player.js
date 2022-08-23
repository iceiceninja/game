// Used to make units in the game. General purpose so far.
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
            if(round(units[i].center[0],5) == round(x,5) && round(units[i].center[1],5) == round(y,5) && units[i].isAlive == true)
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