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

    this.path = this.finder.findPath(11, 4, 21, 1, this.grid);
    this.pathInfo = false;
    this.count = 0;

    this.gx = 0;
    this.gz = 0;

    this.init = function(name, colour, object, x, z) {
        this.name = name;
        this.colour = colour;
        this.object = object;

        var geometry = new t.BoxGeometry(5, 5, 5),
            texture;

        texture = new t.MeshBasicMaterial({
            color: this.colour,
            side: t.DoubleSide
        });

        this.cube = new t.Mesh(geometry, texture);
        this.cube.position.set(20 + (x * 10), 0.1, z * 10);
        scene.add(this.cube);
    };

    this.update = function(dt) {
        // Draw the path
        if (!this.pathInfo) {
            for (var x = 0; x < this.path.length; x++) {

                var geometry = new t.BoxGeometry(3, 3, 3),
                    texture, cube;

                texture = new t.MeshBasicMaterial({
                    color: 0xB65959,
                    side: t.DoubleSide
                });

                cube = new t.Mesh(geometry, texture);
                cube.position.set(20 + (this.path[x][1] * 10), 0.01, this.path[x][0] * 10);
                scene.add(cube);
            }

            this.pathInfo = true;
        }

        // this.gx = Math.floor(this.cube.position.x / 10) - 1;
        // // this.gz = (Math.floor((20 + this.cube.position.z) / level.length) - 25) * -1;
        //
        // for (var x = 0; x < this.path.length; x++) {
        //     if (this.path[x][1] < this.gx) {
        //         this.cube.translateX(-0.05);
        //     } else if (this.path[x][1] > this.gx) {
        //         this.cube.translateX(0.05);
        //     }
        // }
        //
        // console.log(this.gx + ", " + this.gz);

        this.gx = Math.floor(this.cube.position.x / 10);
        this.gz = Math.floor((20 + this.cube.position.z) / 10);

        console.log("curr: " + (Math.floor(this.cube.position.x / 10)) + ", path: " + this.path[this.count][1]);

        if (this.count < (this.path.length - 1)) {
            if (this.path[this.count][1] < this.gx) {
                this.cube.translateX(-0.05);
            } else if (this.path[this.count][1] > this.gx) {
                this.cube.translateX(0.05);
            }

            this.count++;
        }
    };
};
