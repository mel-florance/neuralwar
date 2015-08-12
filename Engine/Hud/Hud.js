/**
 * Created by Mel on 10/08/2015.
 */


var Hud = function()
{
    this.elements = [];
    this.canvas   = null;
    return this;
};

Hud.prototype.addElement = function(e)
{
    this.elements[e.name] = e;
};

Hud.prototype.getElements = function()
{
    return this.elements;
};


var Hud = new Hud();
