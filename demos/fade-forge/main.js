/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice && cursor) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Hover detection
    const target = e.target;
    const isInteractive = target.closest('a, button, .magnetic-btn, [data-hover]');
    if (isInteractive) {
      cursorRing.classList.remove('opacity-0', 'scale-0');
      cursorRing.classList.add('opacity-100', 'scale-100');
      cursorDot.style.transform = 'scale(0)';
    } else {
      cursorRing.classList.add('opacity-0', 'scale-0');
      cursorRing.classList.remove('opacity-100', 'scale-100');
      cursorDot.style.transform = 'scale(1)';
    }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ===== LENIS SMOOTH SCROLL ===== */
let lenis;
if (!isTouchDevice) {
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  // Anchor clicks via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target);
    });
  });
}

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* ===== SERVICE CARD 3D TILT ===== */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
    card.style.boxShadow = '0 25px 50px -12px rgba(201, 169, 110, 0.15)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    card.style.boxShadow = 'none';
  });
});

/* ===== GSAP + SCROLLTRIGGER ===== */
gsap.registerPlugin(ScrollTrigger);

// Prep hero word children FIRST
gsap.set('.hero-word span', { y: '120%', opacity: 0 });

// Hero entrance with stagger
const heroWords = document.querySelectorAll('.hero-word span');
gsap.set(heroWords, { y: '130%', opacity: 0 });

const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTL
  .to('#hero-label', { opacity: 1, y: 0, duration: 0.8, delay: 1.6 })
  .to(heroWords, { 
    y: 0, 
    opacity: 1, 
    duration: 1, 
    stagger: 0.08,
    ease: 'power4.out'
  }, '-=0.4')
  .to('#hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('#hero-cta', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
  .to('#scroll-indicator', { opacity: 1, duration: 0.8 }, '-=0.2');

// Preloader fade-out (1.5s = preloader line animation duration)
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('fade-out');
}, 1500);

// Scroll reveal animations
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    }
  );
});

// Parallax on atmosphere images
document.querySelectorAll('#atmosphere img').forEach((img, i) => {
  gsap.fromTo(img, 
    { scale: 1.2, yPercent: i % 2 === 0 ? 10 : -10 },
    {
      yPercent: i % 2 === 0 ? -10 : 10,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.overflow-hidden'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );
});

// Navigation scroll effect
const nav = document.getElementById('nav');
ScrollTrigger.create({
  trigger: '#hero',
  start: 'bottom top',
  onEnter: () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ===== PERFORMANCE ===== */
// Pause animations when tab not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
    if (heroScene) heroScene.running = false;
  } else {
    gsap.globalTimeline.resume();
    if (heroScene) heroScene.running = true;
  }
});

/* ===== WEBGL GOLD PARTICLES ===== */
const heroCanvas = document.getElementById('hero-canvas');
let heroScene = null;

if (heroCanvas && !isTouchDevice) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, heroCanvas.offsetWidth / heroCanvas.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Gold particles
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities.push({
      x: (Math.random() - 0.5) * 0.003,
      y: Math.random() * 0.002 + 0.001,
      z: (Math.random() - 0.5) * 0.001
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Particle sizes attribute
  const sizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) sizes[i] = Math.random() * 0.15 + 0.05;
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material with soft glow
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.8 },
      uColor: { value: new THREE.Color('#c9a96e') }
    },
    vertexShader: `
      attribute float aSize;
      varying float vDistance;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = -mvPosition.z;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      uniform vec3 uColor;
      varying float vDistance;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        float alpha = smoothstep(0.5, 0.05, dist) * uOpacity;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 5;

  // Mouse interaction — use existing globals or new named vars
  let heroMouseX = 0, heroMouseY = 0;
  let heroTargetX = 0, heroTargetY = 0;
  document.addEventListener('mousemove', (e) => {
    heroMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    heroMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll-driven fade
  gsap.to(material.uniforms.uOpacity, {
    value: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  heroScene = { running: true };

  function animateParticles() {
    if (!heroScene.running) { requestAnimationFrame(animateParticles); return; }
    
    heroTargetX += (heroMouseX - heroTargetX) * 0.02;
    heroTargetY += (heroMouseY - heroTargetY) * 0.02;
    
    camera.position.x = heroTargetX * 0.5;
    camera.position.y = -heroTargetY * 0.3;
    camera.lookAt(scene.position);

    const posArray = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i].x;
      posArray[i * 3 + 1] += velocities[i].y;
      posArray[i * 3 + 2] += velocities[i].z;
      
      // Reset if out of bounds
      if (posArray[i * 3 + 1] > 10) posArray[i * 3 + 1] = -10;
      if (posArray[i * 3] > 10 || posArray[i * 3] < -10) velocities[i].x *= -1;
      if (posArray[i * 3 + 2] > 5 || posArray[i * 3 + 2] < -5) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    particles.rotation.y += 0.0003;

    renderer.render(scene, camera);
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = heroCanvas.offsetWidth / heroCanvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);
  });
}
