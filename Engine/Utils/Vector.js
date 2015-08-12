/**
 * Created by Mel on 09/08/2015.
 */

var Vector = function(x, y)
{
    this.x = x;
    this.y = y;
};

Vector.prototype.lengthSquared = function()
{
    return this.x * this.x + this.y * this.y;
};

Vector.prototype.length = function()
{
    return Math.sqrt(this.lengthSquared());
};

Vector.prototype.clone = function()
{
    return new Vector(this.x, this.y);
};

Vector.prototype.dot = function(v)
{
    return this.x * v.x + this.y * v.y;
};

Vector.prototype.distance = function(v1, v2)
{
    return (v1.subtract(v2)).length();
};

Vector.prototype.angleBetween = function(v1, v2)
{
    return Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
};

Vector.prototype.add = function(v)
{
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.multiply = function(v)
{
    this.x *= v.x;
    this.y *= v.y;
    return this;
};

Vector.prototype.subtract = function(v)
{
    return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.negate = function()
{
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

Vector.prototype.increment = function(v)
{
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vector.prototype.decrement = function(v)
{
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

Vector.prototype.scale = function(f)
{
    this.x *= f;
    this.y *= f;
    return this;
};

Vector.prototype.normalize = function()
{
    var l = this.length();
    if(l > 0)
    {
        this.x /= l;
        this.y /= l;
    }

    return this.length();
};
