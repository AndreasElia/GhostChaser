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

    this.directionUp = false;
    this.directionDown = false;
    this.directionLeft = false;
    this.directionRight = false;

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
        this.raycaster.ray.origin.z -= 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            key.reset(key.D);
            key.reset(key.RIGHT);
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x -= 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            key.reset(key.W);
            key.reset(key.UP);
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x += 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            key.reset(key.S);
            key.reset(key.DOWN);
        }

        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.z += 5;
        var intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[0].object.name.type == 'wall') {
            key.reset(key.A);
            key.reset(key.LEFT);
        }

        if ((key.down(key.W) || key.down(key.UP))) {
            // this.direction = this.directions.up;
            this.cube.position.x -= 1;
        } else if ((key.down(key.S) || key.down(key.DOWN))) {
            this.cube.position.x += 1;
        } else if ((key.down(key.A) || key.down(key.LEFT))) {
            this.cube.position.z += 1;
        } else if ((key.down(key.D) || key.down(key.RIGHT))) {
            this.cube.position.z -= 1;
        }
    };
};
