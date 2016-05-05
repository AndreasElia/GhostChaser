/**
 * @author Andreas Elia / http://github.com/andreaselia/
 */

var DEBUG = true;//false;

// Window variables
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT = WIDTH / HEIGHT;

// Shorthand
var t = THREE;

var gameElement = document.getElementById('gameDivContainer');

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

// Font variables
var font, textGeometry, textMesh, textMaterial;
var fontLoader;

var dots = 0;
var score = 0;
var dotsCount = 0;

var objects = [];

var powerTimer = false;
var maxPowerTime = 300;
var currentPowerTime = 0;
var oldGhostColours = [];

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
    camera.position.z = 150;
    // camera.position.x = 90;
    camera.position.x = 40;

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
            switch (data[x][z]) {
                case Tile.PACMAN_SPAWN:
                    pacman = new Pacman();
                    pacman.init("Pacman", 0xFFEE00, "PacmanObject", x, z);
                    break;
                case Tile.GHOST_SPAWN:
                    var ghost1 = new Ghost();
                    ghost1.init("Clyde", 0xF6821F, "GhostObject", x, z);
                    ghosts.push(ghost1);

                    // var ghost2 = new Ghost();
                    // ghost2.init("Blinky", 0xF599B2, "GhostObject", x, z);
                    // ghosts.push(ghost2);
                    //
                    // var ghost3 = new Ghost();
                    // ghost3.init("Pinky", 0xED1B22, "GhostObject", x, z);
                    // ghosts.push(ghost3);
                    //
                    // var ghost4 = new Ghost();
                    // ghost4.init("Inky", 0xFFCC00, "GhostObject", x, z);
                    // ghosts.push(ghost4);
                    break;
                default:
                    // do nothing
            }
        }
    }

    fontLoader = new t.FontLoader();

    fontLoader.load('fonts/helvetiker_regular.typeface.js', function(response) {
        font = response;

        scene.remove(textMesh);
        createText();
    });

    animate();

    setupScene();
}

function createText() {
    // empty spots
    textGeometry = new t.TextGeometry("Score: " + score, {
        font,
        size: 6,
        height: 1
    });

    textMaterial = new t.MultiMaterial(
        [
            new t.MeshPhongMaterial({
                color: 0xff00ff,
                shading: t.FlatShading
            }),
            new t.MeshPhongMaterial({
                color: 0xffffff,
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
    textMesh.position.z = 5 * 10 + 2;

    textMesh.rotation.order = "YXZ";
    textMesh.rotation.y = 90 * Math.PI / 180;
    textMesh.rotation.x = -90 * Math.PI / 180;
    textMesh.rotation.z = 0;

    scene.add(textMesh);
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
                        side: t.DoubleSide,
                        wireframe: DEBUG
                    });

                    cube = new t.Mesh(geometry, texture);
                    cube.position.set(x * 10, 0.1, z * 10);
                    cube.name = {
                        type: 'wall',
                    };
                    scene.add(cube);
                    objects.push(cube);
                    break;
                default:
                    dots++;
                    if (data[x][z] == Tile.POWER_DOT) {
                        var geometry = new t.BoxGeometry(3, 3, 3),
                            texture, sphere;

                        texture = new THREE.MeshBasicMaterial({
                            color: 0xFFFFFF,
                            side: t.DoubleSide
                        });

                        sphere = new t.Mesh(geometry, texture);
                        sphere.position.set(x * 10, 0.1, z * 10);
                        sphere.name = {
                            type: 'power',
                        };
                        dotsCount += 3;
                        scene.add(sphere);
                        objects.push(sphere);
                    } else if (data[x][z] == Tile.PACMAN_SPAWN) {
                        continue;
                    } else {
                        var geometry = new t.BoxGeometry(1, 1, 1),
                            texture, sphere;

                        texture = new THREE.MeshBasicMaterial({
                            color: 0xFFFFFF,
                            side: t.DoubleSide
                        });

                        sphere = new t.Mesh(geometry, texture);
                        sphere.position.set(x * 10, 0.1, z * 10);
                        sphere.name = {
                            type: 'dot',
                        };
                        dotsCount++;
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

    // for (var g = 0; g < ghosts.length; g++) {
    //     ghosts[g].update(dt);
    // }
    ghosts[0].update(dt);

    if (powerTimer) {
        currentPowerTime++;

        if (currentPowerTime >= maxPowerTime) {
            for (var g = 0; g < ghosts.length; g++) {
                ghosts[g].cube.material.color.setHex(oldGhostColours[g]);
            }

            currentPowerTime = 0;
            powerTimer = false;
        }
    }

    render();

    stats.end();

    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

window.onload = init;
