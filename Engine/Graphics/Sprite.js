/**
 * Created by Mel on 10/08/2015.
 */


var Sprite = function(filename, object, pattern)
{
    this.image      = null;
    this.pattern    = pattern;
    this.TO_RADIANS = Math.PI / 180;

    if(filename != undefined && filename != '' && filename != null)
    {
        this.image = new Image();
        this.image.src = filename;

        this.pattern = pattern ? Engine.ctx.createPattern(this.image, 'repeat') : false;
    }

    this.x = object.x;
    this.y = object.y;
    this.w = object.w;
    this.h = object.h;
};

Sprite.prototype.rotate = function(x, y, angle)
{
    Engine.ctx.save();
    Engine.ctx.translate(x, y);
    Engine.ctx.rotate(angle * this.TO_RADIANS);
    Engine.ctx.draw(this.image, -(this.image.width / 2), -(this.image.height / 2));
    Engine.ctx.restore();
};

Sprite.prototype.draw = function(options)
{
    if(this.pattern != null)
    {
        Engine.ctx.fillStyle = this.pattern;
        Engine.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    else
    {
        if(this.w != undefined || this.h != undefined)
            Engine.ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
        else
            Engine.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
};