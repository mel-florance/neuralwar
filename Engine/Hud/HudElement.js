/**
 * Created by Mel on 10/08/2015.
 */


var HudElement = function(name, x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.name = name;
    this.childs = [];

    Hud.addElement(this);

    return this;
};

HudElement.prototype.addText = function(text, x, y, options)
{
    var elements = Hud.getElements();
    if(typeof elements[this.name] !== undefined)
        this.childs.push({text: text, x:x, y:y, options:options});
};

HudElement.prototype.addImage = function(img, x, y, w, h)
{
    var elements = Hud.getElements();

    if(typeof elements[this.name] !== undefined)
        this.childs.push(
        {
            image: img,
            x:x,
            y:y,
            w:w,
            h:h
        });
};


HudElement.prototype.draw = function(options)
{
    Engine.ctx.fillStyle = options.color;
    Engine.ctx.fillRect(this.x, this.y, this.w, this.h);

    for(var x in this.childs)
    {
        if(typeof this.childs[x].image !== 'undefined')
        {
            var sprite = new Sprite(this.childs[x].image, this.childs[x], true);
            sprite.draw();
        }
        else if(typeof this.childs[x].text !== 'undefined')
        {
            if(typeof this.childs[x].options == 'undefined')
                this.childs[x].options = {};

            this.childs[x].options.fontFamily = typeof this.childs[x].options.fontFamily == 'undefined' ? 'Arial' : this.childs[x].options.fontFamily;
            this.childs[x].options.color      = typeof this.childs[x].options.color == 'undefined'      ? '#fff'  : this.childs[x].options.color;
            this.childs[x].options.fontSize   = typeof this.childs[x].options.fontSize == 'undefined'   ? '15px'  : this.childs[x].options.fontSize;

            Engine.ctx.save();
            Engine.ctx.font = 'bold '+this.childs[x].options.fontSize + ' '+this.childs[x].options.fontFamily;
            Engine.ctx.fillStyle = this.childs[x].options.color;
            Engine.ctx.fillText(this.childs[x].text, this.childs[x].x, this.childs[x].y);
            Engine.ctx.restore();
        }
    }
};