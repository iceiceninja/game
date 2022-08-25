//Used to make new actions for the player or enemies to use.
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
        "<div id=\"" + this.actionNum + "\" class=\"action\"\"> <button id=\"" + this.name + "\" type=\"button\" onClick=\"selectAction(" + this.actionNum + ")\">("+ this.actionNum + ") " + this.name + "</button></div>"
        
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
