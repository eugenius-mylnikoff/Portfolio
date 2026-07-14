function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
}

function closeMobileWarning() {
    const warning = document.getElementById('mobile-warning');
    if (warning) {
        warning.classList.add('hidden');
    }
}

window.closeMobileWarning = closeMobileWarning;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);
scene.fog = new THREE.FogExp2(0x111111, 0.02);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document
    .getElementById("canvas-container")
    .appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;

scene.add(new THREE.AmbientLight(0xffffff, 2.5));

const light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(5, 8, 5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
light2.position.set(-5, 3, -5);
scene.add(light2);

const objects = [];

const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.15,
    metalness: 0
});

const mainCube = new THREE.Mesh(cubeGeometry, cubeMaterial);

mainCube.position.y = 0.5;
mainCube.userData = {
    name: "The Cube",
    desc: "Прошлое никогда не умирает..."
};

scene.add(mainCube);
objects.push(mainCube);

const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(cubeGeometry),
    new THREE.LineBasicMaterial({
        color: 0xffffff
    })
);

mainCube.add(edges);

const smallGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);

for (let i = 0; i < 8; i++) {
    const cube = new THREE.Mesh(
        smallGeometry,
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0,
            metalness: 0
        })
    );

    const angle = (i / 8) * Math.PI * 2;
    const radius = 3.2;

    cube.position.set(
        Math.cos(angle) * radius,
        Math.sin(i) * 1.2 + 1,
        Math.sin(angle) * radius
    );

    cube.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    cube.userData = {
        name: "Memory Fragment",
        desc: "Частичка забытого воспоминания."
    };

    scene.add(cube);
    objects.push(cube);
}

scene.add(new THREE.GridHelper(20, 20, 0x333333, 0x222222));

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const tooltip = document.getElementById("tooltip");

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    tooltip.style.left = e.clientX + 15 + "px";
    tooltip.style.top = e.clientY + 15 + "px";
});

let time = 0;
let hovered = null;

function animate() {
    requestAnimationFrame(animate);

    time += 0.01;

    mainCube.rotation.x += 0.005;
    mainCube.rotation.y += 0.01;

    objects.forEach((obj, i) => {
        if (obj !== mainCube) {
            obj.position.y += Math.sin(time + i) * 0.005;
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        }
    });

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (hovered) {
        hovered.material.emissive.setHex(0x000000);
        hovered = null;
    }

    if (intersects.length) {
        hovered = intersects[0].object;

        hovered.material.emissive.setHex(0x444444);

        tooltip.innerHTML =
            `<strong>${hovered.userData.name}</strong><br>${hovered.userData.desc}`;

        tooltip.classList.add("visible");
        document.body.style.cursor = "pointer";
    } else {
        tooltip.classList.remove("visible");
        document.body.style.cursor = "default";
    }

    controls.update();
    renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");
    const progressBar = document.getElementById("loadingProgress");

    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 10;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            setTimeout(() => {
                loading.classList.add("hidden");
            }, 500);
        }

        progressBar.style.width = progress + "%";
    }, 150);

    animate();
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

if (isMobileDevice()) {
    const warning = document.getElementById('mobile-warning');
    if (warning) {
        setTimeout(() => {
            warning.classList.remove('hidden');
        }, 1000);
    }
}
