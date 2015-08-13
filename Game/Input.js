/**
 * Created by Mel on 10/08/2015.
 */

var Input = function() {};

Input.prototype.listen = function(callback)
{
    window.document.onkeydown = function(e)
    {
       callback({type: 'keyboard', event: e});
    };

    window.document.onclick = function(e)
    {
        callback({type: 'mouse:click', event: e});
    };

    window.document.onmousedown = function(e)
    {
        callback({type: 'mouse:down', event: e});
    };

    window.document.onmouseup = function(e)
    {
        callback({type: 'mouse:up', event: e});
    };

    window.onresize = function()
    {
        Engine.canvas.width = window.innerWidth;
        Engine.canvas.height = window.innerHeight;
    };
};

var Input = new Input();