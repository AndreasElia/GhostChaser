/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Pacman = function() {
    this.name = null;
    this.colour = null;
    this.object = null;

    this.speed = 4;

    this.cube = null;
    this.raycaster = null;

    this.directionUp = 0;
    this.directionDown = 1;
    this.directionLeft = 2;
    this.directionRight = 3;
    this.direction = null;

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
        this.cube.position.set(20 + (x * 10), 0.1, z * 10);
        scene.add(this.cube);

        this.raycaster = new t.Raycaster(new t.Vector3(), new t.Vector3(0, -1, 0), 0, 10);
    };

    this.update = function(dt) {
        this.raycaster.ray.origin.copy(this.cube.position);
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'dot') {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] == intersects[0].object) {
                    score++;
                    scene.remove(textMesh);
                    createText();
                    scene.remove(objects[i]);
                    objects.splice(objects.indexOf(objects[i]), 1);

                    if (score == dotsCount) {
                        console.log("winner");
                    }
                }
            }
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'power') {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] == intersects[0].object) {
                    score += 3;
                    for (var g = 0; g < ghosts.length; g++) {
                        oldGhostColours.push(ghosts[g].cube.material.color.getHex());
                        ghosts[g].cube.material.color.setHex(0x5942C9);
                    }
                    scene.remove(objects[i]);
                    objects.splice(objects.indexOf(objects[i]), 1);
                    if (powerTimer) {
                        currentPowerTime = 0;
                    } else {
                        powerTimer = true;
                    }
                }
            }
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x -= 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionUp) {
                this.direction = null;
            }
            key.reset(key.W);
            key.reset(key.UP);
        } else if (this.direction == this.directionUp) {
            this.cube.position.x -= 1;
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.z -= 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionRight) {
                this.direction = null;
            }
            key.reset(key.D);
            key.reset(key.RIGHT);
        } else if (this.direction == this.directionRight) {
            this.cube.position.z -= 1;
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x += 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionDown) {
                this.direction = null;
            }
            key.reset(key.S);
            key.reset(key.DOWN);
        } else if (this.direction == this.directionDown) {
            this.cube.position.x += 1;
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.z += 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionLeft) {
                this.direction = null;
            }
            key.reset(key.A);
            key.reset(key.LEFT);
        } else if (this.direction == this.directionLeft) {
            this.cube.position.z += 1;
        }

        if ((key.down(key.W) || key.down(key.UP))) {
            if (DEBUG) {
                this.cube.position.x -= 1;
            } else {
                this.direction = this.directionUp;
            }
        } else if ((key.down(key.S) || key.down(key.DOWN))) {
            if (DEBUG) {
                this.cube.position.x += 1;
            } else {
                this.direction = this.directionDown;
            }
        } else if ((key.down(key.A) || key.down(key.LEFT))) {
            if (DEBUG) {
                this.cube.position.z += 1;
            } else {
                this.direction = this.directionLeft;
            }
        } else if ((key.down(key.D) || key.down(key.RIGHT))) {
            if (DEBUG) {
                this.cube.position.z -= 1;
            } else {
                this.direction = this.directionRight;
            }
        }
    };
};
