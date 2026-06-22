// Cursor with magnetic pull effect
const c=document.getElementById('cursor'), cr=document.getElementById('cursor-ring');
let cx=0,cy=0,tx=0,ty=0;
if(!window.matchMedia('(pointer:coarse)').matches){
  document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;});
  function cur(){cx+=(tx-cx)*.15;cy+=(ty-cy)*.15;c.style.left=cx+'px';c.style.top=cy+'px';cr.style.left=cx+'px';cr.style.top=cy+'px';requestAnimationFrame(cur);}
  cur();

  // Magnetic effect — element moves WITH cursor, not just scale
  const magneticEls=document.querySelectorAll('a, button, input, select, textarea, .page-btn');
  magneticEls.forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const rect=el.getBoundingClientRect();
      const mx=e.clientX-(rect.left+rect.width/2);
      const my=e.clientY-(rect.top+rect.height/2);
      el.style.transform=`translate(${mx*0.3}px,${my*0.3}px)`;
      cr.style.width='48px'; cr.style.height='48px';
      cr.style.borderColor='var(--wax)';
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transform='translate(0,0)';
      el.style.transition='transform .4s cubic-bezier(.22,1,.36,1)';
      cr.style.width='32px'; cr.style.height='32px';
      cr.style.borderColor='var(--ember)';
    });
    el.addEventListener('mouseenter',()=>{
      el.style.transition='transform .1s ease-out';
    });
  });
}

// Candle WebGL
const can=document.getElementById('candle-canvas');
const s=new THREE.Scene(), cam=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,100);
const r=new THREE.WebGLRenderer({canvas:can,alpha:true,antialias:true});
r.setSize(innerWidth,innerHeight); r.setPixelRatio(Math.min(2,devicePixelRatio));

const N=1500,pos=new Float32Array(N*3),sz=new Float32Array(N),off=new Float32Array(N);
for(let i=0;i<N;i++){
  pos[i*3]=(Math.random()-.5)*20; pos[i*3+1]=(Math.random()-.5)*20; pos[i*3+2]=(Math.random()-.5)*15;
  sz[i]=Math.random()*.12+.04; off[i]=Math.random()*Math.PI*2;
}
const g=new THREE.BufferGeometry();
g.setAttribute('position',new THREE.BufferAttribute(pos,3));
g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
g.setAttribute('aOff',new THREE.BufferAttribute(off,1));

const m=new THREE.ShaderMaterial({
  uniforms:{uTime:{value:0},uColor:{value:new THREE.Color('#d4845c')}},
  vertexShader:`attribute float aSize,aOff;varying float vDist;uniform float uTime;void main(){vec3 p=position;float t=uTime*.8+aOff;p.y+=sin(t)*.4;p.x+=cos(t*.6)*.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=aSize*(300./-mv.z);gl_Position=projectionMatrix*mv;vDist=-mv.z;}`,
  fragmentShader:`uniform vec3 uColor;varying float vDist;void main(){float d=distance(gl_PointCoord,vec2(.5));float a=smoothstep(.5,.08,d);a*=smoothstep(15.,5.,vDist);gl_FragColor=vec4(uColor*1.3,a*.7);}`,
  transparent:true, blending:THREE.AdditiveBlending, depthWrite:false
});
s.add(new THREE.Points(g,m)); cam.position.z=8;

let t=0, run=true;
document.addEventListener('visibilitychange',()=>run=!document.hidden);
function loop(){requestAnimationFrame(loop);if(!run)return;t+=.016;m.uniforms.uTime.value=t;s.children[0].rotation.y+=.0003;r.render(s,cam);}
loop();
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight);});

// GSAP
gsap.registerPlugin(ScrollTrigger);
const tl=gsap.timeline({defaults:{ease:'power4.out'}});
tl.to('#hero-label',{opacity:1,duration:1,delay:.5})
  .to('.hero-title .line span',{y:0,duration:1.2,stagger:.15},'-=.6')
  .to('#hero-sub',{opacity:1,duration:1},'-=.8')
  .to('#hero-cta',{opacity:1,scale:1,duration:.8,ease:'back.out(1.7)'},'-=.6');

gsap.from('.menu-header',{opacity:0,y:40,duration:1,scrollTrigger:{trigger:'.section-menu',start:'top 75%'}});
gsap.utils.toArray('.dish').forEach((el,i)=>{gsap.set(el,{y:30,opacity:0});gsap.to(el,{opacity:1,y:0,duration:.8,delay:i*.15,scrollTrigger:{trigger:el,start:'top 90%'}});});
gsap.from('.section-ambience .ambience-quote',{opacity:0,y:50,duration:1.2,scrollTrigger:{trigger:'.section-ambience',start:'top 70%'}});
gsap.from('.gallery-item',{opacity:0,y:40,duration:.8,stagger:.15,scrollTrigger:{trigger:'.section-gallery',start:'top 75%'}});
gsap.from('.team-card',{opacity:0,y:40,duration:.8,stagger:.2,scrollTrigger:{trigger:'.section-team',start:'top 75%'}});
gsap.from('.reservation-card',{opacity:0,y:40,duration:1,scrollTrigger:{trigger:'.section-reservation',start:'top 80%'}});

// Nav
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});}));

// Book flip - single page, no flipping needed for MVP
document.getElementById('prevBtn').classList.add('disabled');
document.getElementById('nextBtn').classList.add('disabled');

// Form
document.getElementById('reservationForm')?.addEventListener('submit',e=>{e.preventDefault();alert('Reservation received. We will contact you shortly.');e.target.reset();});
