/**
 * Created by Mel on 09/08/2015.
 */

var Physics = function()
{
    this.gravity         = 0;
    this.collisionDamper = 0.3;
    this.floorFriction   = 0.0005 * new Date(Engine.lastTime).getTime();
    return this;
};

Physics.prototype.animateGravity = function(factor)
{
    var oldGravity = this.gravity;
    this.gravity = factor;

    setTimeout(function()
    {
        for(var i in Engine.objects)
            if(Engine.objects[i].instance instanceof Circle)
                Engine.objects[i].instance.vy = 10;

        setTimeout(function()
        {
            Physics.gravity = 0;
        }, 1000);

    }, 5000);
};

Physics.prototype.calcGravity = function(mass)
{
    return mass * this.gravity;
};

Physics.prototype.rotate = function(x, y, sin, cos, reverse)
{
    return {
        x: reverse ? (x * cos + y * sin) : (x * cos - y * sin),
        y: reverse ? (y * cos - x * sin) : (y * cos + x * sin)
    };
};

Physics.prototype.randomVelocity = function(object)
{
    var ox = object.vx;
    var oy = object.vy;

    var vx = Math.round(Math.random()) * 5 - 2;
    var vy = Math.round(Math.random()) * 5 - 2;

    var random = [0,0,0,0,0,0,0,1];
    var value  = random[Math.floor(Math.random()*random.length)];

    object.vx = vx;
    object.vy = vy;

    if(value == 1)
    {
        object.vx *= -1;
        object.vy *= -1;
    }

    setTimeout(function()
    {
        object.vx = ox;
        object.vy = oy;
    }, 1000 * Math.round(Math.random() * 20) - 2);

};

Physics.prototype.checkCollisions = function(a, b)
{
    var dx = b.cx - a.cx;
    var dy = b.cy - a.cy;
    var d  = Math.sqrt(dx * dx + dy * dy);

    if(d < a.r + b.r)
    {
        Game.attack(a, b);

        var
        angle = Math.atan(dy, dx),
        sin   = Math.sin(angle),
        cos   = Math.cos(angle),

        p0 = {x: 0, y: 0},
        p1 = this.rotate(dx, dy, sin, cos, true),

        v0 = this.rotate(a.vx, a.vy, sin, cos, true),
        v1 = this.rotate(b.vx, b.vy, sin, cos, true),

        vT = v0.x - v1.x;

        v0.x = ((a.m - b.m) * v0.x + 2 * b.m * v1.x) / (a.m + b.m);
        v1.x = vT + v0.x;

        p0.x += v0.x;
        p1.x += v1.x;

        var
        f0 = this.rotate(p0.x, p0.y, sin, cos, false),
        f1 = this.rotate(p1.x, p1.y, sin, cos, false);

        b.x = a.x + f1.x;
        b.y = a.y + f1.y;
        a.x = a.x + f0.x;
        a.y = a.y + f0.y;

        var
        z0 = this.rotate(v0.x, v0.y, sin, cos, false),
        z1 = this.rotate(v1.x, v1.y, sin, cos, false);

        a.vx = z0.x;
        a.vy = z0.y;
        b.vx = z1.x;
        b.vy = z1.y;
    }
};

Physics = new Physics();
