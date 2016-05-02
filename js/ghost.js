/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Ghost = function() {
    this.name = null;
    this.colour = null;
    this.object = null;

    this.speed = 4;
    this.cube = null;

    this.grid = new PF.Grid(level[0].length, level.length, level);

    this.finder = new PF.AStarFinder();

    this.path = this.finder.findPath(11, 4, 1, 1, this.grid);

    console.log(this.path);


    this.init = function(name, colour, object, x, z) {
        this.name = name;
        this.colour = colour;
        this.object = object;

        var geometry = new t.BoxGeometry(5, 5, 5),
            texture;

        texture = new THREE.MeshBasicMaterial({
            color: this.colour,
            side: t.DoubleSide
        });

        this.cube = new t.Mesh(geometry, texture);
        this.cube.position.set(-30 + (x * 10), 0.1, -30 + (z * 10));
        scene.add(this.cube);
    };

    this.update = function(dt) {
        for (var x = 0; x < this.path.length; x++) {
            for (var z = 0; z < this.path[0].length; z++) {

                if (this.path[z][x] < Math.floor(this.cube.position.x / level[0].length)) {
                    this.cube.translateX(-0.05);
                } else if (this.path[z][x] > Math.floor(this.cube.position.x / level[0].length)) {
                    this.cube.translateX(0.05);
                }

                if (this.path[z][x] < Math.floor(this.cube.position.z / level.length)) {
                    this.cube.translateZ(-0.05);
                } else if (this.path[z][x] > Math.floor(this.cube.position.z / level.length)) {
                    this.cube.translateZ(0.05);
                }
            }
        }
    };
};
