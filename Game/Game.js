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
            switch (callback.event)
            {
                case 90: Game.bindAction(callback.event, 'moveForward');  break;
                case 83: Game.bindAction(callback.event, 'moveBackward'); break;
                case 81: Game.bindAction(callback.event, 'moveLeft');     break;
                case 68: Game.bindAction(callback.event, 'moveRight');    break;
            }
        }

        if(callback.type == 'mouse')
        {

        }
    });
};


Game.prototype.attack = function(player, enemy)
{
    if(player.type == 'player' && enemy.type == 'player')
    {
        enemy.health  -= player.force + (Math.round(Math.random()) * 5 - 2);
        player.health -= enemy.force + (Math.round(Math.random()) * 5 - 2);

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
    console.log(key, action);
};



Game.prototype.findFood = function(object)
{
    for(var i = 0; i < Engine.objects.length; i++)
    {
        if (typeof Engine.objects[i] !== 'undefined' && Engine.objects[i].instance.id != object.id)
        {
            if (Engine.objects[i].instance.type == 'food')
            {
                var d = Engine.distance(object, Engine.objects[i].instance);

                // hit sensor
                if(d < (object.r + Engine.objects[i].instance.r) + object.sensor)
                {
                    var dx = Engine.objects[i].instance.cx - parseFloat(object.cx);
                    var dy = Engine.objects[i].instance.cy - object.cy;

                    var incrementX = dx / 30 + .1;
                    var incrementY = dy / 30 + .1;

                    object.vx = incrementX;
                    object.vy = incrementY;

                    for(var s = 0; s < 3 ; s++)
                    {
                        Engine.ctx.beginPath();
                        Engine.ctx.arc(object.cx, object.cy, object.sensor, object.sa, object.ea, object.c);
                        Engine.ctx.fillStyle = 'rgba(255,255,255, 0.0'+s+')';
                        Engine.ctx.fill();
                        Engine.ctx.closePath();
                    }

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
                        object.freemove = true;
                        this.freeMove(object);
                    }
                }
                else
                {
                    object.freemove = true;
                    this.freeMove(object);
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
        Physics.randomVelocity(object);
        setInterval(function()
        {
            Physics.randomVelocity(object);
        }, 5000);

        object.freemove = true;
    }
};




Game = new Game();