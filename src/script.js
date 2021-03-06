import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const partcileTexture = textureLoader.load('/textures/particles/4.png')
/**
 * 
 * Particles
 */

// const particlesGeometry = new THREE.SphereBufferGeometry(1,32,32)
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    sizeAttenuation: true,
    color:"#ff88cc",
    transparent: true,
    alphaMap: partcileTexture,
    alphaTest: 0.001,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()
const speed = - 0.001;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    particles.rotation.y = elapsedTime * 0.05
    // Update controls
    controls.update()

    for(let i = 0; i < count; i++){
        const i3 = i * 1
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3+3] = Math.cos(elapsedTime + x )
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)
    camera.translateZ(speed)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

const audio = new Audio('/nocturne.mp3');
document.addEventListener('click', musicPlay);
function musicPlay() {
    audio.play();
    document.removeEventListener('click', musicPlay);
}

tick()