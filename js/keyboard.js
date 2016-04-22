/**
 * @author Andreas Elia / http://github.com/andreaselia/
 * @credit mrdoob / http://mrdoob.com/
 */

var Keyboard = function() {
    this.pressed = {};

    this.W = 38;
    this.S = 83;
    this.A = 37;
    this.D = 39;

    this.UP = 87;
    this.DOWN = 40;
    this.LEFT = 65;
    this.RIGHT = 68;

    this.down = function(keyCode) {
        return this.pressed[keyCode];
    };

    this.reset = function(keyCode) {
        delete this.pressed[keyCode];
    };

    this.onKeyDown = function(event) {
        this.pressed[event.keyCode] = true;
    };

    this.onKeyUp = function(event) {
        delete this.pressed[event.keyCode];
    };

    function preventDefaults(event) {
        event.preventDefault();
    };

    function bind(scope, fn) {
        return function() {
            fn.apply(scope, arguments);
        };
    };

    document.addEventListener('contextmenu', preventDefaults, false);
    document.addEventListener('keydown', bind(this, this.onKeyDown), false);
    document.addEventListener('keyup', bind(this, this.onKeyUp), false);
};
