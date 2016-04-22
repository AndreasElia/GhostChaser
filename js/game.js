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
var stats = new Stats();

// Keyboard handler
var key = new Keyboard();

// Main game variables
var scene = new t.Scene();

var camera = new t.PerspectiveCamera(75, ASPECT, 0.1, 1000);

var loader = new t.TextureLoader();

var renderer;

var clock = new t.Clock();

// Array to store pacman
var pacman;

// Array to store the ghosts
var ghosts = [];

// The colour of the walls
var wallColour = 0x5942C9;

// Tile values for easy use throughout the code
var Tile = {
    WALKABLE: 0,
    WALL: 1,
    LEFT_TELEPORT: 2,
    RIGHT_TELEPORT: 3,
    GHOST_SPAWN: 4,
    GHOST_DOOR: 5
};

/**
 * Level Array
 * 0 = walkable (dots)
 * 1 = wall
 * 2 = left teleport
 * 3 = right teleport
 * 4 = ghost spawn
 * 5 = ghost door
 * @type {Array}
 */
var level = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function initEntities() {
    pacman = new Pacman().init("Pacman", 0xFFEE00, "PacmanObject");

    ghosts.push(new Ghost().init("Clyde", 0xF6821F, "GhostObject"));
    ghosts.push(new Ghost().init("Blinky", 0xF599B2, "GhostObject"));
    ghosts.push(new Ghost().init("Pinky", 0xED1B22, "GhostObject"));
    ghosts.push(new Ghost().init("Inky", 0xFFFE03, "GhostObject"));
}

function initLevel() {
    for (var x = 0; x < level.length; x++) {
        for (var z = 0; z < level[0].length; z++) {
            switch (level[x][z]) {
                case Tile.WALL:
                case Tile.LEFT_TELEPORT:
                case Tile.RIGHT_TELEPORT:
                case Tile.GHOST_DOOR:
                    var wall = new t.Mesh(new t.CubeGeometry(1, 1, 1), new t.MeshLambertMaterial({
                        color: wallColour
                    }));

                    wall.position.set(x, 3, z);

                    scene.add(wall);
                    break;
                default:
                    // everything else
            }
        }
    }
}

function animate() {
    var dt = clock.getDelta();

    stats.begin();

    // code

    pacman.update(dt);

    for (var g = 0; g < ghosts.length; g++) {
        ghosts[g].update(dt);
    }

    stats.end();

    requestAnimationFrame(animate);
}

function updateElementColour(object, material) {
    object.material = material;

    if (object.children) {
        for (var i = 0; i < object.children.length; i++) {
            updateElementColour(object.children[i], material);
        }
    }
}

function init() {
    // Append the stats panel to the page
    document.body.appendChild(stats.dom);

    // Camera zoom and position
    camera.zoom = 0.7;

    // Load Texture(s)
    // textures.push(loader.load('textures/pacman.png'));

    // Format textures if needed
    // for (var x = 0; x < textures.length; x++) {
    //     textures[x].magFilter = t.NearestFilter;
    //     textures[x].minFilter = t.NearestMipMapLinearFilter;
    // }

    // Setup light in the scene
    var ambientLight = new t.AmbientLight(0xFFFFFF);

    // Add the ambient light to the scene
    scene.add(ambientLight);
}

window.onload = init;
