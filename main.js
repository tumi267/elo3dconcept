import * as THREE from 'three'

// --- Scene setup ---
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
renderer.setClearColor(0x000000, 0)
document.body.appendChild(renderer.domElement)

// --- Lights ---
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5,5,5)
scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.3))

// --- Petal shape ---
const petalShape = new THREE.Shape()
petalShape.moveTo(0, 0)           // fatter base
petalShape.quadraticCurveTo(1, 2, 0, 3)
petalShape.quadraticCurveTo(-1, 2, 0, 0)

const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.5,
    steps: 20
}

const geometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings)

// --- Apply twist ---
const twistAngle = Math.PI / 2
const height = 3
geometry.vertices.forEach(v => {
    const t = v.y / height
    const angle = twistAngle * t
    const x = v.x * Math.cos(angle) - v.z * Math.sin(angle)
    const z = v.x * Math.sin(angle) + v.z * Math.cos(angle)
    v.x = x
    v.z = z
})
geometry.computeVertexNormals()

// --- Pink petal material ---
const material = new THREE.MeshStandardMaterial({
    color: 0xff66cc,
    roughness: 0.5,
    metalness: 0
})

const petal = new THREE.Mesh(geometry, material)
scene.add(petal)

// --- Section target positions and scales ---
const sections = document.querySelectorAll('section')
const sectionTransforms = {
    0: { x: 2, y: 0, z: 0, scale: 0.5 }, // first section -> right & smaller
    1: { x: -2, y: 0, z: 1, scale: 0.3 },   // second section -> default
    2: { x: -1, y: 0, z: -2, scale: 0.5 }, // third section -> left
    3:{x: 3, y: 0, z: 0, scale: 0.2},
    4:{x: 3, y: -2, z: 0, scale: 0.2},
    5:{x: 3, y: -2, z: 0, scale: 0.2}

}

// --- Current target values ---
let target = { x: 0, y: 0, z: 0, scale: 1 }

// --- Intersection Observer ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const index = Array.from(sections).indexOf(entry.target)
            target = sectionTransforms[index] || {x:0,y:0,z:0,scale:1}
        }
    })
}, { threshold: 0.5 })

sections.forEach(section => observer.observe(section))

// --- Animation loop (globe rotation + smooth transform) ---
function animate() {
    requestAnimationFrame(animate)

    // Spin like globe
    // petal.rotation.x += 0.01
    petal.rotation.y += 0.015
    // petal.rotation.z += 0.02

    // Smoothly interpolate position
    petal.position.x += (target.x - petal.position.x) * 0.05
    petal.position.y += (target.y - petal.position.y) * 0.05
    petal.position.z += (target.z - petal.position.z) * 0.05

    // Smoothly interpolate scale
    petal.scale.x += (target.scale - petal.scale.x) * 0.05
    petal.scale.y += (target.scale - petal.scale.y) * 0.05
    petal.scale.z += (target.scale - petal.scale.z) * 0.05

    renderer.render(scene, camera)
}
animate()

// --- Responsive ---
updatePetalForScreen();

// Update on resize
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  updatePetalForScreen();

})
function updatePetalForScreen() {
    const isMobile = window.innerWidth < 768;
  
    if (isMobile) {
      // Push the camera back and scale down the petal
      camera.position.z = 7;
      petal.scale.set(0.6, 0.6, 0.6);
  
      // Optional: adjust target positions so sections make sense
      for (let key in sectionTransforms) {
        sectionTransforms[key].x *= 0.5;
        sectionTransforms[key].y *= 0.5;
        sectionTransforms[key].z *= 0.5;
        sectionTransforms[key].scale *= 0.6;
      }
  
    } else {
      camera.position.z = 5;
      petal.scale.set(1, 1, 1);
  
      // Reset section transforms if needed
      sectionTransforms[0] = { x: 2, y: 0, z: 0, scale: 0.5 };
      sectionTransforms[1] = { x: -2, y: 0, z: 1, scale: 0.3 };
      sectionTransforms[2] = { x: -1, y: 0, z: -2, scale: 0.5 };
      sectionTransforms[3] = { x: 3, y: 0, z: 0, scale: 0.2 };
      sectionTransforms[4] = { x: 3, y: -2, z: 0, scale: 0.2 };
      sectionTransforms[5] = { x: 3, y: -2, z: 0, scale: 0.2 };
    }
  }
  