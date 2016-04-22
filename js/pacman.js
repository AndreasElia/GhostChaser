/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Pacman = function() {
    this.name = null;
    this.colour = null;
    this.object = null;

    this.speed = 4;

    this.init = function(name, colour, object) {
        this.name = name;
        this.colour = colour;
        this.object = object;

        var currentElementCollada = new t.ColladaLoader();
        currentElementCollada.options.convertUpAxis = true;

        currentElementCollada.load('objects/' + this.object + '.DAE', function(collada) {
            var currentElementDae = collada.scene;

            currentElementDae.position.set(0, 0, 0);
            currentElementDae.scale.set(10, 10, 10);

            currentElementDae.updateMatrix();

            updateElementColour(currentElementDae, new t.MeshBasicMaterial({
                color: this.colour
            }));

            scene.add(currentElementDae);
        });
    };

    this.update = function(dt) {

    };
};
