/**
 * Created by Mel on 09/08/2015.
 */

var Box = function(canvas, x, y, w, h, vx, vy, rot, mass)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
    this.rot = rot;
    this.mass = mass;

    this.radius = 10;

    this.canvas = canvas;
    this.TO_RADIANS = Math.PI / 180;
    return this;
};

Box.prototype.draw = function(options)
{
    Engine.ctx.save();
    Engine.ctx.translate(this.x + (this.w / 2), this.y + (this.h / 2));
    Engine.ctx.rotate(this.rot * this.TO_RADIANS * Engine.tick);
    Engine.ctx.translate(-this.x - (this.w / 2), -this.y - (this.h /2));
    Engine.ctx.fillStyle = options.color;
    Engine.ctx.fillRect(this.x, this.y, this.h, this.w);
    Engine.ctx.restore();

    this.update();
};

Box.prototype.update = function()
{
    // Gravity
    if(this.y < (this.canvas.height - this.h))
        this.vy += Engine.physics.gravity;

    Engine.checkEntityCollision(this);
    this.checkBordersCollisions();
};

Box.prototype.checkBordersCollisions = function()
{
    // Left
    if(this.x < 0)
    {
        this.x   = 0;
        this.vx *= -1;
    }

    // Right
    if(this.x > (this.canvas.width - this.w))
    {
        this.x   = this.canvas.width - this.w;
        this.vx *= -1;
    }

    // Top
    if(this.y < 0)
    {
        this.y   = 0;
        this.vy *= -1;
    }

    // Bottom
    if(this.y  > (this.canvas.height - this.h))
    {
        if((this.rot * (Math.PI / 180)) < 0)
            this.rot = 0;

        this.rot *= .3;


        this.vy  *= .2;
        this.vx  *= .2;

        this.y    = this.canvas.height - this.h;
        this.vy  *= -1;


        //delete Engine.objects[this.id];
    }

    this.x += this.vx;
    this.y += this.vy;
};