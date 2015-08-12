/**
 * Created by Mel on 10/08/2015.
 */


var Timer = function()
{
    this.delta  = 0;
    this.second = 1000000000;
    return this;
};

Timer.prototype.getTime = function()
{
    return new Date().getTime();
};

Timer.prototype.getDelta = function()
{
    return this.delta;
};

Timer.prototype.setDelta = function(delta)
{
    this.delta = delta;
    return this;
};

var Timer = new Timer();