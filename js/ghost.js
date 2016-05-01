/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Ghost = function() {
    this.name = null;
    this.colour = null;
    this.object = null;

    this.speed = 4;

    this.init = function(name, colour, object, x, z) {
        this.name = name;
        this.colour = colour;
        this.object = object;

        var geometry = new t.BoxGeometry(5, 5, 5),
            texture, cube;

        texture = new THREE.MeshBasicMaterial({
            color: this.colour,
            side: t.DoubleSide
        });

        cube = new t.Mesh(geometry, texture);
        cube.position.set(-30 + (x * 10), UNIT * .1, -30 + (z * 10));
        scene.add(cube);
    };

    this.update = function(dt) {

    };
};
