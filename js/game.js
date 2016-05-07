/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

// Window variables
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT = WIDTH / HEIGHT;

// Shorthand
var t = THREE;

// Stats for tracking performance
var stats;

// Main game variables
var scene, camera, loader, renderer, key;

// Font variables
var fontLoader, font, textGeometry, textMesh, textMaterial;

// Colours to for the elements of the game
var Colours = {
    DOT: 0xFFFFFF,
    WALL: 0x294057,
    POWER_DOT: 0xFFFFFF,
    PLAYER: 0xFFEE00,
    SPARKLES: 0xE0BF60,
    BONES: 0xDDDFE0,
    SHADOW: 0x05365B,
    LIGHT: 0xFFFFFF
}

// Tile values for easy use throughout the code
var Tile = {
    WALKABLE: 0,
    WALL: 1,
    GHOST_SPAWN: 4,
    PLAYER_SPAWN: 6,
    POWER_DOT: 7
};

// Whether or not to allow diagonal movement in the ghosts pathfinding
var allowDiagonal = {
    allowDiagonal: false
};

// Variable to store the player
var player;

// Array to store the ghosts in
var ghosts = [];

// Score variables
var score = 0;
var dotsCount = 0;

// Objects array to store collidable objects
var objects = [];

// Power dots array to store power dot locations
var powerDots = [];

// Variables for power dot collection
var powerTimer = false;
var maxPowerTime = 300;
var currentPowerTime = 0;
var oldGhostColours = [];

// Game alive/won/dead variables
var gameAlive = true;
var gameWon = false;
var gameDead = false;

// Level array
var level = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Data array
var data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/**
 * Initializes the main variables and calls in order for the game to function
 */
function init() {
    stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);

    // Create a new keyboard handler
    key = new Keyboard();

    // Create a new scene
    scene = new t.Scene();

    // Create the camera, position it and assign it an offset rotation
    camera = new t.PerspectiveCamera(75, ASPECT, 0.1, 1000);

    camera.position.y = 140;
    camera.position.z = 120;
    camera.position.x = 120;

    camera.rotation.order = "YXZ";
    camera.rotation.y = 90 * Math.PI / 180;
    camera.rotation.x = -50 * Math.PI / 180;
    camera.rotation.z = 0;

    // Create a new renderer and add it to the document
    renderer = new t.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    // Add an ambient light to the map
    var ambientLight = new t.AmbientLight(Colours.LIGHT);
    scene.add(ambientLight);

    // Create the player and ghosts in their location from the data array
    for (var x = 0; x < level.length; x++) {
        for (var z = 0; z < level[0].length; z++) {
            if (data[x][z] == Tile.PLAYER_SPAWN) {
                player = new Player().init('Heimdall', Colours.PLAYER, x, z);
            } else if (data[x][z] == Tile.GHOST_SPAWN) {
                ghosts.push(new Ghost().init('Sparkles', Colours.SPARKLES, 0.5, x, z));
                ghosts.push(new Ghost().init('Bones', Colours.BONES, 1, x, z));
                ghosts.push(new Ghost().init('Shadow', Colours.SHADOW, 0.5, x, z));
            }
        }
    }

    // Create a new font loader
    fontLoader = new t.FontLoader();

    // Load the font
    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        // Display the score text
        gameScoreText();
    });

    // Create all of the levels elements
    createLevel();

    // Call the animate method to start updating and rendering the game
    animate();
}

/**
 * Sets up everything game related in the scene
 */
function createLevel() {
    for (var x = 0; x < level.length; x++) {
        for (var z = 0; z < level[0].length; z++) {
            if (level[x][z] == Tile.WALL) {
                // Create the wall tiles
                var geometry = new t.BoxGeometry(10, 10, 10);
                var texture = new t.MeshBasicMaterial({
                    color: Colours.WALL,
                    side: t.DoubleSide
                });
                var cube = new t.Mesh(geometry, texture);

                cube.position.set(x * 10, 0.1, z * 10);
                cube.name = {
                    type: 'wall',
                };

                scene.add(cube);
                objects.push(cube);
            } else {
                if (data[x][z] == Tile.POWER_DOT) {
                    // Create a power dot in the space assigned in the data array
                    var geometry = new t.BoxGeometry(3, 3, 3);
                    var texture = new t.MeshBasicMaterial({
                        color: Colours.POWER_DOT,
                        side: t.DoubleSide
                    });
                    var cube = new t.Mesh(geometry, texture);

                    cube.position.set(x * 10, 0.1, z * 10);
                    cube.name = {
                        type: 'power',
                    };

                    dotsCount += 3;

                    scene.add(cube);
                    objects.push(cube);
                    powerDots.push([x, z]);
                } else if (data[x][z] == Tile.PLAYER_SPAWN) {
                    // The players spawn position doesn't need a dot so skip it
                    continue;
                } else {
                    // Create the dots on all empty tiles
                    var geometry = new t.BoxGeometry(1, 1, 1);
                    var texture = new t.MeshBasicMaterial({
                        color: Colours.DOT,
                        side: t.DoubleSide
                    });
                    var cube = new t.Mesh(geometry, texture);

                    cube.position.set(x * 10, 0.1, z * 10);
                    cube.name = {
                        type: 'dot',
                    };

                    dotsCount++;

                    scene.add(cube);
                    objects.push(cube);
                }
            }
        }
    }
}

