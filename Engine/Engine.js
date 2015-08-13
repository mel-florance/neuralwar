/**
 * Created by Mel on 09/08/2015.
 */

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;


var Engine =
{
    ctx       : null,
    canvas    : null,
    container : null,
    physics   : null,
    objects   : [],
    to_delete : [],

    tick      : 0,
    fps_count : 0,
    frame_cap : 5000,
    delta     : 0.1,
    alpha     : 0,

    game      : null,
    isRunning : false,

    stats     : {},

    startTime  : 0,
    lastTime   : 0,
    passedTime : 0,

    current_id : 0,

    createCanvas : function(container, w, h)
    {
        this.container = container;
        this.stats.box = 0;
        this.stats.hud = 0;

        if(this.container !== null)
        {
            this.canvas        = document.createElement('canvas');
            this.canvas.width  = w | this.container.clientWidth;
            this.canvas.height = h | this.container.clientHeight;

            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        return this;
    },


    bindOnce : function(object, options)
    {
        this.bindObject(object, options, true);
    },

    bindObject : function(object, options, once)
    {
        this.current_id++;

        if(typeof once == 'undefined')   once = false;
        if(object instanceof Circle)        this.stats.box++;
        if(object instanceof HudElement) this.stats.hud++;

        object.id = this.current_id;
        this.objects[this.current_id] = {instance: object, options: options};

        if(once == true)
            this.to_delete.push(this.current_id);
    },

    stop : function()
    {
        if(!this.isRunning)
            return;

        this.isRunning = false;
    },

    render : function()
    {
        this.isRunning = true;
        this.physics   = Physics;
        this.lastTime  = Timer.getTime();


        window.requestAnimationFrame(function x()
        {
            if(Engine.isRunning)
            {
                if (!Engine.lastTime)
                {
                    Engine.lastTime = Date.now();
                    this.fps_count = 0;
                    return;
                }

                Game.input();
                Game.getHud();

                var debug = new HudElement('debug', 0, 0, 200, 70);
                debug.addText('Time elasped : ' + new Date(Engine.lastTime).getSeconds(), 10, 20);
                debug.addText('Objects : ' + (parseInt(Engine.stats.box) + parseInt(Engine.stats.hud)), 10, 40);
                debug.addText('Fps : ' + Engine.fps_count, 10, 60);
                Engine.bindOnce(debug, {color: 'rgba(100,100,100,1)'});

                var scores = new HudElement('scores', 0, 70, 200, Engine.canvas.height-70);

                var i = 0.8;
                for (var t in Game.teams)
                {
                    i++;
                    scores.addText('Team ' + t + ' : ' + Game.teams[t].score, 10, 65 + (20 * i), {color: Game.teams[t].color});
                }

                Engine.bindOnce(scores, {color: 'rgba(255,255,255,0.05)'});
                Engine.update();
                window.requestAnimationFrame(x);

                var delta = (new Date().getTime() - Engine.lastTime) / 1000;
                Engine.lastTime = Date.now();

                setTimeout(function ()
                {
                    Engine.fps_count = Math.round(1 / delta);
                }, 1000);

                for(var obj in Engine.objects)
                {
                    if(typeof Engine.objects[obj] !== 'undefined')
                    {
                        if (Engine.objects[obj].instance instanceof HudElement)
                        {
                            delete Engine.objects[obj];
                            Engine.stats.hud--;
                            for(var obj in Engine.objects)
                            {
                                if (Engine.objects[obj].instance instanceof HudElement)
                                {
                                    delete Engine.objects[obj];
                                    Engine.stats.hud--;
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    distance : function(a, b)
    {
        var dx = b.cx - a.cx;
        var dy = b.cy - a.cy;

        return Math.sqrt(dx * dx + dy * dy);
    },

    update : function()
    {

        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';

        for(object in this.objects)
            this.objects[object].instance.draw(this.objects[object].options);
        this.tick++;
    },

    checkEntityCollision : function(object)
    {
        for(var i = 0; i < Engine.objects.length; i++)
        {
            if (typeof Engine.objects[i] !== 'undefined' && Engine.objects[i].instance.id != object.id)
            {
                if (Engine.objects[i].instance instanceof Circle)
                {
                    if(Engine.objects[i].instance.team !== object.team)
                    {
                        Engine.physics.checkCollisions(object, Engine.objects[i].instance);
                    }
                }

                if(typeof Engine.objects[i] !== 'undefined')
                {
                    if (Engine.objects[i].instance instanceof Box && (object instanceof Circle && !object instanceof Projectile))
                    {
                        if(Engine.physics.checkCircleRectCollisions(object, Engine.objects[i].instance))
                        {
                            object.freemove = false;
                            object.vx *= -1;
                            object.vy *= -1;
                        }
                    }
                }
            }
        }
    }
};



