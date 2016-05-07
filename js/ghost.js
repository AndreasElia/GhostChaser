/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Ghost = function() {
    this.name = null;
    this.colour = 0xFFFFFF;
    this.speed = 0;
    this.cube = null;

    this.grid = new PF.Grid(level[0].length, level.length, level);
    this.finder = new PF.BiAStarFinder(allowDiagonal);
    this.path = [];

    this.pathSet = false;
    this.pathInfo = false;
    this.corner = 0;
    this.count = 0;

    this.gx = 0;
    this.gz = 0;

    this.powerDotCount = 0;
    this.edible = false;

    this.init = function(name, colour, speed, x, z) {
        this.name = name;
        this.colour = colour;
        this.speed = speed;

        var geometry = new t.BoxGeometry(5, 5, 5);
        var texture = new t.MeshBasicMaterial({
            color: this.colour,
            side: t.DoubleSide
        });

        this.cube = new t.Mesh(geometry, texture);
        this.cube.position.set(x * 10, 0.1, z * 10);
        this.cube.name = {
            type: 'ghost',
            edible: this.edible
        };

        scene.add(this.cube);
        objects.push(this.cube);

        return this;
    };

    this.update = function() {
        // Always update the ghosts name to let the player know if it is in an edible state or not
        this.cube.name = {
            type: 'ghost',
            edible: this.edible
        };

        if (this.name == 'Sparkles' && !this.pathSet) {
            // This ghost will constantly pathfind to the players position
            this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), Math.floor(player.cube.position.z / 10), Math.floor(player.cube.position.x / 10), this.grid.clone());

            this.pathInfo = false;
            this.pathSet = true;
            this.count = 0;
        } else if (this.name == 'Bones' && !this.pathSet) {
            // This ghost will circle the outer walls of the level but sometimes go back on themself
            if (this.corner == 0) {
                this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), 1, 1, this.grid.clone());
                this.corner++;
            } else if (this.corner == 1) {
                this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), 1, 7, this.grid.clone());
                (randomBool()) ? this.corner++: this.corner--;
            } else if (this.corner == 2) {
                this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), 21, 7, this.grid.clone());
                (randomBool()) ? this.corner++: this.corner--;
            } else if (this.corner == 3) {
                this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), 21, 1, this.grid.clone());
                this.corner = 0;
            }

            this.pathInfo = false;
            this.pathSet = true;
            this.count = 0;
        } else if (this.name == 'Shadow' && !this.pathSet) {
            // This ghost will circle round to all of the power dots
            if (powerDots.length < this.powerDotCount) {
                this.powerDotCount = 0;
            }

            if (powerDots.length > this.powerDotCount) {
                this.path = this.finder.findPath(Math.floor(this.cube.position.z / 10), Math.floor(this.cube.position.x / 10), powerDots[this.powerDotCount][1], powerDots[this.powerDotCount][0], this.grid.clone());
                this.powerDotCount++;
            }

            this.pathInfo = false;
            this.pathSet = true;
            this.count = 0;
        }

        // Handle the movement along the path comparing it to the current position
        if (this.pathSet && this.path.length > this.count) {
            if ((this.path[this.count][1] * 10) < this.cube.position.x) {
                this.cube.translateX(-this.speed);
            } else if ((this.path[this.count][1] * 10) > this.cube.position.x) {
                this.cube.translateX(this.speed);
            } else if ((this.path[this.count][0] * 10) > this.cube.position.z) {
                this.cube.translateZ(this.speed);
            } else if ((this.path[this.count][0] * 10) < this.cube.position.z) {
                this.cube.translateZ(-this.speed);
            } else {
                // Every time the ghost moves to a path step the count is increased
                this.count++;
            }
        }

        // Handle checking if the ghost is at the final step of the path and
        // request a new path by setting pathSet to false
        if (this.pathSet && this.path[this.path.length - 1] != undefined) {
            if (this.path[this.path.length - 1][0] == Math.floor(this.cube.position.z / 10) && this.path[this.path.length - 1][1] == Math.floor(this.cube.position.x / 10)) {
                this.pathSet = false;
            }
        }
    };
};
