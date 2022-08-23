//Creates squares that spawn enemies 
class Spawner
{
    constructor(x,y,width,height,color, spawnerHealth,alive,effects)
    {
        this.x = x
        this.y = y
        this.color = color
        this.width = width;
        this.height = height;
        this.spawnerHealth = spawnerHealth;
        this.alive = alive
        this.effects = effects
    }
    get currentHealth(){
        return this.spawnerHealth
    }
    set currentHealth(amount){
        this.spawnerHealth += amount;
        if(this.spawnerHealth <= 0)
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
    get center(){
        return [(this.x + this.width/2),(this.y + this.height/2)]
    }
    spawnUnit(health, alive,effects,shield)
    {
        // Make enemy spawn in closest non occupied space
        //
        // for(let i = 0; i < units.length; i++)
        // {
        //     units[i].center ==
        // }
        makeUnit("Enemy",this.center[0]+squareSize,this.center[1], "#FF9999", health, alive,effects,shield)
    }
    drawSelf()
    {
        drawRect(this.x,this.y,this.width,this.height,"#000000",this.color);    
    }

}
