/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

// Window variables
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT = WIDTH / HEIGHT;

// Shorthand
var t = THREE;

var gameElement = document.getElementById('gameDivContainer');

var dots = 0,
    score = 0;

// Stats for tracking performance
var stats, key;

// Main game variables
var scene, camera, loader, renderer, clock;

// Array to store pacman
var pacman;

// Array to store the ghosts
var ghosts = [];

// Tile values for easy use throughout the code
var Tile = {
    WALKABLE: 0,
    WALL: 1,
    GHOST_SPAWN: 4,
    PACMAN_SPAWN: 6,
    POWER_DOT: 7
};

// Stores current element Collada and Dae file
var currentElementCollada;
var currentElementDae;

// Stores the texture and font loaders
var fontLoader;

/*
    ------------------------------------
 */

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var ASPECT = WIDTH / HEIGHT;
var UNIT = 100,
    WALLSIZE = 16;

var objects = [];

var t = THREE,
    stats, scene, camera, renderer, clock;

var level = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 0, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function init() {
    stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);

    key = new Keyboard();

    // Creates a new scene
    scene = new t.Scene();

    // create the camera and position it
    camera = new t.PerspectiveCamera(75, ASPECT, 0.1, 1000);

    // camera.position.y = 110;
    camera.position.y = 190;
    camera.position.z = 80;
    // camera.position.x = 90;
    camera.position.x = 10;

    // camera.rotation.x = -5.5;

    camera.rotation.order = "YXZ";
    camera.rotation.y = 90 * Math.PI / 180;
    // camera.rotation.x = -50 * Math.PI / 180;
    camera.rotation.x = -90 * Math.PI / 180;
    camera.rotation.z = 0;

    // New WebGL Renderer
    renderer = new t.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);

    document.body.appendChild(renderer.domElement);

    clock = new t.Clock();

    var ambientLight = new t.AmbientLight(0xFFFFFF);

    scene.add(ambientLight);

    for (var x = 0; x < level.length; x++) {
        for (var z = 0; z < level[0].length; z++) {
            switch (level[x][z]) {
                case Tile.PACMAN_SPAWN:
                    pacman = new Pacman();
                    pacman.init("Pacman", 0xFFEE00, "PacmanObject", x, z);
                    break;
                case Tile.GHOST_SPAWN:
                    var ghost1 = new Ghost();
                    ghost1.init("Clyde", 0xF6821F, "GhostObject", x, z);

                    var ghost2 = new Ghost();
                    ghost2.init("Blinky", 0xF599B2, "GhostObject", x, z);

                    var ghost3 = new Ghost();
                    ghost3.init("Pinky", 0xED1B22, "GhostObject", x, z);

                    var ghost4 = new Ghost();
                    ghost4.init("Inky", 0xFFCC00, "GhostObject", x, z);
                    break;
                default:
                    // do nothing
            }
        }
    }

    animate();

    setupScene();
}

function setupScene() {
    for (var x = 0; x < level.length; x++) {
        for (var z = 0; z < level[0].length; z++) {
            switch (level[x][z]) {
                case Tile.WALL:
                    var geometry = new t.BoxGeometry(10, 10, 10),
                        texture, cube;

                    texture = new THREE.MeshBasicMaterial({
                        color: 0x5942C9,
                        side: t.DoubleSide
                    });

                    cube = new t.Mesh(geometry, texture);
                    cube.position.set(-30 + (x * 10), UNIT * .1, -30 + (z * 10));
                    cube.name = {
                        type: 'wall',
                    };
                    scene.add(cube);
                    objects.push(cube);
                    break;
                default:
                    dots++;
                    if (level[x][z] == Tile.POWER_DOT) {
                        var geometry = new t.BoxGeometry(3, 3, 3),
                            texture, sphere;

                        texture = new THREE.MeshBasicMaterial({
                            color: 0xFFFFFF,
                            side: t.DoubleSide
                        });

                        sphere = new t.Mesh(geometry, texture);
                        sphere.position.set(-30 + (x * 10), UNIT * .1, -30 + (z * 10));
                        sphere.name = {
                            type: 'power',
                        };
                        scene.add(sphere);
                        objects.push(sphere);
                    } else {
                        var geometry = new t.BoxGeometry(1, 1, 1),
                            texture, sphere;

                        texture = new THREE.MeshBasicMaterial({
                            color: 0xFFFFFF,
                            side: t.DoubleSide
                        });

                        sphere = new t.Mesh(geometry, texture);
                        sphere.position.set(-30 + (x * 10), UNIT * .1, -30 + (z * 10));
                        sphere.name = {
                            type: 'dot',
                        };
                        scene.add(sphere);
                        objects.push(sphere);
                    }
            }
        }
    }
}

function animate() {
    var dt = clock.getDelta();

    stats.begin();

    pacman.update(dt);

    for (var g = 0; g < ghosts.length; g++) {
        ghosts[g].update(dt);
    }

    render();

    stats.end();

    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

window.onload = init;
