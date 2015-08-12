/**
 * Created by Mel on 09/08/2015.
 */

var Projectile = function(canvas, cx, cy, r, sa, ea, c, vx, vy, m, collisions, sensor)
{
    this.cx = cx;
    this.cy = cy;
    this.r  = r;
    this.sa = sa;
    this.ea = ea;
    this.c  = c;
    this.vx = vx;
    this.vy = vy;
    this.m  = m;

    this.sc           = 'rgba(255,255,255,0.2)';
    this.collisions   = collisions;
    this.canvas       = canvas;
    this.sensor       = sensor;
    this.freeMove     = false;

    return this;
};

Projectile.prototype.draw = function(options)
{
    Engine.ctx.save();
    Engine.ctx.beginPath();
    Engine.ctx.arc(this.cx, this.cy, options.r, 0, 2 * Math.PI, false);
    Engine.ctx.fillStyle = options.color;
    Engine.ctx.fill();
    Engine.ctx.closePath();
    Engine.ctx.restore();

    this.update();
};

Projectile.prototype.update = function()
{
    if(this.cy < (this.canvas.height - this.r))
        this.vy += .08;


    if(this.collisions)
    {
        Engine.checkEntityCollision(this);
        this.checkBordersCollisions();
    }
};

Projectile.prototype.checkBordersCollisions = function()
{
    this.r = 3;
    // friction
    if(this.vx > 0)
        this.vx -= Engine.physics.floorFriction;
    else if(this.vx < 0)
        this.vx += Engine.physics.floorFriction;
    if(this.vy > 0)
        this.vy -= Engine.physics.floorFriction;
    else if(this.vy < 0)
        this.vy += Engine.physics.floorFriction;

    // floor
    if(this.cy > (this.canvas.height - this.r))
       delete Engine.objects[this.id];


    // right wall
    if(this.cx > (this.canvas.width - this.r))
        delete Engine.objects[this.id];

    // left wall
    if(this.cx < (this.r))
        delete Engine.objects[this.id];

    this.cx += this.vx;
    this.cy += this.vy;
};