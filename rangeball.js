//A range display for actions. Purely cosmetic, but without it you'd be guessing or counting
//  squares in order to see how far you can shot
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