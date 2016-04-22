/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Ghost = function() {
    this.name = null;
    this.colour = null;
    this.object = null;

    this.speed = 4;

    this.init = function(name, colour, object) {
        this.name = name;
        this.colour = colour;
        this.object = object;

        // name will be used to load the model
    };

    this.update = function(dt) {

    };
};
