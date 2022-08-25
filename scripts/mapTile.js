//Each individual square on the canvas. Can draw itself and give information about its location
//  at the moment "occupied" method doesnt work
class mapTile{
    
    constructor(x,y,width,height,tileNum){
        this.x= x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tileNum = tileNum;
        let row = null
        let col = null
        this.fill = "#F5EFED"
        this.stroke = "#000000"
    }
    drawSelf() {
        drawRect(this.x,this.y,this.width,this.height,this.stroke,this.fill);    
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
    get getFill()
    {
        return this.fill
    }
    set setFill(color)
    {
        this.fill = color
    }
    get getStroke()
    {
        return this.stroke
    }
    set setStroke(color)
    {
        this.stroke = color
    }
    occupied(){
        console.log(player1.center == this.center)
        //console.log(this.center)
        if(player1.center == this.center){
            console.log(this.tileNum + " is occupied")
        }
    }
}