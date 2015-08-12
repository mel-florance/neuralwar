/**
 * Created by Mel on 09/08/2015.
 */


var RigidBody = function(mass, inertia)
{
    this.mass    = mass | 1;
    this.inertia = inertia | 1;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
};

RigidBody.prototype.getPosition = function()
{
    return new Vector(this.x, this.y);
};

RigidBody.prototype.setPosition = function(p)
{
    this.x = p.x;
    this.y = p.y;
};

RigidBody.prototype.getVelocity = function()
{
    return new Vector(this.vx, this.vy);
};

RigidBody.prototype.setVelocity = function(v)
{
    this.vx = v.x;
    this.vy = v.y;
};