/**
 * Handles calls to all updating required to run the game
 */
function animate() {
    stats.begin();

    // Update the player
    player.update();

    // Update the ghosts
    for (var g = 0; g < ghosts.length; g++) {
        ghosts[g].update();
    }

    // If a power dot has been collected
    if (powerTimer) {
        // Increase the power time
        currentPowerTime++;

        // If the current power time has reached the max power time
        if (currentPowerTime >= maxPowerTime) {
            for (var g = 0; g < ghosts.length; g++) {
                // Set the ghosts back to their original colour
                ghosts[g].cube.material.color.setHex(oldGhostColours[g]);
                // They are no longer edible
                ghosts[g].edible = false;
            }
            // Reset the variables
            currentPowerTime = 0;
            powerTimer = false;
        }
    }

    if (gameDead) {
        gameDeadText();
        gameAlive = false;
    } else if (gameWon) {
        gameWonText();
        gameAlive = false;
    }

    // Render the renderer
    renderer.render(scene, camera);

    stats.end();

    if (gameAlive) {
        requestAnimationFrame(animate);
    }
}

/**
 * Handles the drawing of the score text
 */
function gameScoreText() {
    textGeometry = new t.TextGeometry("Score: " + (score * 10), {
        font,
        size: 6,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();

    var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    var textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

    textMesh.position.x = -5 * 10 + (-0.5 * textWidth) + 1;
    textMesh.position.y = 0.1 + (-0.5 * textHeight);
    textMesh.position.z = 5 * 10 + 73;

    textMesh.rotation.order = "YXZ";
    textMesh.rotation.y = 90 * Math.PI / 180;
    textMesh.rotation.x = -45 * Math.PI / 180;
    textMesh.rotation.z = 0;

    scene.add(textMesh);
}

/**
 * Handles the drawing of the player won text
 */
function gameWonText() {
    textGeometry = new t.TextGeometry("You have won! Refresh to play again.", {
        font,
        size: 10,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();

    var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    var textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

    textMesh.position.x = -5 * 10 + (-0.5 * textWidth) + 1;
    textMesh.position.y = 0.1 + (-0.5 * textHeight);
    textMesh.position.z = 5 * 10 + 170;

    textMesh.rotation.order = "YXZ";
    textMesh.rotation.y = 90 * Math.PI / 180;
    textMesh.rotation.x = -45 * Math.PI / 180;
    textMesh.rotation.z = 0;

    scene.add(textMesh);
}

/**
 * Handles the drawing of the player dead text
 */
function gameDeadText() {
    textGeometry = new t.TextGeometry("You have died! Refresh to play again.", {
        font,
        size: 10,
        height: 0
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: t.SmoothShading
            })
        ]
    );

    textMesh = new t.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();

    var textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    var textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

    textMesh.position.x = -5 * 10 + (-0.5 * textWidth) + 1;
    textMesh.position.y = 0.1 + (-0.5 * textHeight);
    textMesh.position.z = 5 * 10 + 170;

    textMesh.rotation.order = "YXZ";
    textMesh.rotation.y = 90 * Math.PI / 180;
    textMesh.rotation.x = -45 * Math.PI / 180;
    textMesh.rotation.z = 0;

    scene.add(textMesh);
}

/**
 * Ramdom number between the min and max, including both
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Random boolean
 * @return {Boolean}
 */
function randomBool() {
    return Math.random() < .5;
}

/**
 * When the window size is changed, this function resizes the elements to fit within
 */
function onWindowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(WIDTH, HEIGHT);
}

window.addEventListener('resize', onWindowResize, false);

window.onload = init;
