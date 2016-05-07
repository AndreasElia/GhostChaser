/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var Player = function() {
    this.name = null;
    this.colour = null;
    this.speed = 0.75;
    this.cube = null;

    this.raycaster = null;
    this.intersects = null;

    this.directionUp = 0;
    this.directionDown = 1;
    this.directionLeft = 2;
    this.directionRight = 3;
    this.direction = null;

    this.init = function(name, colour, x, z) {
        this.name = name;
        this.colour = colour;

        var geometry = new t.BoxGeometry(5, 5, 5);
        var texture = new t.MeshBasicMaterial({
            color: this.colour,
            side: t.DoubleSide
        });

        this.cube = new t.Mesh(geometry, texture);
        this.cube.position.set(x * 10, 0.1, z * 10);
        this.cube.name = {
            type: 'player',
        };
        scene.add(this.cube);

        this.raycaster = new t.Raycaster(new t.Vector3(), new t.Vector3(0, -1, 0), 0, 10);

        return this;
    };

    this.update = function() {
        // Handle the collisions with a ghost
        this.raycaster.ray.origin.copy(this.cube.position);
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'ghost') {
            if (this.intersects[0].object.name.edible) {
                for (var g = 0; g < ghosts.length; g++) {
                    if (ghosts[g].cube == this.intersects[0].object) {
                        ghosts[g].pathSet = false;
                        ghosts[g].cube.position.set(4 * 10, 0.1, 11 * 10);
                        score += 7;
                        scene.remove(textMesh);
                        gameScoreText();
                        break;
                    }
                }
            } else {
                gameDead = true;
            }
        }

        // Handle the collisions with a dot
        this.raycaster.ray.origin.copy(this.cube.position);
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'dot') {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] == this.intersects[0].object) {
                    dotsCount--;
                    score++;
                    scene.remove(textMesh);
                    gameScoreText();
                    scene.remove(objects[i]);
                    objects.splice(objects.indexOf(objects[i]), 1);

                    if (dotsCount <= 0) {
                        gameWon = true;
                    }
                }
            }
        }

        // Handle the collisions with a power dot
        this.raycaster.ray.origin.copy(this.cube.position);
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'power') {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] == this.intersects[0].object) {
                    dotsCount -= 3;
                    score += 3;
                    for (var g = 0; g < ghosts.length; g++) {
                        oldGhostColours.push(ghosts[g].cube.material.color.getHex());
                        ghosts[g].cube.material.color.setHex(0xFFFFFF);
                        ghosts[g].edible = true;
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

        // Handle the collisions with a wall to the top
        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x -= 5;
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionUp) {
                this.direction = null;
            }
            key.reset(key.W);
            key.reset(key.UP);
        } else if (this.direction == this.directionUp) {
            this.cube.position.x -= 1;
        }

        // Handle the collisions with a wall to the right
        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.z -= 5;
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionRight) {
                this.direction = null;
            }
            key.reset(key.D);
            key.reset(key.RIGHT);
        } else if (this.direction == this.directionRight) {
            this.cube.position.z -= 1;
        }

        // Handle the collisions with a wall to the bottom
        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.x += 5;
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionDown) {
                this.direction = null;
            }
            key.reset(key.S);
            key.reset(key.DOWN);
        } else if (this.direction == this.directionDown) {
            this.cube.position.x += 1;
        }

        // Handle the collisions with a wall to the left
        this.raycaster.ray.origin.copy(this.cube.position);
        this.raycaster.ray.origin.z += 5;
        this.intersects = this.raycaster.intersectObjects(objects);

        if (this.intersects.length > 0 && this.intersects[0].object.name.type == 'wall') {
            if (this.direction == this.directionLeft) {
                this.direction = null;
            }
            key.reset(key.A);
            key.reset(key.LEFT);
        } else if (this.direction == this.directionLeft) {
            this.cube.position.z += this.speed;
        }

        // Handle the movement with either WASD or arrow keys
        if ((key.down(key.W) || key.down(key.UP))) {
            this.direction = this.directionUp;
        } else if ((key.down(key.S) || key.down(key.DOWN))) {
            this.direction = this.directionDown;
        } else if ((key.down(key.A) || key.down(key.LEFT))) {
            this.direction = this.directionLeft;
        } else if ((key.down(key.D) || key.down(key.RIGHT))) {
            this.direction = this.directionRight;
        }
    };
};
