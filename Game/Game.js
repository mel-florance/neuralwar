/**
 * Created by Mel on 10/08/2015.
 */

var Game = function() { this.setHud(); };

Game.prototype.setHud = function()
{ this.hud = Hud.getElements(); };

Game.prototype.getHud = function()
{ return this.hud; };

Game.prototype.setTeams = function(teams)
{ this.teams = teams; };

Game.prototype.input = function()
{
    Input.listen(function(callback)
    {
        if(callback.type == 'keyboard')
        {
            switch (callback.event.keyCode)
            {
                case 90: Game.bindAction(callback.event.keyCode, 'moveForward');  break;
                case 83: Game.bindAction(callback.event.keyCode, 'moveBackward'); break;
                case 81: Game.bindAction(callback.event.keyCode, 'moveLeft');     break;
                case 68: Game.bindAction(callback.event.keyCode, 'moveRight');    break;
            }
        }

        if(callback.type == 'mouse:down')
            Game.bindAction(callback.event, 'mouse:down');
    });
};


Game.prototype.attack = function(player, enemy)
{
    if(player.type == 'player' && enemy.type == 'player')
    {
        enemy.health  -= Math.floor((player.force / 5.8) + (Math.round(Math.random()) * 0.5 - 0.1));
        player.health -= Math.floor((enemy.force / 5.8) + (Math.round(Math.random()) * 0.5 - 0.1));

        if(enemy.r >= 1)
            enemy.r -= 1;
        if(player.r >= 1)
            player.r -= 1;

        if(enemy.r < 20)
            enemy.r = 20;
        if(player.r < 20)
            player.r = 20;

        enemy.sensor  -= 1;
        player.sensor -= 1;

        if(enemy.sensor < 100)
            enemy.sensor = 100;
        if(player.sensor < 100)
            player.sensor = 100;

        if(enemy.health <= 0 || isNaN(enemy.health))
        {
            player.force++;
            player.r += 3;
            if(player.r > 30)
                player.r = 30;
            else if(player.r < 20)
                player.r = 20;

            if(player.sensor < 200)
                player.sensor += 20;
            else if(player.sensor < 100)
                player.sensor = 100;

            delete Engine.objects[enemy.id];
        }

        if(player.health <= 0 || isNaN(player.health))
        {
            enemy.force++;
            enemy.r += 3;
            if(enemy.r > 30)
                enemy.r = 30;
            else if(enemy.r < 20)
                enemy.r = 20;

            if(enemy.sensor < 200)
                enemy.sensor += 20;
            else if(enemy.sensor < 100)
                enemy.sensor = 100;

            delete Engine.objects[player.id];
        }
    }
};

Game.prototype.bindAction = function(key, action)
{
    for(var x in Engine.objects)
    {
        if(Engine.objects[x].instance.type == 'player'
        && Engine.objects[x].instance.role == 'sniper'
        && Engine.objects[x].instance.team == 'red')
        {
            switch(action)
            {
                case 'moveForward' : Engine.objects[x].instance.vy -= Engine.objects[x].instance.speed +3; break;
                case 'moveBackward': Engine.objects[x].instance.vy = Engine.objects[x].instance.speed +3; break;
                case 'moveLeft'    : Engine.objects[x].instance.vx -= Engine.objects[x].instance.speed +3; break;
                case 'moveRight'   : Engine.objects[x].instance.vx = Engine.objects[x].instance.speed +3; break;

                case 'mouse:down':

                    var f = 0;
                    var rect = window.document.body.getBoundingClientRect();

                    var x1 = Engine.objects[x].instance.cx;
                    var y1 = Engine.objects[x].instance.cy;
                    var x2 = key.clientX - rect.left;
                    var y2 = key.clientY - rect.top;

                    //Engine.ctx.save();
                    //Engine.ctx.beginPath();
                    //Engine.ctx.moveTo(x1,y1);
                    //Engine.ctx.lineTo(x2, y2);
                    //Engine.ctx.strokeStyle = 'red';
                    //Engine.ctx.strokeWidth = '2';
                    //Engine.ctx.stroke();
                    //Engine.ctx.closePath();
                    //Engine.ctx.restore();

                    var vx, vy;
                    var dx = x2 - x1,
                        dy = y2 - y1;

                    var dist  = Math.abs(Math.sqrt(dx * dx + dy * dy));
                    var speed = Engine.fps_count / 1000 / dist;
                    f += speed;

                    angle = Math.atan(parseFloat(x2) / parseFloat(y2));

                    vx = 4 * dx / Math.cos(angle) / 900;
                    vy = 4 * dy / Math.sin(angle) / 900;

                    px = x1 + (x2 - x1) * f;
                    py = y1 + (y1 - y1) * f;


                    if(x2 > Engine.objects[x].instance.cx)
                        directionX = px + Engine.objects[x].instance.r + 10
                    else
                        directionX = px - Engine.objects[x].instance.r - 10


                    if(y2 > Engine.objects[x].instance.cy)
                        directionY = py + Engine.objects[x].instance.r + 10
                    else
                        directionY = py - Engine.objects[x].instance.r - 10

                    var bullet = new Projectile(Engine.canvas, directionX, directionY, 3, 0, 0, false, vx, vy, 300, true, 0);
                    bullet.type = 'projectile';
                    bullet.r = 3;

                    Engine.bindObject(bullet, {color:'red' , r: 3});


                    break;
            }

            if(Engine.objects[x].instance.vx > Engine.objects[x].instance.maxSpeed)
                Engine.objects[x].instance.vx = Engine.objects[x].instance.maxSpeed;
            else if(Engine.objects[x].instance.vx < -Engine.objects[x].instance.maxSpeed)
                Engine.objects[x].instance.vx = -Engine.objects[x].instance.maxSpeed;

            if(Engine.objects[x].instance.vy > Engine.objects[x].instance.maxSpeed)
                Engine.objects[x].instance.vy = Engine.objects[x].instance.maxSpeed;
            else if(Engine.objects[x].instance.vy < -Engine.objects[x].instance.maxSpeed)
                Engine.objects[x].instance.vy = -Engine.objects[x].instance.maxSpeed;
        }
    }
};



