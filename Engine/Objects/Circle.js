/**
 * Created by Mel on 09/08/2015.
 */

var Circle = function(canvas, cx, cy, r, sa, ea, c, vx, vy, m, collisions, sensor)
{
    this.x  = cx;
    this.y  = cy;
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

Circle.prototype.draw = function(options)
{
    if(this.type == 'food')
    {
        Engine.ctx.save();
        Engine.ctx.beginPath();
        Engine.ctx.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI, false);
        Engine.ctx.fillStyle = options.color;
        Engine.ctx.fill();
        Engine.ctx.closePath();
        Engine.ctx.restore();
    }

    if(this.type == 'player')
    {
        var img = new Image()
        img.src = '../Game/Assets/Img/soldier.svg';
        var that = this;
        img.onload = function()
        {
            Engine.ctx.save();
            Engine.ctx.beginPath();
            Engine.ctx.arc(that.cx, that.cy, that.r, 0, 2 * Math.PI, false)
            Engine.ctx.fillStyle = options.color;
            Engine.ctx.fill();
            Engine.ctx.closePath();
            Engine.ctx.clip();
            Engine.ctx.drawImage(img, that.cx - that.r, that.cy-that.r, that.r*2, that.r*2);
            Engine.ctx.restore();

            Engine.ctx.beginPath();
            Engine.ctx.arc(that.cx, that.cy, that.r, 0, 2 * Math.PI, false);
            Engine.ctx.lineCap = 'round';
            Engine.ctx.lineWidth = 4;
            Engine.ctx.strokeStyle = options.color;
            Engine.ctx.stroke();

        };

        Engine.ctx.save();
        Engine.ctx.font = 12 * (this.r / 15)+'px Arial';
        Engine.ctx.fillStyle = 'white';
        Engine.ctx.textAlign = 'center';
        Engine.ctx.fillText(this.health, this.cx, this.cy + (this.r/2) + this.r);
        Engine.ctx.restore();


       if(this.role == 'sniper')
       {
           if(this.getRandom(120))
           {
               var distances = [];
               for(var o in Engine.objects)
               {
                   var d = Engine.distance(this, Engine.objects[o].instance);
                   if(!isNaN(d)) distances.push(d);
               }

               if(distances.length > 0)
               {
                   var max = Math.max.apply(Math, distances);
                   for(var p in Engine.objects)
                   {
                       if(Engine.distance(this, Engine.objects[p].instance) >= max
                       && this.team !== Engine.objects[p].instance.team
                       && typeof this.team !== undefined
                       && typeof Engine.objects[o].instance.team !== undefined)
                       {
                           console.log('them',Engine.objects[p].instance.team);
                           var vx = this.vx + Engine.objects[p].instance.vx;
                           var vy = this.vy + Engine.objects[p].instance.vy;

                           var bullet = new Projectile(this.canvas, this.cx, this.cy, 3, this.sa, this.ea, false, vx, vy, 2, true, 0);
                           bullet.type = 'projectile';
                           bullet.r = 3;

                           Engine.bindObject(bullet, {color: options.color , r: 3});
                       }
                   }
               }
           }
       }
    }

    this.update();
}

Circle.prototype.getRandom = function(n)
{
    var random = [];
    var n = typeof n == undefined ? 2 : n;
    for(var x = 0; x < n - 1; x++)
        random.push(0);
    random.push(1);

    return random[Math.floor(Math.random()*random.length)];
};

Circle.prototype.update = function()
{
    if(this.cy < (this.canvas.height - this.r))
        this.vy += Engine.physics.gravity;

    if(this.type == 'player')
        Game.findFood(this);

    if(this.collisions)
    {
        Engine.checkEntityCollision(this);
        this.checkBordersCollisions();
    }
};

Circle.prototype.checkBordersCollisions = function()
{
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
    {
        this.cy  = this.canvas.height - this.r;
        this.vy *= -1;

        this.vy *= .5;
        this.vx *= .5;
    }

    // ceiling
    if(this.cy < (this.r))
    {
        this.cy  = this.r + 2;
        this.vy *= -1;
        this.vy *= (1 - Engine.physics.collisionDamper);
    }

    // right wall
    if(this.cx > (this.canvas.width - this.r))
    {
        this.cx  = this.canvas.width - this.r - 2;
        this.vx *= -1;
        this.vx *= (1 - Engine.physics.collisionDamper);
    }

    // left wall
    if(this.cx < (this.r))
    {
        this.cx  = this.r + 2;
        this.vx *= -1;
        this.vx *= (1 - Engine.physics.collisionDamper);
    }

    this.cx += this.vx;
    this.cy += this.vy;
};