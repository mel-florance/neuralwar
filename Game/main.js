/**
 * Created by Mel on 09/08/2015.
 */

window.onload = function()
{
    var engine = Engine.createCanvas(document.body);

    var teams =
    {
        red:
        {
            score       : 0,
            color       : 'rgba(240,50,0,1)',
            players     : 5,
            health      : 100,
            food_sensor : 100,
            radius      : 12,
            startX      : 20 + Math.random() * (engine.canvas.width - 20 * 2),
            startY      : 20 + Math.random() * (engine.canvas.height - 20 * 2),
            velocityX   : Math.cos(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2,
            velocityY   : Math.sin(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2
        },
        blue:
        {
            score       : 0,
            color       : 'rgba(60,180,255,1)',
            players     : 5,
            health      : 100,
            food_sensor : 100,
            radius      : 12,
            startX      : Math.floor(Math.random() * ((engine.canvas.width + (engine.canvas.width / 2)) - 50 + 1)) +50,
            startY      : Math.floor(Math.random() * ((engine.canvas.height - 50) - 50 + 1)) + 5,
            velocityX   : Math.cos(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2,
            velocityY   : Math.sin(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2
        },
        yellow:
        {
            score       : 0,
            color       : 'yellow',
            players     : 5,
            health      : 100,
            food_sensor : 100,
            radius      : 12,
            startX      : Math.floor(Math.random() * ((engine.canvas.width + (engine.canvas.width / 2)) - 50 + 1)) +50,
            startY      : Math.floor(Math.random() * ((engine.canvas.height - 50) - 50 + 1)) + 5,
            velocityX   : Math.cos(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2,
            velocityY   : Math.sin(Math.PI / 180 * Math.random() * 360) * Math.random() * 5 + 2
        }
    };

    Game.setTeams(teams);

    for(var t in teams)
    {
        if(typeof teams[t] !== 'undefined')
        {
            for(var p = 0; p < teams[t].players; p++)
            {
                var r  = teams[t].radius;
                var x  = teams[t].startX * p;
                var y  = teams[t].startY + p;
                var vx = teams[t].velocityX;
                var vy = teams[t].velocityY;
                var m  = r * r;



                var player  = new Circle(
                    engine.canvas,
                    x,
                    y,
                    r,
                    0,
                    (2 * Math.PI),
                    false,
                    vx,
                    vy,
                    m,
                    true,
                    teams[t].food_sensor
                );

                if(p == 4) player.role = 'sniper';
                else player.role = 'soldier';

                player.type = 'player';
                player.health = 100;
                player.team = t;
                player.attackSpeed = 1;
                player.force = 3;



                engine.bindOnce(player, {color: teams[t].color});
                Game.freeMove(player);
            }
        }
    }

    setInterval(function()
    {
        var x =  Math.floor(Math.random() * ((engine.canvas.width - 50) - 50 + 1)) + 50;
        var y =  Math.floor(Math.random() * ((engine.canvas.height - 50) - 50 + 1)) + 50;

        var food      = new Circle(engine.canvas, x, y, 5, 0, (2 * Math.PI), false, 0, 0, 0, false);
        food.type     = 'food';
        food.freeMove = false;

        var random = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
        var value = random[Math.floor(Math.random()*random.length)];
        var color = 'green';

        if(value == 1)
        {
            color = 'white';
            food.changeGravity = true;
        }

        engine.bindOnce(food, {color: color});
    }, 500);

    engine.render();
};