Game.prototype.findFood = function(object)
{
    for(var i = 0; i < Engine.objects.length; i++)
    {
        if (typeof Engine.objects[i] !== 'undefined' && Engine.objects[i].instance.id != object.id)
        {
            if (Engine.objects[i].instance.type == 'food' && Engine.physics.gravity == 0)
            {
                var d = Engine.distance(object, Engine.objects[i].instance);

                // hit sensor
                if(d < (object.r + Engine.objects[i].instance.r) + object.sensor)
                {
                    if(object.freemove)
                    {
                        var dx = Engine.objects[i].instance.cx - object.cx;
                        var dy = Engine.objects[i].instance.cy - object.cy;

                        object.vx = incrementX = dx / 30 + .1;
                        object.vy = incrementY = dy / 30 + .1;
                    }

                    Engine.alpha += (Engine.delta / 24);
                    if (Engine.alpha <= 0 || Engine.alpha >= 1) Engine.delta = -Engine.delta;

                    Engine.ctx.save();
                    Engine.ctx.beginPath();
                    Engine.ctx.arc(object.cx, object.cy, object.sensor, object.sa, object.ea, object.c);
                    Engine.ctx.fillStyle = 'rgba(255,255,255, 0.03)';
                    Engine.ctx.strokeStyle = 'rgba(255,255,255, 0.05)';
                    Engine.ctx.strokeWidth = '0.1';
                    Engine.ctx.globalAlpha = Engine.alpha;
                    Engine.ctx.stroke();
                    Engine.ctx.fill();
                    Engine.ctx.closePath();
                    Engine.ctx.restore();


                    // Hit food
                    if(d < (object.r + Engine.objects[i].instance.r))
                    {
                        for(var t in this.teams)
                            if(t == object.team)
                                this.teams[t].score++;

                        if(Engine.objects[i].instance.changeGravity)
                            Engine.physics.animateGravity(0.981);

                        object.health += Math.round(Math.random()) * 25 + 5;
                        object.r++;
                        object.force += 1;

                        if(object.sensor < 100)
                            object.sensor = 100;

                        if(object.sensor < 200)
                            object.sensor += 3


                        this.deleteFood(Engine.objects[i].instance);

                        if(object.freemove)
                            this.freeMove(object);
                    }
                }
            }
        }
    }
};


Game.prototype.deleteFood = function(object)
{
    if(object.type == 'food')
        delete Engine.objects[object.id];
};

Game.prototype.freeMove = function(object)
{
    if(!object.freemove)
    {
        //Physics.randomVelocity(object);
        //setInterval(function()
        //{
        //    Physics.randomVelocity(object);
        //}, 5000);
        //
        //object.freemove = true;
    }
};




Game = new Game();