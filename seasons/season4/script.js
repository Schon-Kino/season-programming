/* =====================================================
   THREE‑LAYER CANVAS WAVES  –  darkest, flattest on top
===================================================== */

/* -------- LAYER CONFIG --------
   amp  = fraction of canvas‑height (bigger = peakier)
   base = fraction of canvas‑height where the sine oscillates
   λ    = wavelength in CSS px
   speed= px / s (positive ⇒ moves right‑to‑left)      */
const LAYERS = [
  { color:'#4AA4DE', amp:0.12, base:0.80, λ:280, speed:32 },   // nearest, most peaked, lightest
  { color:'#1E7FCB', amp:0.08, base:0.45, λ:400, speed:24 },   // mid
  { color:'#005B99', amp:0.05, base:0.05, λ:280, speed:12 }    // farthest, flattest, darkest
];

/* -------- CANVAS BOILERPLATE -------- */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wavesCanvas');
  if (!canvas) return; // Safety check
  
  const ctx = canvas.getContext('2d', { alpha:true });
  let width, height, dpr;

  function resize(){
    dpr = window.devicePixelRatio || 1;
    
    // Get the actual size of the ocean section
    const oceanSection = document.getElementById('ocean');
    const oceanHeight = oceanSection.offsetHeight;
    
    // Set canvas dimensions including extra for sky overlap
    canvas.style.height = `${oceanHeight + (0.1 * window.innerHeight)}px`;
    
    width = canvas.clientWidth * dpr;
    height = canvas.clientHeight * dpr;
    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener('resize', resize);
  resize();

  /* -------- DRAW ONE LAYER -------- */
  function drawLayer({color, amp, base, λ, speed}, t){
    const A = amp * height;            // amplitude in device px
    const y0 = base * height;          // baseline
    const off = (t * speed) % λ;       // horizontal phase shift

    ctx.beginPath();
    ctx.moveTo(0, y0);

    // Use fixed step size for smoother waves
    for(let x = -λ; x <= width + λ; x += 8){
      const y = y0 + Math.sin((x + off) * 2*Math.PI / λ) * A;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);         // close + fill downwards
    ctx.lineTo(0, height);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
  }

  /* -------- MAIN LOOP -------- */
  let t0 = null;
  function animate(ts){
    if(!t0) t0 = ts;
    const time = (ts - t0) / 1000;     // seconds since start

    ctx.clearRect(0, 0, width, height); // wipe
    
    // Draw back-to-front (reverse array order)
    for(let i = LAYERS.length-1; i >= 0; i--) {
      drawLayer(LAYERS[i], time);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});

/* -------- ANIMATE SHORELINE WAVE -------- */
const shoreline = document.querySelector('.wave.shoreline path[data-amp]');
let st = 0;

function breatheShoreline() {
  if (!shoreline) return;
  
  st += 0.02;
  const A = +shoreline.dataset.amp || 12;
  const CTR = +shoreline.dataset.ctrl || 25;
  
  const y = 40 + A * Math.sin(st);
  const cy = 40 + CTR * Math.sin(st);
  
  const d = `M0 ${y} Q600 ${cy} 1200 ${y} V120 H0 Z`;
  
  shoreline.setAttribute('d', d);
  if (shoreline.nextElementSibling) {
    shoreline.nextElementSibling.setAttribute('d', d);
  }
  
  requestAnimationFrame(breatheShoreline);
}
breatheShoreline();

/* fade the site title once the sand band scrolls into view */
const title = document.getElementById('site-title');
const sandTop = document.getElementById('sand').offsetTop;
window.addEventListener('scroll', () => {
  const trigger = sandTop - 60; // 60px buffer
  if (window.scrollY >= trigger) { title.classList.add('hide'); }
  else { title.classList.remove('hide'); }
});
