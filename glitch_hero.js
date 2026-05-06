(function () {

  /* ============================================================
     PARTE 1 — CÓDIGO ESTÁTICO DE FONDO
     Inyecta las líneas de código en el hero antes del canvas
  ============================================================ */
  (function buildCodeBg() {
    /* Evitar duplicado si se recarga */
    if (document.getElementById("glitch-code-bg")) return;

    const lines = [
      "const portfolio = new Experience({ dev: 'Cesar Martinez', stack: ['HTML','CSS','JS','GSAP','PixiJS'] });",
      "gsap.timeline().to('.hero', { opacity:1, y:0, duration:.8, ease:'power2.out' });",
      "function initParticles(canvas) { const ctx = canvas.getContext('2d'); requestAnimationFrame(loop); }",
      "ScrollTrigger.create({ trigger:'#sobre', start:'top 75%', onEnter:() => animateSobre() });",
      "const shader = `precision mediump float; uniform float uTime; void main() { gl_FragColor = vec4(col,1.0); }`;",
      "export default class CesarDev extends FrontEnd { constructor(){ super(); this.passion = Infinity; } }",
      "pixi.ticker.add(delta => { particles.forEach(p => { p.x += p.vx * delta; p.y += p.vy * delta; }); });",
      "const swal = Swal.fire({ background:'#111', confirmButtonColor:'#eeb703', title:'Bienvenido' });",
      "@keyframes glitch { 0%,90%,100%{ transform:translate(0); } 92%{ transform:translate(-3px,1px); } }",
      "import { gsap, ScrollTrigger, TextPlugin } from 'gsap/all'; gsap.registerPlugin(ScrollTrigger);",
      "const mm = gsap.matchMedia(); mm.add('(max-width:900px)', () => { ScrollTrigger.getAll().forEach(t=>t.disable()); });",
      "filter: blur(0px) contrast(1.1) grayscale(60%); transition: filter .4s ease, transform .4s ease;",
      "new PIXI.Application({ resizeTo:window, backgroundAlpha:0, antialias:true, view:canvas });",
      ":root { --amarillo: #eeb703; --negro: #0a0a0a; --font-title: 'Bebas Neue', sans-serif; }",
      "document.querySelectorAll('.skill-bar').forEach(bar => gsap.to(bar,{ width: bar.dataset.width+'%' }));",
    ];

    const classes = ["dim","dim","mid","dim","bright","dim","mid","dim","bright","dim","mid","dim","bright","dim","mid"];

    /* Estilos del contenedor inyectados dinámicamente */
    const style = document.createElement("style");
    style.textContent = `
      #glitch-code-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: .6rem;
        padding: 2rem 3rem;
        overflow: hidden;
        pointer-events: none;
      }
      .gcb-line {
        font-family: 'Space Mono', monospace;
        font-size: clamp(.55rem, 1vw, .75rem);
        letter-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
      }
      .gcb-line.dim    { color: rgba(51,51,51,0.55); }
      .gcb-line.mid    { color: rgba(238,183,3,0.12); }
      .gcb-line.bright { color: rgba(238,183,3,0.22); }

      /* Vignette para legibilidad del hero content */
      #glitch-vignette {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        background:
          radial-gradient(ellipse 65% 85% at 28% 50%, rgba(10,10,10,0.88) 0%, transparent 100%),
          linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 55%, transparent 100%);
      }

      @media (max-width: 768px) {
        #glitch-code-bg { padding: 1rem; gap: .4rem; }
      }
    `;
    document.head.appendChild(style);

    const hero = document.getElementById("hero");

    /* Contenedor de líneas */
    const bg = document.createElement("div");
    bg.id = "glitch-code-bg";
    lines.forEach((text, i) => {
      const div = document.createElement("div");
      div.className = `gcb-line ${classes[i % classes.length]}`;
      div.textContent = text;
      bg.appendChild(div);
    });

    /* Vignette */
    const vignette = document.createElement("div");
    vignette.id = "glitch-vignette";

    /* Insertar antes del canvas */
    const canvas = document.getElementById("pixi-canvas");
    hero.insertBefore(bg, canvas);
    hero.insertBefore(vignette, canvas);
  })();


  /* ============================================================
     PARTE 2 — GLITCH CANVAS (caótico, multi-franja, aleatorio)
  ============================================================ */
  (function initGlitch() {
    const canvas = document.getElementById("pixi-canvas");
    const ctx    = canvas.getContext("2d");
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    /* ---- Franjas activas ---- */
    let glitches  = [];
    let nextGlitch = 0;

    /* Genera entre 1 y 4 franjas en posiciones completamente aleatorias */
    function spawnGlitches() {
      glitches   = [];
      const count = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < count; i++) {
        glitches.push({
          y      : Math.random() * H,
          height : 2 + Math.random() * 28,
          shift  : (Math.random() - 0.5) * 60,
          life   : 40  + Math.random() * 120,
          born   : performance.now(),
          color  : Math.random() > 0.6
            ? `rgba(238,183,3,${0.08 + Math.random() * .18})`
            : `rgba(255,107,0,${0.05 + Math.random() * .12})`,
        });
      }
      /* Próximo evento*/
      nextGlitch = performance.now() + 60 + Math.random() * 600;
    }

    /* Scanline continuo sutil */
    let scanY     = 0;
    const scanSpd = 0.4 + Math.random() * 0.3;

    function draw(now) {
      ctx.clearRect(0, 0, W, H);

      /* Scanline */
      scanY += scanSpd;
      if (scanY > H) scanY = 0;
      const sg = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 4);
      sg.addColorStop(0,   "transparent");
      sg.addColorStop(0.7, "rgba(238,183,3,0.04)");
      sg.addColorStop(1,   "rgba(238,183,3,0.09)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 60, W, 64);

      /* Spawn si toca */
      if (now >= nextGlitch) spawnGlitches();

      /* Dibuja franjas activas */
      glitches.forEach(g => {
        const progress = (now - g.born) / g.life;
        if (progress >= 1) return;
        const alpha = (1 - progress) * 0.85;

        /* Franja principal */
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.rect(0, g.y, W, g.height);
        ctx.clip();
        ctx.fillStyle = g.color;
        ctx.fillRect(0, g.y, W, g.height);
        /* Borde superior brillante */
        ctx.fillStyle = `rgba(238,183,3,${alpha * 0.6})`;
        ctx.fillRect(0, g.y, W, 1);
        ctx.restore();

        /* Fantasma desplazado — señal dañada */
        ctx.save();
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.rect(g.shift > 0 ? g.shift : 0, g.y, W - Math.abs(g.shift), g.height);
        ctx.clip();
        ctx.fillStyle = "rgba(255,107,0,0.25)";
        ctx.fillRect(g.shift, g.y, W, g.height);
        ctx.restore();
      });

      /* Limpiar expiradas */
      glitches = glitches.filter(g => (now - g.born) < g.life);

      /* Ruido RGB ocasional */
      if (Math.random() < 0.08) {
        ctx.fillStyle = `rgba(238,183,3,${Math.random() * 0.12})`;
        ctx.fillRect(0, Math.random() * H, W, 1 + Math.random() * 3);
      }

      requestAnimationFrame(draw);
    }

    nextGlitch = performance.now() + 100;
    requestAnimationFrame(draw);
  })();

})();