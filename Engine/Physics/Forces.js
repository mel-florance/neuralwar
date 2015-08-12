/**
 * Created by Mel on 09/08/2015.
 */

var Forces = function() {};

Forces.prototype.zeroForce = function()
{
    return new Vector(0, 0);
};

Forces.prototype.constantGravity = function(mass, gravity)
{
    return new Vector(0, mass * gravity);
};

Forces.prototype.linearDrag = function(drag, velocity)
{
    return velocity.length() > 0 ? velocity.multiply(-drag) : new Vector(0, 0);
};

Forces.prototype.add = function(list)
{
    var sum = new Vector(0, 0);
    for(var i = 0; i < list.length; i++)
        sum.increment(list[i]);
    return sum;
};
