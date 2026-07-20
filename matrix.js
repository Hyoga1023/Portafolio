(function () {
  const canvas = document.getElementById("pixi-canvas");
  const ctx    = canvas.getContext("2d");

  /* Katakanas + números + letras + caracteres especiales */
  const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>{}[]()//\\|!@#$%^&*+=~?;:_-";

  const isMobile = () => window.innerWidth <= 768;

  let W, H, cols, drops, speeds, alphas, fontSize;

  function resize() {
    W          = canvas.width  = window.innerWidth;
    H          = canvas.height = window.innerHeight;
    fontSize   = isMobile() ? 13 : 16;
    cols       = Math.floor(W / fontSize);
    drops      = Array.from({ length: cols }, () => Math.random() * -50);
    speeds     = Array.from({ length: cols }, () => 0.08 + Math.random() * 0.18);
    alphas     = Array.from({ length: cols }, () => 0.2  + Math.random() * 0.35);
  }

  function draw() {
    /* Trail — estela de desvanecimiento */
    ctx.fillStyle = "rgba(10,10,10,0.7)";
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${fontSize}px "Space Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const y    = drops[i] * fontSize;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      /* Cabeza — amarillo pálido con glow */
      if (drops[i] > 0) {
        ctx.shadowBlur  = 5;
        ctx.shadowColor = "#eeb703";
        ctx.fillStyle   = "rgba(255,233,154,0.55)";
        ctx.fillText(char, i * fontSize, y);
        ctx.shadowBlur  = 0;
      }

      /* Cuerpo */
      const bodyChar = CHARS[Math.floor(Math.random() * CHARS.length)];
      const bodyY    = y - fontSize;
      if (bodyY > 0) {
        ctx.fillStyle = `rgba(238,183,3,${alphas[i] * 0.45})`;
        ctx.fillText(bodyChar, i * fontSize, bodyY);
      }

      /* Cola larga — 40 filas de desvanecimiento */
      for (let t = 2; t < 40; t++) {
        const tailY = y - fontSize * t;
        if (tailY > 0) {
          const tailAlpha = alphas[i] * (1 - t / 38) * 0.8;
          ctx.fillStyle   = `rgba(238,183,3,${tailAlpha})`;
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            i * fontSize, tailY
          );
        }
      }

      /* Avanza la gota */
      drops[i] += speeds[i];

      /* Reset aleatorio al salir de pantalla */
      if (drops[i] * fontSize > H && Math.random() > 0.975) {
        drops[i]  = Math.random() * -30;
        speeds[i] = 0.08 + Math.random() * 0.18;
        alphas[i] = 0.2  + Math.random() * 0.35;
      }
    }
  }

  let raf;
  function loop() { draw(); raf = requestAnimationFrame(loop); }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    loop();
  });

  resize();
  loop();
})();