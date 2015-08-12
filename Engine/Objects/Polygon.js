/**
 * Created by Mel on 09/08/2015.
 */

var Polygon = function(vertices, color, mass)
{
    this.vertices = vertices;
    this.color = color;
    this.mass = mass;

    this.x  = 0;
    this.y  = 0;
    this.vx = 0;
    this.vy = 0;
    this.dv = 0;
};

Polygon.prototype.getPosition = function()
{
    return new Vector(this.x, this.y);
};

Polygon.prototype.setPosition = function(p)
{
    this.x = p.x;
    this.y = p.y;
};

Polygon.prototype.getVelocity = function()
{
    return new Vector(this.vx, this.vy);
};

Polygon.prototype.setVelocity = function(v)
{
    this.vx = v.x;
    this.vy = v.y;
};

Polygon.prototype.rotate = function(d)
{
    for(var i = 0; i < this.vertices.length; i++)
        this.vertices[i] = this.vertices[i].rotate(d)
};

Polygon.prototype.draw = function(ctx)
{
    var v = [];
    for(var i = 0; i < this.vertices.length; i++)
        v[i] = this.vertices[i].add(this.getPosition());

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(v[0].x, v[0].y);

    for(var j = 1; j < v.length; j++)
        ctx.lineTo(v[j].x, v[j].y);

    ctx.lineTo(v[0].x, v[0].y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
